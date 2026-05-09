let data = {};
let password = "";

// ======================
// 🔐 Вход в админку
// ======================

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

// ======================
// 🎨 Отрисовка интерфейса
// ======================

function render() {

    const container = document.getElementById('groups');

    container.innerHTML = '';

    // Проходим по всем группам
    for (let groupName in data) {

        const groupCard = document.createElement('div');

        groupCard.className = 'card';

        // Верхняя часть карточки
        groupCard.innerHTML = `
            <div class="group-header">
                <h3>${groupName}</h3>

                <div>
                    <button onclick="addLesson('${groupName}')">
                        ➕ Добавить пару
                    </button>

                    <button onclick="deleteGroup('${groupName}')">
                        ❌ Удалить группу
                    </button>
                </div>
            </div>
        `;

        // Занятия
        data[groupName].forEach((lesson, index) => {

            const lessonDiv = document.createElement('div');

            lessonDiv.className = 'lesson';

            lessonDiv.innerHTML = `
                <input 
                    value="${lesson.day || ''}" 
                    placeholder="День"
                    onchange="editLesson('${groupName}', ${index}, 'day', this.value)"
                >

                <input 
                    value="${lesson.time || ''}" 
                    placeholder="Время"
                    onchange="editLesson('${groupName}', ${index}, 'time', this.value)"
                >

                <input 
                    value="${lesson.subject || ''}" 
                    placeholder="Предмет"
                    onchange="editLesson('${groupName}', ${index}, 'subject', this.value)"
                >

                <button onclick="deleteLesson('${groupName}', ${index})">
                    🗑
                </button>
            `;

            groupCard.appendChild(lessonDiv);

        });

        container.appendChild(groupCard);
    }
}

// ======================
// ➕ Добавить группу
// ======================

function addGroup() {

    const input = document.getElementById('newGroup');

    const groupName = input.value.trim();

    if (!groupName) {
        alert('Введите название группы');
        return;
    }

    if (data[groupName]) {
        alert('Такая группа уже существует');
        return;
    }

    data[groupName] = [];

    input.value = '';

    render();
}

// ======================
// ❌ Удалить группу
// ======================

function deleteGroup(groupName) {

    const confirmDelete = confirm(
        `Удалить группу "${groupName}"?`
    );

    if (!confirmDelete) return;

    delete data[groupName];

    render();
}

// ======================
// ➕ Добавить занятие
// ======================

function addLesson(groupName) {

    data[groupName].push({
        day: '',
        time: '',
        subject: ''
    });

    render();
}

// ======================
// 🗑 Удалить занятие
// ======================

function deleteLesson(groupName, index) {

    data[groupName].splice(index, 1);

    render();
}

// ======================
// ✏️ Редактирование
// ======================

function editLesson(groupName, index, field, value) {

    data[groupName][index][field] = value;
}

// ======================
// 💾 Сохранение
// ======================

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