
let data = {};

fetch('/api/schedule')
.then(r => r.json())
.then(json => {
    data = json;
    const select = document.getElementById('groups');

    for (let g in data) {
        const opt = document.createElement('option');
        opt.value = g;
        opt.textContent = g;
        select.appendChild(opt);
    }

    select.onchange = () => {
        const group = select.value;
        const container = document.getElementById('schedule');
        container.innerHTML = data[group].map(d => `<p>${d.day}: ${d.subject}</p>`).join('');
    }

    // select.onload = () => {
    //     const group = select.value;
    //     const container = document.getElementById('schedule');
    //     container.innerHTML = data[group].map(d => `<p>${d.day}: ${d.subject}</p>`).join('');
    // }
});