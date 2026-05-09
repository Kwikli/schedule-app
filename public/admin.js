let data = {};
let password = "";

async function login() {

    password = document.getElementById('pass').value;

    try {

        const response = await fetch('/api/schedule');

        if (!response.ok) {
            alert('Ошибка загрузки расписания');
            return;
        }

        data = await response.json();

        document.getElementById('admin').style.display = 'block';

        render();

    } catch (error) {

        console.log(error);

        alert('Ошибка подключения к серверу');

    }
}

function render() {

    const container = document.getElementById('groups');
    container.innerHTML = '';

    for (let group in data) {

        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2>${group}</h2>

        <button 
            onclick="deleteGroup('${group}')"
            style="
                background:red;
                color:white;
                border:none;
                padding:6px 10px;
                border-radius:6px;
                cursor:pointer;
            "
                >
                    🗑 Удалить
                </button>
            </div>
        `;

        for (let day in data[group]) {

            const dayBlock = document.createElement('div');
            dayBlock.innerHTML = `<h3>${day}</h3>
                <button onclick="addLesson('${group}', '${day}')">+ Пара</button>
            `;

            data[group][day].forEach((lesson, i) => {

                const lessonDiv = document.createElement('div');

                lessonDiv.innerHTML = `
                    <input value="${lesson.time}" placeholder="Время"
                        onchange="data['${group}']['${day}'][${i}].time=this.value">

                    <input value="${lesson.subject}" placeholder="Предмет"
                        onchange="data['${group}']['${day}'][${i}].subject=this.value">

                    <button onclick="deleteLesson('${group}','${day}',${i})">❌</button>
                `;

                dayBlock.appendChild(lessonDiv);
            });

            card.appendChild(dayBlock);
        }

        container.appendChild(card);
    }
}

function addGroup() {

    const name = document.getElementById('newGroup').value;

    if (!name) return;

    data[name] = {
        "Понедельник": [],
        "Вторник": [],
        "Среда": [],
        "Четверг": [],
        "Пятница": [],
        "Суббота": [],
        "Воскресенье": []
    };

    render();
}

function deleteGroup(groupName) {

    const confirmDelete = confirm(
        `Удалить группу "${groupName}"?`
    );

    if (!confirmDelete) return;

    delete data[groupName];

    render();
}

function addLesson(groupName, day) {

    data[groupName][day].push({
        time: "",
        subject: ""
    });

    render();
}

function deleteLesson(groupName, day, index) {

    data[groupName][day].splice(index, 1);

    render();
}

function editLesson(groupName, index, field, value) {

    data[groupName][index][field] = value;
}

async function save() {

    try {

        const response = await fetch('/api/schedule', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': password
            },

            body: JSON.stringify(data)

        });

        // Неверный пароль
        if (response.status === 403) {

            alert('❌ Неверный пароль');

            return;
        }

        // Ошибка сервера
        if (!response.ok) {

            alert('Ошибка сервера');

            return;
        }

        alert('✅ Сохранено в MongoDB');

    } catch (error) {

        console.log(error);

        alert('Ошибка подключения');

    }
}