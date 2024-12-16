const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;
const usersFilePath = path.join(__dirname, 'users.json');
const foodsFilePath = path.join(__dirname, 'foods_data.txt');

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

// Save users to file
function saveUsersToFile() {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Load foods from file
let foods = [];
if (fs.existsSync(foodsFilePath)) {
    const data = fs.readFileSync(foodsFilePath, 'utf8');
    foods = data.split('\n').map(line => {
        const [name, category, calories, carbs, protein, fat, sugar, fiber] = line.split(',').map(item => item.trim());
        return { name, category, calories: parseFloat(calories), carbs: parseFloat(carbs), protein: parseFloat(protein), fat: parseFloat(fat), sugar: parseFloat(sugar), fiber: parseFloat(fiber) };
    });
}

// Endpoint to get foods
app.get('/foods', (req, res) => {
    if (foods.length === 0) {
        res.status(404).send({ message: 'No foods found' });
    } else {
        res.json(foods);
    }
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password && u.status === 'active');
    if (user) {
        res.status(200).send({ message: 'Login successful', username: user.username });
    } else {
        res.status(401).send({ message: 'Invalid email or password' });
    }
});

// Διαδρομή για την προσθήκη χρηστών
app.post('/add-user', (req, res) => {
    const { username, email, password } = req.body;
    const newUser = { username, email, password, status: 'active' };
    users.push(newUser);
    saveUsersToFile();
    res.status(201).json({ success: true, message: 'User added successfully' });
});

// Διαδρομή για την επιστροφή των χρηστών
app.get('/users', (req, res) => {
    res.json(users);
});

// Διαδρομή για την ενημέρωση της κατάστασης χρήστη
app.post('/update-user-status', (req, res) => {
    const { email, status } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        user.status = status;
        saveUsersToFile();
        res.status(200).json({ success: true, message: 'User status updated successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Διαδρομή για τη διαγραφή χρήστη
app.post('/delete-user', (req, res) => {
    const { email } = req.body;
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveUsersToFile();
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});