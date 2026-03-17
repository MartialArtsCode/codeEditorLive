let mockRoutes = {};

function loadMockRoutes() {
  const saved = localStorage.getItem('mock-routes');
  mockRoutes = saved ? JSON.parse(saved) : {
    'GET /api/users': () => ({ id: 1, name: "Leanne Graham" })
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
    const div = document.createElement('div');
    div.className = 'route-item';
    div.innerHTML = `<strong>${route}</strong> <button data-route="${route}" class="delete-route">×</button>`;
    container.appendChild(div);
  });
}
