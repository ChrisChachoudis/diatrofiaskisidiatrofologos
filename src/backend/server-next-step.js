const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3003; // Χρησιμοποιήστε διαφορετική θύρα για τον νέο διακομιστή
const nextStepFilePath = path.join(__dirname, 'next-step.json');

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Διαδρομή για την αποθήκευση των δεδομένων του επόμενου βήματος
app.post('/api/saveNextStepData', (req, res) => {
    const { userId, date, sleepHours, waterLiters, alcoholGlasses, stressLevel } = req.body;

    if (!userId || !date) {
        return res.status(400).json({ success: false, message: 'User ID and date are required' });
    }

    let nextSteps = [];
    if (fs.existsSync(nextStepFilePath)) {
        const data = fs.readFileSync(nextStepFilePath);
        nextSteps = JSON.parse(data);
    }

    let userNextStep = nextSteps.find(ns => ns.userId === userId);
    if (!userNextStep) {
        userNextStep = { userId, days: [] };
        nextSteps.push(userNextStep);
    }

    let dayNextStep = userNextStep.days.find(d => d.date === date);
    if (!dayNextStep) {
        dayNextStep = { date, sleepHours, waterLiters, alcoholGlasses, stressLevel };
        userNextStep.days.push(dayNextStep);
    } else {
        dayNextStep.sleepHours = sleepHours;
        dayNextStep.waterLiters = waterLiters;
        dayNextStep.alcoholGlasses = alcoholGlasses;
        dayNextStep.stressLevel = stressLevel;
    }

    fs.writeFileSync(nextStepFilePath, JSON.stringify(nextSteps, null, 2));
    res.status(200).json({ success: true });
});

// Διαδρομή για την ανάκτηση των δεδομένων του επόμενου βήματος
app.get('/api/getNextStepData', (req, res) => {
    if (fs.existsSync(nextStepFilePath)) {
        const data = fs.readFileSync(nextStepFilePath);
        const nextSteps = JSON.parse(data);
        res.status(200).json(nextSteps);
    } else {
        res.status(200).json([]);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});