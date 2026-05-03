const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const PASSWORD = "1234";

app.get('/api/schedule', (req, res) => {
    const data = fs.readFileSync('schedule.json');
    res.json(JSON.parse(data));
});

app.post('/api/schedule', (req, res) => {
    if (req.headers.authorization !== PASSWORD) {
        return res.status(403).send("Нет доступа");
    }

    fs.writeFileSync('schedule.json', JSON.stringify(req.body, null, 2));
    res.send("OK");
});

app.listen(3000, () => console.log("http://localhost:3000"));
