let files = {};
let currentFile = null;
const isMobile = window.innerWidth <= 800;

function addNewFile() {
    const path = prompt("Full path (folders supported):\nexample: src/components/Button.js", "index.html");
    if (!path) return;

    const ext = path.split('.').pop().toLowerCase();
    const defaultContent = getDefaultContent(ext);
    
    if (defaultContent) {
        files[path] = defaultContent;
        updateFileList();
        switchFile(path);
        saveToStorage();
    } else {
        alert("Unsupported file type.");
    }
}

function getDefaultContent(ext) {
    switch (ext) {
        case 'html':
            return '<!DOCTYPE html>\n<html><head><title>New</title></head><body><h1>Hello</h1></body></html>';
        case 'css':
            return '/* New styles */\nbody {}';
        case 'py':
            return 'print("Hello from Python")';
        case 'json':
            return '{\n  "key": "value"\n}';
        case 'md':
            return '# Markdown';
        default:
            return null;
    }
}

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
    Object.keys(files).sort().forEach(file => createFileListItem(ul, file));
}

function createFileListItem(ul, file) {
    const li = document.createElement('li');
    li.textContent = file;
    li.dataset.file = file;
    li.classList.toggle('active', file === currentFile);

    const menu = createContextMenu(file);
    li.appendChild(menu);

    li.addEventListener('contextmenu', e => {
        e.preventDefault();
        hideAllContextMenus();
        menu.style.display = 'block';
    });

    li.onclick = e => {
        if (e.target.tagName !== 'BUTTON') switchFile(file;
    };

    ul.appendChild(li);
}

function createContextMenu(file) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.innerHTML = `
        <button data-action="rename">Rename</button>
        <button data-action="delete">Delete</button>
    `;

    menu.addEventListener('click', e => {
        const action = e.target.dataset.action;
        if (action === 'delete') {
            handleDelete(file);
        } else if (action === 'rename') {
            handleRename(file);
        }
    });

    return menu;
}

function hideAllContextMenus() {
    document.querySelectorAll('.context-menu').forEach(m => m.style.display = 'none');
}

function handleDelete(file) {
    if (confirm(`Delete ${file}?`)) {
        delete files[file];
        if (currentFile === file) currentFile = null;
        updateFileList();
        switchFile(currentFile || Object.keys(files)[0] || null);
        saveToStorage();
    }
}

function handleRename(file) {
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
    let name = createUniqueFileName(ext);
    files[name] = getDefaultContent(type);
    updateFileList();
    switchFile(name);
    saveToStorage();
}

function createUniqueFileName(ext) {
    let name = `untitled${ext}`;
    let i = 1;
    while (files[name]) name = `untitled${i++}${ext}`;
    return name;
}

function getLanguage(file) {
    if (!file) return 'plaintext';
    const extension = file.split('.').pop().toLowerCase();
    switch (extension) {
        case 'html': return 'html';
        case 'css': return 'css';
        case 'js': return 'javascript';
        case 'py': return 'python';
        case 'json': return 'json';
        case 'md': return 'markdown';
        default: return 'plaintext';
    }
}
