document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');

    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            localStorage.setItem('username', data.username); // Αποθήκευση του ονόματος χρήστη
            loginMessage.textContent = 'Επιτυχία σύνδεσης';
            loginMessage.style.color = 'green';
            window.location.href = 'main.html'; // Ανακατεύθυνση στην κεντρική σελίδα
        } else {
            loginMessage.textContent = 'Αποτυχία σύνδεσης';
            loginMessage.style.color = 'red';
        }
    })
    .catch(error => {
        loginMessage.textContent = 'Σφάλμα σύνδεσης';
        loginMessage.style.color = 'red';
        console.error('Error:', error);
    });
});