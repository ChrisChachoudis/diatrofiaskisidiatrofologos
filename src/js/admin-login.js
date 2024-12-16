document.getElementById('admin-login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginMessage = document.getElementById('login-message');

    if (username === 'admin' && password === '1999') {
        loginMessage.textContent = 'Επιτυχία σύνδεσης';
        loginMessage.style.color = 'green';
        // Redirect to admin dashboard
        window.location.href = 'admin-dashboard.html';
    } else {
        loginMessage.textContent = 'Αποτυχία σύνδεσης';
        loginMessage.style.color = 'red';
    }
});