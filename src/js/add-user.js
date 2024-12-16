document.getElementById('add-user-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('new-email').value;
    const password = document.getElementById('new-password').value;
    const addUserMessage = document.getElementById('add-user-message');

    fetch('http://localhost:3001/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Response data:', data); // Logging response data
        if (data.success) {
            addUserMessage.textContent = 'Ο χρήστης προστέθηκε επιτυχώς';
            addUserMessage.style.color = 'green';
        } else {
            addUserMessage.textContent = 'Αποτυχία προσθήκης χρήστη';
            addUserMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addUserMessage.textContent = 'Σφάλμα κατά την προσθήκη χρήστη';
        addUserMessage.style.color = 'red';
    });
});