document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadMockRoutes();
    loadFromStorage();

    // Setup event handlers
    setupEventHandlers();

    // Auto-load default mode if there are no files
    if (Object.keys(files).length === 0) {
        loadMode('monolithic', true);
    }

    updateFileList();
    currentFile = findInitialFile() || null;
    switchFile(currentFile);

    // Initialize editors and components
    initMonaco();
    initFallbackTextarea();
    updatePreview();
    updateGraph();

    // Setup all event handlers
    function setupEventHandlers() {
        // File actions dropdown
        const fileSelect = document.getElementById('file-select');
        fileSelect.onchange = e => {
            const action = e.target.value;
            e.target.selectedIndex = 0;

            switch (action) {
                case 'new-file': addNewFile(); break;
                case 'save-files': saveToStorage(); break;
                case 'export-zip': exportToZip(); break;
                case 'refresh-graph': updateGraph(); break;
                case 'mock-api': openMockModal(); break;
                case 'theme-toggle': toggleTheme(); break;
                case 'load-users': loadUsers(); break;
                case 'clear-all': clearAllData(); break;
            }
        };

        // Mode selector
        document.getElementById('mode-select').onchange = e => loadMode(e.target.value);

        // Modal events
        document.getElementById('add-route-btn').onclick = handleAddRoute;
        document.getElementById('close-modal').onclick = () => document.getElementById('mock-modal').close();

        document.addEventListener('click', closeContextMenus);
    }

    // Find the initial file to display
    function findInitialFile() {
        return Object.keys(files).find(f => f.endsWith('.html'));
    }

    // Load users via API
    async function loadUsers() {
        try {
            const res = await fetch('/api/users');
            const data = await res.json();
            alert('Mock users:\n' + data.map(u => u.name).join('\n'));
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }

    // Clear all data
    function clearAllData() {
        if (confirm('Clear everything?')) {
            localStorage.removeItem('browser-ide-files');
            location.reload();
        }
    }

    // Close context menus when clicking outside
    function closeContextMenus(e) {
        if (!e.target.closest('.file-nav li')) {
            document.querySelectorAll('.context-menu').forEach(m => m.style.display = 'none');
        }
    }

    // Handle adding a new mock route
    function handleAddRoute() {
        const method = document.getElementById('route-method').value;
        const path = document.getElementById('route-path').value.trim();
        const response = document.getElementById('route-response').value.trim();
        if (!path || !response) return;

        try {
            JSON.parse(response);
        } catch {
            alert('Response must be valid JSON.');
            return;
        }

        const key = `${method} ${path}`;
        mockRoutes[key] = response;
        saveMockRoutes();
        renderRoutesList();

        document.getElementById('route-path').value = '';
        document.getElementById('route-response').value = '';
    }
});
