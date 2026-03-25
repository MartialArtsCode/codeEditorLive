function updatePreview() {
  const frame = document.getElementById('preview-frame');
  const doc = frame.contentDocument || frame.contentWindow.document;
  const errorBox = document.getElementById('preview-errors');
  errorBox.style.display = 'none';
  errorBox.innerHTML = '';

  let htmlFile = Object.keys(files).find(f => f.endsWith('.html')) || null;
  if (!htmlFile) {
    doc.open();
    doc.write(`<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:system-ui,sans-serif;color:#888;text-align:center;padding:40px;">
      <div>
        <div style="font-size:48px;margin-bottom:16px;">📄</div>
        <h2 style="margin:0 0 8px;color:#666;">No HTML file found</h2>
        <p style="margin:0;font-size:14px;">Add one with <strong>+ New File</strong> or switch project mode</p>
      </div>
    </div>`);
    doc.close();
    return;
  }

  let html = files[htmlFile];

  const css = Object.keys(files).filter(f => f.endsWith('.css')).map(f => files[f]).join('\n');
  const js  = Object.keys(files).filter(f => f.endsWith('.js')).map(f => files[f]).join(';\n');

  html = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
  html = html.replace(/<\/body>/i, `<script>${js}<\/script></body>`);

  // Serialize mock routes as data for the iframe's fetch interceptor
  const routeData = JSON.stringify(mockRoutes);

  doc.open();
  doc.write(`
    <script>
      const mockRouteData = ${routeData};
      function matchRoute(path, route) {
        const regex = new RegExp('^' + route.replace(/:([^\\/]+)/g, '([^\\/]+)') + '$');
        const match = path.match(regex);
        if (!match) return null;
        const params = {};
        (route.match(/:([^\\/]+)/g) || []).forEach((p, i) => {
          params[p.slice(1)] = match[i + 1];
        });
        return params;
      }
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        const method = (init && init.method || 'GET').toUpperCase();
        for (const [route, responseBody] of Object.entries(mockRouteData)) {
          const parts = route.split(' ');
          const rMethod = parts[0];
          const rPath = parts[1];
          if (rMethod === method) {
            const params = matchRoute(url, rPath);
            if (params !== null) {
              return new Response(responseBody, {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            }
          }
        }
        return originalFetch(input, init);
      };
    <\/script>
    ${html}
  `);
  doc.close();

  frame.contentWindow.onerror = (msg, url, line) => {
    errorBox.innerHTML += `<div>Error: ${msg} at ${url}:${line}</div>`;
    errorBox.style.display = 'block';
  };
}
