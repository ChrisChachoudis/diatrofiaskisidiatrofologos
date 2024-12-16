document.addEventListener('DOMContentLoaded', function() {
    const selectedDate = localStorage.getItem('selectedDate');
    const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
    if (selectedDate) {
        document.getElementById('selected-date').textContent = `Ημερομηνία: ${selectedDate}`;
    }
    if (!username) {
        console.error('Username is not set in localStorage');
    }
});

let foods = [];

fetch('foods.txt')
    .then(response => response.text())
    .then(data => {
        foods = data.trim().split('\n').slice(1).map(line => {
            const [name, category, calories, carbs, protein, fat, sugar, fiber] = line.split(',').map(item => item.trim());
            return { name, category, calories: parseFloat(calories), carbs: parseFloat(carbs), protein: parseFloat(protein), fat: parseFloat(fat), sugar: parseFloat(sugar), fiber: parseFloat(fiber) };
        });
    })
    .catch(error => console.error('Σφάλμα κατά τη φόρτωση των δεδομένων:', error));

function generateMealFields() {
    const mealCount = document.getElementById('meal-count').value;
    const mealFields = document.getElementById('meal-fields');
    mealFields.innerHTML = '';

    for (let i = 0; i < mealCount; i++) {
        const mealDiv = document.createElement('div');
        mealDiv.className = 'meal-entry';
        mealDiv.innerHTML = `
            <label for="meal-elements-${i}">Από πόσα στοιχεία αποτελείται το γεύμα ${i + 1};</label>
            <input type="number" id="meal-elements-${i}" name="meal-elements-${i}" min="1" required>
            <button type="button" class="layer-button small-button" onclick="generateFoodFields(${i})">Υποβολή</button>
            <div id="food-fields-${i}"></div>
            <button type="button" class="meal-submit-button" onclick="calculateMealTotal(${i})">Σύνολο Γεύματος</button>
            <div id="meal-total-${i}" class="meal-total"></div>
            <p>Επέλεξε τον βαθμό του γεύματος:</p>
            <div class="rating">
                <span class="rating-circle red" onclick="setRating(${i}, 1)">1</span>
                <span class="rating-circle yellow" onclick="setRating(${i}, 2)">2</span>
                <span class="rating-circle green" onclick="setRating(${i}, 3)">3</span>
            </div>
            <div id="rating-message-${i}" class="rating-message"></div>
        `;
        mealFields.appendChild(mealDiv);
    }
}

function generateFoodFields(mealIndex) {
    const elementCount = document.getElementById(`meal-elements-${mealIndex}`).value;
    const foodFields = document.getElementById(`food-fields-${mealIndex}`);
    foodFields.innerHTML = '';

    for (let i = 0; i < elementCount; i++) {
        const foodDiv = document.createElement('div');
        foodDiv.className = 'food-entry';
        foodDiv.innerHTML = `
            <label for="food-${mealIndex}-${i}">Φαγητό ${i + 1}:</label>
            <input type="text" id="food-${mealIndex}-${i}" name="food-${mealIndex}-${i}" oninput="searchFoods(${mealIndex}, ${i})" required>
            <div id="food-suggestions-${mealIndex}-${i}" class="food-suggestions"></div>
            <label for="grams-${mealIndex}-${i}">Γραμμάρια:</label>
            <input type="number" id="grams-${mealIndex}-${i}" name="grams-${mealIndex}-${i}" min="1" required>
            <button type="button" class="layer-button small-button" onclick="calculateMacros(${mealIndex}, ${i})">Υποβολή</button>
            <div id="food-details-${mealIndex}-${i}" class="food-details"></div>
        `;
        foodFields.appendChild(foodDiv);
    }
}

function submitMeals() {
    const mealCount = document.getElementById('meal-count').value;
    const meals = [];
    const mealRatings = [];
    let totalCalories = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0, totalSugar = 0, totalFiber = 0;

    for (let i = 0; i < mealCount; i++) {
        const elements = parseInt(document.getElementById(`meal-elements-${i}`).value, 10);
        const mealFoods = [];
        for (let j = 0; j < elements; j++) {
            const food = document.getElementById(`food-${i}-${j}`).value;
            const grams = parseFloat(document.getElementById(`grams-${i}-${j}`).value);
            const foodItem = foods.find(f => f.name === food);
            if (foodItem) {
                const factor = grams / 100;
                totalCalories += foodItem.calories * factor;
                totalCarbs += foodItem.carbs * factor;
                totalProtein += foodItem.protein * factor;
                totalFat += foodItem.fat * factor;
                totalSugar += foodItem.sugar * factor;
                totalFiber += foodItem.fiber * factor;
            }
            mealFoods.push({ food, grams });
        }
        meals.push({ meal: i + 1, elements, foods: mealFoods });

        const rating = parseInt(document.getElementById(`rating-message-${i}`).dataset.rating, 10);
        mealRatings.push(rating);
    }

    const selectedDate = localStorage.getItem('selectedDate');
    const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
    if (!username) {
        console.error('Username is not set in localStorage');
        return;
    }

    // Calculate the average rating
    const totalRating = mealRatings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = totalRating / mealRatings.length;

    const mealData = {
        date: selectedDate,
        userId: username, // Use username as userId
        totalCalories: totalCalories.toFixed(2),
        totalCarbs: totalCarbs.toFixed(2),
        totalProtein: totalProtein.toFixed(2),
        totalFat: totalFat.toFixed(2),
        totalSugar: totalSugar.toFixed(2),
        totalFiber: totalFiber.toFixed(2),
        meals: meals,
        averageRating: averageRating.toFixed(2)
    };

    // Send meal data to the server
    fetch('http://127.0.0.1:3002/api/saveMealData', { // Changed to port 3002
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(mealData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Τα γεύματα καταχωρήθηκαν επιτυχώς!');
        } else {
            alert('Σφάλμα κατά την καταχώρηση των γευμάτων.');
        }
    })
    .catch(error => console.error('Σφάλμα κατά την αποστολή των δεδομένων:', error));

    // Αφαίρεση του περιγράμματος από τα πεδία εισαγωγής
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.border = 'none';
    });
}

