document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3001/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(users => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = ''; // Clear any existing content
            users.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'user-item';
                userDiv.innerHTML = `
                    <p>Όνομα: ${user.username}</p>
                    <p>Email: ${user.email}</p>
                    <p>Κωδικός: ${user.password}</p>
                    <p>Κατάσταση: ${user.status}</p>
                    <button onclick="updateUserStatus('${user.email}', 'inactive')">Πάγωμα</button>
                    <button onclick="updateUserStatus('${user.email}', 'active')">Ξεπάγωμα</button>
                    <button onclick="deleteUser('${user.email}')">Διαγραφή</button>
                `;
                usersList.appendChild(userDiv);
            });
        })
        .catch(error => console.error('Error:', error));
});

function updateUserStatus(email, status) {
    fetch('http://localhost:3001/update-user-status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, status })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => console.error('Error:', error));
}

function deleteUser(email) {
    fetch('http://localhost:3001/delete-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(error => console.error('Error:', error));
}