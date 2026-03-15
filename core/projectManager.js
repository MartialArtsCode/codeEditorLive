export const project = {
    files: {
        html: `<h1>Hello IDE</h1>
               <button onclick="loadUsers()">Load Users</button>
               <ul id="users"></ul>`,

        css: `body {
            font-family: sans-serif;
        }`,

        js: async function loadUsers() {
            const res = await fetch("/api/users");
            const users = await res.json();

            const ul = document.getElementById("users");
            users.forEach(u => {
                const li = document.createElement("li");
                li.textContent = u.name;
                ul.appendChild(li);
            });
        },

        backend: "/api/users"
    },
    active: "html"
};
