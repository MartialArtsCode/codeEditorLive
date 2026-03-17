let mockRoutes = {};

function loadMockRoutes() {
    const saved = localStorage.getItem('mock-routes');
    mockRoutes = saved ? JSON.parse(saved) : initializeDefaultRoutes();
}

function initializeDefaultRoutes() {
    return {
        'GET /api/users': JSON.stringify([
            { id: 1, name: "Leanne Graham" },
            { id: 2, name: "Ervin Howell" }
        ]),
        'GET /api/todos/:id': JSON.stringify({ id: 1, title: "Todo #1", completed: false })
    };
}

function saveMockRoutes() {
    localStorage.setItem('mock-routes', JSON.stringify(mockRoutes));
}

function openMockModal() {
    renderRoutesList();
    document.getElementById('mock-modal').showModal();
}

function renderRoutesList() {
    const container = document.getElementById('routes-list');
    container.innerHTML = '';
    
    Object.keys(mockRoutes).forEach(route => {
        const div = createRouteItem(route);
        container.appendChild(div);
    });

    addDeleteRouteHandlers(container);
}

function createRouteItem(route) {
    const div = document.createElement('div');
    div.className = 'route-item';

    const strong = document.createElement('strong');
    strong.textContent = route;

    const btn = document.createElement('button');
    btn.textContent = '×';
    btn.className = 'delete-route';
    btn.dataset.route = route;

    div.appendChild(strong);
    div.appendChild(document.createTextNode(' '));
    div.appendChild(btn);
    return div;
}

function addDeleteRouteHandlers(container) {
    const deleteButtons = container.querySelectorAll('.delete-route');
    deleteButtons.forEach(button => {
        button.onclick = () => deleteRoute(button.dataset.route);
    });
}

function deleteRoute(route) {
    if (confirm(`Are you sure you want to delete the route: ${route}?`)) {
        delete mockRoutes[route];
        saveMockRoutes();  // Update local storage after deletion
        renderRoutesList(); // Re-render the list to reflect changes
    }
}
