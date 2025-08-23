document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const tournamentForm = document.getElementById('tournamentForm');
    const usersList = document.getElementById('usersList');
    const tournamentsList = document.getElementById('tournamentsList');

    // Register User
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', document.getElementById('name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('profile_picture', document.getElementById('profile_picture').files[0]);

        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Registration failed');
            alert(data.message);
            registerForm.reset();
            fetchUsers();
        } catch (err) {
            console.error('Register Error:', err);
            alert('Error: ' + err.message);
        }
    });

    // Create Tournament
    tournamentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user_id = document.getElementById('user_id').value;
        const name = document.getElementById('tournament_name').value;

        try {
            const response = await fetch('/api/tournaments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id, name })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Tournament creation failed');
            alert(data.message);
            tournamentForm.reset();
            fetchTournaments();
        } catch (err) {
            console.error('Tournament Error:', err);
            alert('Error: ' + err.message);
        }
    });

    // Fetch Users
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch users');
            if (!Array.isArray(data)) throw new Error('Expected an array of users');
            usersList.innerHTML = '';
            data.forEach(user => {
                const userDiv = document.createElement('div');
                userDiv.className = 'border p-4 rounded';
                userDiv.innerHTML = `
                    <img src="/uploads/${user.profile_picture}" alt="Profile" class="w-16 h-16 rounded-full">
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone}</p>
                    <button onclick="editUser(${user.id})" class="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Edit</button>
                    <button onclick="deleteUser(${user.id})" class="bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete</button>
                `;
                usersList.appendChild(userDiv);
            });
        } catch (err) {
            console.error('Fetch Users Error:', err);
            usersList.innerHTML = `<p>Error: ${err.message}</p>`;
        }
    }

    // Fetch Tournaments
    async function fetchTournaments() {
        try {
            const response = await fetch('/api/tournaments');
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to fetch tournaments');
            if (!Array.isArray(data)) throw new Error('Expected an array of tournaments');
            tournamentsList.innerHTML = '';
            data.forEach(tournament => {
                const tournamentDiv = document.createElement('div');
                tournamentDiv.className = 'border p-4 rounded';
                tournamentDiv.innerHTML = `
                    <p><strong>Tournament:</strong> ${tournament.name}</p>
                    <p><strong>User ID:</strong> ${tournament.user_id}</p>
                `;
                tournamentsList.appendChild(tournamentDiv);
            });
        } catch (err) {
            console.error('Fetch Tournaments Error:', err);
            tournamentsList.innerHTML = `<p>Error: ${err.message}</p>`;
        }
    }

    // Edit User
    window.editUser = async (id) => {
        const name = prompt('Enter new name:');
        const email = prompt('Enter new email:');
        const phone = prompt('Enter new phone:');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('phone', phone);

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'PUT',
                body: formData
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Update failed');
            alert(data.message);
            fetchUsers();
        } catch (err) {
            console.error('Edit User Error:', err);
            alert('Error: ' + err.message);
        }
    };

    // Delete User
    window.deleteUser = async (id) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`/api/users/${id}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Delete failed');
                alert(data.message);
                fetchUsers();
            } catch (err) {
                console.error('Delete User Error:', err);
                alert('Error: ' + err.message);
            }
        }
    };

    // Initial Fetch
    fetchUsers();
    fetchTournaments();
});