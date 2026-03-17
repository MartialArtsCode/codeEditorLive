document.addEventListener('DOMContentLoaded', () => {
    // Initialize themes and mock routes
    initTheme();
    loadMockRoutes();

    // Assigning event handlers
    setupEventHandlers();

    // Auto-load default mode if there are no files
    if (Object.keys(files).length === 0) {
        loadMode('monolithic');
    }

    updateFileList();
    currentFile = findInitialFile() || null;
    switchFile(currentFile);

    // Initialize editors and components
    initMonaco();
    initFallbackTextarea();
    updatePreview();
    updateGraph();
});

// Function to setup event handlers
function setupEventHandlers() {
    document.getElementById('new-file').onclick = addNewFile;
    document.getElementById('export-zip').onclick = exportToZip;
    document.getElementById('mock-api-btn').onclick = openMockModal;
    document.getElementById('theme-toggle').onclick = toggleTheme;

    // Modal events
    document.getElementById('add-route-btn').onclick = handleAddRoute;
    document.getElementById('close-modal').onclick = () => document.getElementById('mock-modal').close();

    document.getElementById('save-files').onclick = saveToStorage;
    document.getElementById('refresh-graph').onclick = updateGraph;

    document.getElementById('load-users').onclick = loadUsers;
    document.getElementById('clear-all').onclick = clearAllData;

    document.getElementById('mode-select').onchange = e => loadMode(e.target.value);

    document.addEventListener('click', closeContextMenus);
}

// Function to find the initial file to switch to
function findInitialFile() {
    return Object.keys(files).find(f => f.endsWith('.html'));
}

// Function to load users via API
async function loadUsers() {
    try {
        const res = await fetch('/api/users');
        const data = await res.json();
        alert('Mock users:\n' + data.map(u => u.name).join('\n'));
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

// Function to clear all data
function clearAllData() {
    if (confirm('Clear everything?')) {
        localStorage.removeItem('browser-ide-files');
        location.reload();
    }
}

// Function to close context menus when clicking outside
function closeContextMenus(e) {
    if (!e.target.closest('.file-nav li')) {
        document.querySelectorAll('.context-menu').forEach(m => m.style.display = 'none');
    }
}

// Function to handle adding a new route
function handleAddRoute() {
    // add route logic implementation
}
