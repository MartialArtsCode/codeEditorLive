require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.55.1/min/vs' } });

if (window.cytoscape && window.cytoscapeDagre) {
  cytoscape.use(cytoscapeDagre);
}

let editor = null;
let currentFile = null;
let files = {}; // { filename: content }
let cy = null;  // cytoscape instance
let autoSaveTimeout = null;
const isMobile = window.innerWidth <= 800;

// Simple path-to-regexp inspired matcher for mock router
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

// In-memory mock router (used inside iframe via overridden fetch)
const mockRoutes = {
  'GET /api/users': () => new Response(JSON.stringify([
    { id: 1, name: 'Leanne Graham', city: 'Louisville' },
    { id: 2, name: 'Ervin Howell', city: 'Wisokyburgh' }
  ]), { status: 200, headers: { 'Content-Type': 'application/json' } }),

  'GET /api/todos/:id': (params) => new Response(JSON.stringify({
    id: params.id,
    title: `Todo ${params.id} - Mocked`,
    completed: Math.random() > 0.5
  }), { status: 200, headers: { 'Content-Type': 'application/json' } }),

  'POST /api/echo': async (req) => {
    const body = await req.json();
    return new Response(JSON.stringify({ echoed: body, receivedAt: new Date() }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function getLanguage(file) {
  if (!file) return 'plaintext';
  if (file.endsWith('.html')) return 'html';
  if (file.endsWith('.css')) return 'css';
  return 'javascript';
}

function loadFromStorage() {
  const saved = localStorage.getItem('browser-ide-files');
  if (saved) {
    files = JSON.parse(saved);
  }
  currentFile = Object.keys(files).find(f => f.endsWith('.html')) || null;
}

function saveToStorage() {
  localStorage.setItem('browser-ide-files', JSON.stringify(files));
}

function debounceSave() {
  clearTimeout(autoSaveTimeout);
  autoSaveTimeout = setTimeout(saveToStorage, 800);
}

function initMonaco() {
  if (isMobile) return; // skip on mobile
  require(['vs/editor/editor.main'], () => {
    if (editor) editor.dispose();
    if (!currentFile) return;
    editor = monaco.editor.create(document.getElementById('editor-container'), {
      value: files[currentFile] || '',
      language: getLanguage(currentFile),
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      tabSize: 2
    });
    editor.onDidChangeModelContent(() => {
      if (currentFile) {
        files[currentFile] = editor.getValue();
        debounceSave();
        updatePreview();
        updateGraph();
      }
    });
  });
}

function initFallbackTextarea() {
  if (!isMobile) return;
  const ta = document.getElementById('fallback-textarea');
  ta.value = files[currentFile] || '';
  ta.oninput = () => {
    if (currentFile) {
      files[currentFile] = ta.value;
      debounceSave();
      updatePreview();
      updateGraph();
    }
  };
  // basic highlight on blur/change
  ta.onblur = () => hljs.highlightElement(ta);
}

function updateFileList() {
  const ul = document.getElementById('file-list');
  ul.innerHTML = '';
  Object.keys(files).sort().forEach(file => {
    const li = document.createElement('li');
    li.textContent = file;
    li.dataset.file = file;
    li.classList.toggle('active', file === currentFile);

    // Context menu
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
      <button data-action="rename">Rename</button>
      <button data-action="delete">Delete</button>
    `;
    li.appendChild(menu);

    li.addEventListener('contextmenu', e => {
      e.preventDefault();
      document.querySelectorAll('.context-menu').forEach(m => m.style.display = 'none');
      menu.style.display = 'block';
    });

    menu.addEventListener('click', e => {
      const action = e.target.dataset.action;
      if (action === 'delete') {
        if (confirm(`Delete ${file}?`)) {
          delete files[file];
          if (currentFile === file) currentFile = null;
          updateFileList();
          switchFile(currentFile || Object.keys(files)[0]);
          saveToStorage();
        }
      } else if (action === 'rename') {
        const newName = prompt(`Rename ${file} to:`, file);
        if (newName && newName !== file && !files[newName]) {
          files[newName] = files[file];
          delete files[file];
          if (currentFile === file) currentFile = newName;
          updateFileList();
          switchFile(currentFile);
          saveToStorage();
        }
      }
    });

    li.onclick = (e) => {
      if (e.target.tagName !== 'BUTTON') switchFile(file);
    };

    ul.appendChild(li);
  });
}

function switchFile(file) {
  if (!file) return;
  currentFile = file;
  updateFileList();
  if (isMobile) {
    document.getElementById('fallback-textarea').value = files[file] || '';
  } else if (editor) {
    editor.setValue(files[file] || '');
    monaco.editor.setModelLanguage(editor.getModel(), getLanguage(file));
  }
  updatePreview();
}

function addNewFile(type) {
  const ext = type === 'html' ? '.html' : type === 'css' ? '.css' : '.js';
  let name = `untitled${ext}`;
  let i = 1;
  while (files[name]) name = `untitled${i++}${ext}`;
  files[name] = type === 'html' ? '<!DOCTYPE html>\n<html>\n<head>\n  <title>New</title>\n</head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>' :
                type === 'css'  ? '/* New */\nbody {}' : '// New\nconsole.log("hi");';
  updateFileList();
  switchFile(name);
  saveToStorage();
}

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
  let html = files[htmlFile] || '';

  // Inject CSS & JS (simple concatenation for demo)
  const css = Object.keys(files).filter(f => f.endsWith('.css')).map(f => files[f]).join('\n');
  const js  = Object.keys(files).filter(f => f.endsWith('.js')).map(f => files[f]).join(';\n');

  html = html.replace(/<\/head>/i, `<style>${css}</style></head>`);
  html = html.replace(/<\/body>/i, `<script>${js}</script></body>`);

  doc.open();
  doc.write(`
    <script>
      // Mock fetch interceptor for preview
      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const url = typeof input === 'string' ? input : input.url;
        const method = (init?.method || 'GET').toUpperCase();
        const key = \`\${method} \${url}\`;
        for (const [route, handler] of Object.entries(${JSON.stringify(mockRoutes)})) {
          const [rMethod, rPath] = route.split(' ');
          if (rMethod === method) {
            const params = matchRoute(url, rPath);
            if (params !== null) {
              const req = { json: async () => init?.body ? JSON.parse(init.body) : {} };
              const res = await handler(params, req);
              return res;
            }
          }
        }
        return originalFetch(input, init);
      };
    <\/script>
    ${html}
  `);
  doc.close();

  // Error capture
  frame.contentWindow.onerror = (msg, url, line) => {
    errorBox.innerHTML += `<div>Error: ${msg} at ${url}:${line}</div>`;
    errorBox.style.display = 'block';
  };
}

function parseDependencies() {
  const nodes = new Set();
  const edges = [];

  Object.keys(files).forEach(file => {
    nodes.add(file);
    const content = files[file];

    // Basic parsers (expand as needed)
    [...content.matchAll(/<link[^>]*href=["'](.*?)["']/gi)].forEach(m => {
      const t = m[1].trim();
      if (!t.startsWith('http') && !t.startsWith('//')) {
        edges.push({ source: file, target: t });
        nodes.add(t);
      }
    });

    [...content.matchAll(/<script[^>]*src=["'](.*?)["']/gi)].forEach(m => {
      const t = m[1].trim();
      if (!t.startsWith('http') && !t.startsWith('//')) {
        edges.push({ source: file, target: t });
        nodes.add(t);
      }
    });

    [...content.matchAll(/import.*from\s*["'](.*?)["']/g)].forEach(m => {
      const t = m[1].trim();
      if (!t.startsWith('http')) {
        edges.push({ source: file, target: t });
        nodes.add(t);
      }
    });
  });

  return Array.from(nodes).map(id => ({ data: { id, label: id } }))
    .concat(edges.map(e => ({ data: { source: e.source, target: e.target } })));
}

function updateGraph() {
  const container = document.getElementById('dependency-graph');
  if (cy) cy.destroy();

  cy = cytoscape({
    container,
    elements: parseDependencies(),
    style: [
      { selector: 'node', style: { 'background-color': '#90caf9', 'label': 'data(label)', 'text-valign': 'center', 'color': '#000' } },
      { selector: 'edge', style: { 'width': 2, 'line-color': '#555', 'target-arrow-color': '#555', 'target-arrow-shape': 'triangle', 'curve-style': 'bezier' } }
    ],
    layout: { name: 'dagre', rankDir: 'TB', nodeSep: 40 }
  });

  cy.fit();
}

function loadMode(mode) {
  const hasExistingFiles = Object.keys(files).length > 0;
  if (hasExistingFiles && !confirm(`Load ${mode} template? (current files replaced)`)) return;
  files = { ...starterTemplates[mode] };
  currentFile = Object.keys(files).find(f => f.endsWith('.html')) || null;
  updateFileList();
  switchFile(currentFile);
  saveToStorage();
}

// Starter templates (same as before, omitted for brevity)
const starterTemplates = { /* ... copy from previous version ... */ };

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();

  // If storage was empty, force the default monolithic template.
  if (Object.keys(files).length === 0) {
    console.log('No files in storage — loading default monolithic template');
    loadMode('monolithic');
  }

  updateFileList();
  if (!currentFile) {
    currentFile = Object.keys(files).find(f => f.endsWith('.html')) || null;
  }
  switchFile(currentFile);

  initMonaco();
  initFallbackTextarea();
  updatePreview();
  updateGraph();

  document.getElementById('new-html').onclick = () => addNewFile('html');
  document.getElementById('new-css').onclick  = () => addNewFile('css');
  document.getElementById('new-js').onclick   = () => addNewFile('js');

  document.getElementById('save-files').onclick = saveToStorage;

  document.getElementById('refresh-graph').onclick = updateGraph;

  document.getElementById('load-users').onclick = () => {
    // Demo: fetch from mock router
    fetch('/api/users')
      .then(r => r.json())
      .then(data => alert('Mock API Users:\n' + data.map(u => u.name).join('\n')))
      .catch(err => alert('Mock fetch error: ' + err));
  };

  document.getElementById('clear-all').onclick = () => {
    if (confirm('Clear all files & storage?')) {
      localStorage.removeItem('browser-ide-files');
      location.reload();
    }
  };

  document.getElementById('mode-select').onchange = e => loadMode(e.target.value);

  // Close context menus on click outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.file-nav li')) {
      document.querySelectorAll('.context-menu').forEach(m => m.style.display = 'none');
    }
  });
});
