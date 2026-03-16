let files = {};
let currentFile = null;
const isMobile = window.innerWidth <= 800;

function loadFromStorage() {
  const saved = localStorage.getItem('browser-ide-files');
  if (saved) files = JSON.parse(saved);
}

function saveToStorage() {
  localStorage.setItem('browser-ide-files', JSON.stringify(files));
}

function debounceSave() {
  clearTimeout(window.saveTimeout);
  window.saveTimeout = setTimeout(saveToStorage, 800);
}

function updateFileList() {
  const ul = document.getElementById('file-list');
  ul.innerHTML = '';
  Object.keys(files).sort().forEach(file => {
    const li = document.createElement('li');
    li.textContent = file;
    li.dataset.file = file;
    li.classList.toggle('active', file === currentFile);

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
          switchFile(currentFile || Object.keys(files)[0] || null);
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

    li.onclick = e => {
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
  } else if (window.monacoEditor) {
    window.monacoEditor.setValue(files[file] || '');
    monaco.editor.setModelLanguage(window.monacoEditor.getModel(), getLanguage(file));
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

function getLanguage(file) {
  if (!file) return 'plaintext';
  if (file.endsWith('.html')) return 'html';
  if (file.endsWith('.css')) return 'css';
  return 'javascript';
}