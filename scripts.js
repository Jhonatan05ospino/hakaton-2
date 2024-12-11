document.getElementById('banner').addEventListener('click', function() {
    const overlay = document.getElementById('overlay');
    const text = document.querySelector('.text');

    overlay.classList.add('show'); // Muestra la superposición
    text.classList.add('show'); // Muestra el texto

    // Opcional: puedes hacer que el overlay se esconda después de un tiempo
    setTimeout(() => {
        overlay.classList.remove('show');
        text.classList.remove('show');
    }, 3000); // Ocultar después de 3 segundos
});
 
 // Función para manejar el registro
 document.getElementById('register-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    alert('Usuario registrado. Ahora puedes iniciar sesión.');
});

// Función para manejar el inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (username === storedUsername && password === storedPassword) {
        alert('Inicio de sesión exitoso');
        document.getElementById('user-name').innerText = `Bienvenido, ${username}`;
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
});

// Función para cerrar sesión
function logout() {
    document.getElementById('user-name').innerText = '';
    alert('Has cerrado sesión.');
}