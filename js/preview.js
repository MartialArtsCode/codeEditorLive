function updatePreview() {
  const frame = document.getElementById('preview-frame');
  const doc = frame.contentDocument || frame.contentWindow.document;
  const errorBox = document.getElementById('preview-errors');
  errorBox.style.display = 'none';
  errorBox.innerHTML = '';

  let htmlFile = Object.keys(files).find(f => f.endsWith('.html')) || null;
  if (!htmlFile) {
    doc.open();
    doc.write('<h2 style="text-align:center; color:#666; padding:40px;">No HTML file found<br><small>Add one with +HTML button or switch mode</small></h2>');
    doc.close();
    return;
  }

  let html = files[htmlFile];

  const css = Object.keys(files).filter(f => f.endsWith('.css')).map(f => files[f]).join('\n');
  const js  = Object.keys(files).filter(f => f.endsWith('.js')).map(f => files[f]).join(';\n');

  html = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
  html = html.replace(/<\/body>/i, `<script>${js}</script></body>`);

  doc.open();
  doc.write(`
    <script>
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        const method = (init?.method || 'GET').toUpperCase();
        const key = \`\${method} \${url}\`;
        ${JSON.stringify(mockRoutes)}
        for (const [route, handler] of Object.entries(mockRoutes)) {
          const [rMethod, rPath] = route.split(' ');
          if (rMethod === method) {
            const params = matchRoute(url, rPath);
            if (params !== null) {
              const req = { json: async () => init?.body ? JSON.parse(init.body) : {} };
              return await handler(params, req);
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

// Simple mock router (expand as needed)
const mockRoutes = {
  'GET /api/users': () => new Response(JSON.stringify([
    { id: 1, name: "Leanne Graham" },
    { id: 2, name: "Ervin Howell" }
  ]), { status: 200, headers: { 'Content-Type': 'application/json' } }),

  'GET /api/todos/:id': (params) => new Response(JSON.stringify({
    id: params.id,
    title: `Todo #${params.id}`,
    completed: false
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
};

function matchRoute(path, route) {
  const regex = new RegExp('^' + route.replace(/:([^/]+)/g, '([^/]+)') + '$');
  const match = path.match(regex);
  if (!match) return null;
  const params = {};
  route.match(/:([^/]+)/g)?.forEach((p, i) => {
    params[p.slice(1)] = match[i + 1];
  });
  return params;
}