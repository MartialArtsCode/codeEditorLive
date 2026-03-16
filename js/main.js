document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();

  // Auto-load default if empty
  if (Object.keys(files).length === 0) {
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

  document.getElementById('load-users').onclick = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      alert('Mock users:\n' + data.map(u => u.name).join('\n'));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  document.getElementById('clear-all').onclick = () => {
    if (confirm('Clear everything?')) {
      localStorage.removeItem('browser-ide-files');
      location.reload();
    }
  };

  document.getElementById('mode-select').onchange = e => loadMode(e.target.value);

  document.addEventListener('click', e => {
    if (!e.target.closest('.file-nav li')) {
      document.querySelectorAll('.context-menu').forEach(m => m.style.display = 'none');
    }
  });
});