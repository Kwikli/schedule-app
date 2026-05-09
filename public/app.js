Notification.requestPermission();
let data = {};

fetch('/api/schedule')
.then(r => r.json())
.then(json => {
    data = json;

    const select = document.getElementById('groups');

    select.innerHTML = '<option value="">-- Выберите группу --</option>';

    for (let group in data) {
        const opt = document.createElement('option');
        opt.value = group;
        opt.textContent = group;
        select.appendChild(opt);
    }

    select.addEventListener('change', showSchedule);
});

function showSchedule() {

    const group = document.getElementById('groups').value;
    const container = document.getElementById('schedule');

    if (!group || !data[group]) {
        container.innerHTML = '';
        return;
    }

    let html = '';

    for (let day in data[group]) {

        html += `
            <div class="card">
                <div class="day-title">${day}</div>
        `;

        const lessons = data[group][day];

        if (!lessons || lessons.length === 0) {
            html += `<div class="empty">Нет занятий</div>`;
        } else {

            lessons.forEach(l => {
                html += `
                    <div class="lesson">
                        <div class="subject">${l.subject || '-'}</div>
                        <div class="time">${l.time || '-'}</div>
                    </div>
                `;
            });

        }

        html += `</div>`;
    }

    container.innerHTML = html;
}

function checkLessons() {

    const now = new Date();

    // День недели
    const days = [
        "Воскресенье",
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота"
    ];

    const today = days[now.getDay()];

    // Выбранная группа
    const group = document.getElementById('groups').value;

    if (!group || !data[group]) return;

    const lessons = data[group][today];

    if (!lessons) return;

    // Текущее время
    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    lessons.forEach(lesson => {

        if (!lesson.time) return;

        const [hours, minutes] = lesson.time.split(':');

        const lessonMinutes =
            parseInt(hours) * 60 + parseInt(minutes);

        // 🔥 За 10 минут до пары
        if (lessonMinutes - currentMinutes === 10) {

            showNotification(lesson);

        }

    });

}

function showNotification(lesson) {

    // Проверяем разрешение
    if (Notification.permission !== 'granted') return;

    new Notification('📚 Скоро пара', {

        body:
            `${lesson.subject}\n⏰ ${lesson.time}`,

        icon:
            'https://cdn-icons-png.flaticon.com/512/3135/3135755.png'

    });

}

setInterval(checkLessons, 60000);