function searchFoods(mealIndex, elementIndex) {
    const query = document.getElementById(`food-${mealIndex}-${elementIndex}`).value.toLowerCase();
    const suggestions = document.getElementById(`food-suggestions-${mealIndex}-${elementIndex}`);
    suggestions.innerHTML = '';

    if (query.length > 0) {
        const filteredFoods = foods.filter(food => food.name.toLowerCase().startsWith(query));
        filteredFoods.forEach(food => {
            const suggestion = document.createElement('div');
            suggestion.className = 'suggestion';
            suggestion.textContent = food.name;
            suggestion.onclick = () => {
                document.getElementById(`food-${mealIndex}-${elementIndex}`).value = food.name;
                suggestions.innerHTML = '';
            };
            suggestions.appendChild(suggestion);
        });
    }
}

function calculateMacros(mealIndex, elementIndex) {
    const foodName = document.getElementById(`food-${mealIndex}-${elementIndex}`).value;
    const grams = parseFloat(document.getElementById(`grams-${mealIndex}-${elementIndex}`).value) || 100;
    const details = document.getElementById(`food-details-${mealIndex}-${elementIndex}`);
    const food = foods.find(f => f.name === foodName);

    if (food) {
        const factor = grams / 100;
        details.innerHTML = `
            <p>Τροφή: ${food.name}</p>
            <p>Κατηγορία: ${food.category}</p>
            <p>Θερμίδες: ${(food.calories * factor).toFixed(2)}</p>
            <p>Υδατάνθρακες (g): ${(food.carbs * factor).toFixed(2)}</p>
            <p>Πρωτεΐνη (g): ${(food.protein * factor).toFixed(2)}</p>
            <p>Λίπος (g): ${(food.fat * factor).toFixed(2)}</p>
            <p>Σάκχαρα (g): ${(food.sugar * factor).toFixed(2)}</p>
            <p>Φυτικές Ίνες (g): ${(food.fiber * factor).toFixed(2)}</p>
        `;
    } else {
        details.innerHTML = '<p>Η τροφή δεν βρέθηκε.</p>';
    }
}

function calculateMealTotal(mealIndex) {
    const elements = parseInt(document.getElementById(`meal-elements-${mealIndex}`).value, 10);
    let totalCalories = 0, totalCarbs = 0, totalProtein = 0, totalFat = 0, totalSugar = 0, totalFiber = 0;

    for (let i = 0; i < elements; i++) {
        const foodName = document.getElementById(`food-${mealIndex}-${i}`).value;
        const grams = parseFloat(document.getElementById(`grams-${mealIndex}-${i}`).value) || 100;
        const food = foods.find(f => f.name === foodName);

        if (food) {
            const factor = grams / 100;
            totalCalories += food.calories * factor;
            totalCarbs += food.carbs * factor;
            totalProtein += food.protein * factor;
            totalFat += food.fat * factor;
            totalSugar += food.sugar * factor;
            totalFiber += food.fiber * factor;
        }
    }

    const mealTotal = document.getElementById(`meal-total-${mealIndex}`);
    mealTotal.innerHTML = `
        <p>Συνολικές Θερμίδες: ${totalCalories.toFixed(2)}</p>
        <p>Συνολικοί Υδατάνθρακες (g): ${totalCarbs.toFixed(2)}</p>
        <p>Συνολική Πρωτεΐνη (g): ${totalProtein.toFixed(2)}</p>
        <p>Συνολικό Λίπος (g): ${totalFat.toFixed(2)}</p>
        <p>Συνολικά Σάκχαρα (g): ${totalSugar.toFixed(2)}</p>
        <p>Συνολικές Φυτικές Ίνες (g): ${totalFiber.toFixed(2)}</p>
    `;
}

function setRating(mealIndex, rating) {
    const ratingMessage = document.getElementById(`rating-message-${mealIndex}`);
    ratingMessage.textContent = `Ο βαθμός του γεύματος είναι ${rating}`;
    ratingMessage.dataset.rating = rating;
}

function goToNextStep() {
    window.location.href = 'next-step.html';
}