const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3002;
const usersFilePath = path.join(__dirname, 'users.json');
const mealsFilePath = path.join(__dirname, 'meals.json');
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

// Load users from file
let users = [];
if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath);
    users = JSON.parse(data);
}

// Load meals from file
let meals = [];
if (fs.existsSync(mealsFilePath)) {
    const data = fs.readFileSync(mealsFilePath);
    meals = JSON.parse(data);
}

// Save meals to file
function saveMealsToFile() {
    fs.writeFileSync(mealsFilePath, JSON.stringify(meals, null, 2));
}

// Διαδρομή για τη σύνδεση του χρήστη
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        res.status(200).json({ success: true, username: user.username });
    } else {
        res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
});

// Διαδρομή για την αποθήκευση των δεδομένων γεύματος
app.post('/api/saveMealData', (req, res) => {
    const { userId, date, totalCalories, totalCarbs, totalProtein, totalFat, totalSugar, totalFiber, meals: mealData, averageRating, stressLevel, alcoholGlasses, waterLiters, sleepHours } = req.body;

    if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    let userMeals = meals.find(m => m.userId === userId);
    if (!userMeals) {
        userMeals = { userId, days: [] };
        meals.push(userMeals);
    }

    let dayMeals = userMeals.days.find(d => d.date === date);
    if (!dayMeals) {
        dayMeals = { date, totalCalories, totalCarbs, totalProtein, totalFat, totalSugar, totalFiber, meals: mealData, averageRating: averageRating || 0, stressLevel, alcoholGlasses, waterLiters, sleepHours };
        userMeals.days.push(dayMeals);
    } else {
        dayMeals.totalCalories = totalCalories;
        dayMeals.totalCarbs = totalCarbs;
        dayMeals.totalProtein = totalProtein;
        dayMeals.totalFat = totalFat;
        dayMeals.totalSugar = totalSugar;
        dayMeals.totalFiber = totalFiber;
        dayMeals.meals = mealData;
        dayMeals.averageRating = averageRating || dayMeals.averageRating;
        dayMeals.stressLevel = stressLevel;
        dayMeals.alcoholGlasses = alcoholGlasses;
        dayMeals.waterLiters = waterLiters;
        dayMeals.sleepHours = sleepHours;
    }

    saveMealsToFile();
    res.status(200).json({ success: true });
});

// Διαδρομή για την παροχή των δεδομένων των βαθμών γευμάτων
app.get('/api/getMealRatings', (req, res) => {
    res.status(200).json(meals);
});

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});