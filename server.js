const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://admin1:12346@ac-kkox6wi-shard-00-00.dxuoa90.mongodb.net:27017,ac-kkox6wi-shard-00-01.dxuoa90.mongodb.net:27017,ac-kkox6wi-shard-00-02.dxuoa90.mongodb.net:27017/?ssl=true&replicaSet=atlas-ysxoti-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('MongoDB подключена'))
.catch(err => console.log(err));

app.use(express.json());
app.use(express.static('public'));

const PASSWORD = "1234";

const ScheduleSchema = new mongoose.Schema({
    data: Object
});

const Schedule = mongoose.model('Schedule', ScheduleSchema);

app.get('/api/schedule', async (req, res) => {

    let schedule = await Schedule.findOne();

    if (!schedule) {
        schedule = await Schedule.create({
            data: {}
        });
    }

    res.json(schedule.data);
});

app.post('/api/schedule', async (req, res) => {

    if (req.headers.authorization !== PASSWORD) {
        return res.status(403).send("Нет доступа");
    }

    let schedule = await Schedule.findOne();

    if (!schedule) {

        schedule = new Schedule({
            data: req.body
        });

    } else {

        schedule.data = req.body;

    }

    await schedule.save();

    res.send("OK");
});

app.listen(3000, () => console.log("http://localhost:3000"));


