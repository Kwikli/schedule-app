
let data = {};
let password = "";

function login() {
    password = document.getElementById('pass').value;

    fetch('/api/schedule')
    .then(r => r.json())
    .then(json => {
        data = json;
        document.getElementById('admin').style.display = 'block';
        render();
    });
}

function render() {
    const container = document.getElementById('groups');
    container.innerHTML = '';

    for (let g in data) {
        const div = document.createElement('div');
        div.className = 'card';

        div.innerHTML = `
            <h3>${g}</h3>
            <button onclick="deleteGroup('${g}')">Удалить</button>
            <button onclick="addLesson('${g}')">+ Пара</button>
        `;

        data[g].forEach((l, i) => {
            div.innerHTML += `
                <div>
                    <input value="${l.day}" onchange="edit('${g}',${i},'day',this.value)">
                    <input value="${l.subject}" onchange="edit('${g}',${i},'subject',this.value)">
                </div>
            `;
        });

        container.appendChild(div);
    }
}

function addGroup() {
    const name = document.getElementById('newGroup').value;
    if (!name) return;

    data[name] = [];
    render();
}

function deleteGroup(g) {
    delete data[g];
    render();
}

function addLesson(g) {
    data[g].push({day:'', subject:''});
    render();
}

function edit(g, i, field, value) {
    data[g][i][field] = value;
}

function save() {
    fetch('/api/schedule', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': password
        },
        body: JSON.stringify(data)
    })
    .then(r => {
        if (r.status === 403) alert('Неверный пароль');
        else alert('Сохранено');
    });
}
