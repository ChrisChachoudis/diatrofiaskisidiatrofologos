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

function submitExercise() {
    const exerciseMinutes = parseInt(document.getElementById('exercise-minutes').value, 10);
    const selectedDate = localStorage.getItem('selectedDate');
    const username = localStorage.getItem('username'); // Assuming username is stored in localStorage
    if (!username) {
        console.error('Username is not set in localStorage');
        return;
    }
    const exerciseData = {
        date: selectedDate,
        userId: username, // Use username as userId
        exerciseMinutes: exerciseMinutes
    };

    // Send exercise data to the server
    fetch('http://127.0.0.1:3002/api/saveExerciseData', { // Changed to port 3002
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(exerciseData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Τα λεπτά άσκησης καταχωρήθηκαν επιτυχώς!');
        } else {
            alert('Σφάλμα κατά την καταχώρηση των λεπτών άσκησης.');
        }
    })
    .catch(error => console.error('Σφάλμα κατά την αποστολή των δεδομένων:', error));
}