

// Obtener usuarios de localStorage o inicializar con admin
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [
  { username: 'admin', password: '1234' }
];

function guardarUsuarios() {
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
}






function login() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();
  const error = document.getElementById('login-error');
  const remember = document.getElementById('remember-session').checked;
  const rememberCreds = document.getElementById('remember-credentials').checked;
  error.innerText = '';

  if (!user || !pass) {
    error.innerText = 'Ingresa usuario y contraseña.';
    return;
  }
  const encontrado = usuarios.find(u => u.username === user && u.password === pass);
  if (encontrado) {
    if (remember) {
      localStorage.setItem('usuarioRecordado', JSON.stringify({ username: user, password: pass }));
    } else {
      localStorage.removeItem('usuarioRecordado');
    }
    if (rememberCreds) {
      localStorage.setItem('credencialesRecordadas', JSON.stringify({ username: user, password: pass }));
    } else {
      localStorage.removeItem('credencialesRecordadas');
    }
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    document.getElementById('user-display').innerText = user;
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').innerText = '';
    document.getElementById('register-error').innerText = '';
  } else {
    error.innerText = 'Usuario o contraseña incorrectos.';
  }
}

// Autologin y autocompletar credenciales si están guardadas
window.addEventListener('DOMContentLoaded', function() {
  // Autologin
  const usuarioRecordado = localStorage.getItem('usuarioRecordado');
  if (usuarioRecordado) {
    try {
      const { username, password } = JSON.parse(usuarioRecordado);
      const userObj = usuarios.find(u => u.username === username && u.password === password);
      if (userObj) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('main-section').style.display = 'block';
        document.getElementById('user-display').innerText = username;
      }
    } catch {}
  }
  // Autocompletar credenciales
  const creds = localStorage.getItem('credencialesRecordadas');
  if (creds) {
    try {
      const { username, password } = JSON.parse(creds);
      document.getElementById('username').value = username;
      document.getElementById('password').value = password;
      document.getElementById('remember-credentials').checked = true;
    } catch {}
  }
});


// Registro de usuario (nuevo formulario)
function registrarUsuario() {
  const user = document.getElementById('reg-username').value.trim();
  const pass = document.getElementById('reg-password').value.trim();
  const error = document.getElementById('register-error');
  error.style.color = 'red';
  error.innerText = '';

  if (!user || !pass) {
    error.innerText = 'Debes ingresar usuario y contraseña.';
    return;
  }
  if (usuarios.find(u => u.username === user)) {
    error.innerText = 'El usuario ya existe.';
    return;
  }
  usuarios.push({ username: user, password: pass });
  guardarUsuarios();
  error.style.color = 'green';
  error.innerText = 'Usuario registrado exitosamente. Ahora puedes iniciar sesión.';
  setTimeout(() => {
    error.innerText = '';
    error.style.color = 'red';
  }, 2000);
  document.getElementById('reg-username').value = '';
  document.getElementById('reg-password').value = '';
}



function logout() {
  document.getElementById('main-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'flex';
  document.getElementById('login-error').innerText = '';
  document.getElementById('user-display').innerText = '';
  document.getElementById('remember-session').checked = false;
  // No borrar credenciales recordadas al cerrar sesión, solo si el usuario desmarca la casilla
  localStorage.removeItem('usuarioRecordado');
  limpiarCampos();
  // Si hay credenciales recordadas, autocompletar
  const creds = localStorage.getItem('credencialesRecordadas');
  if (creds) {
    try {
      const { username, password } = JSON.parse(creds);
      document.getElementById('username').value = username;
      document.getElementById('password').value = password;
      document.getElementById('remember-credentials').checked = true;
    } catch {}
  } else {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('remember-credentials').checked = false;
  }
  const tbody = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  tbody.innerHTML = '';
}




document.getElementById('task-form').addEventListener('submit', function(e) {
  e.preventDefault();
  registrarTarea(limpiarCampos);
});

let tareas = [];

function registrarTarea(callback) {
  try {
    const id = document.getElementById('task-id').value.trim();
    const titulo = document.getElementById('task-title').value.trim();
    const desc = document.getElementById('task-desc').value.trim();
    const fecha = document.getElementById('start-date').value;
    const cliente = document.getElementById('client-name').value.trim();
    const proyecto = document.getElementById('project-id').value.trim();
    const comentarios = document.getElementById('comments').value.trim();
    const estatus = document.getElementById('status').value;

    if (!id || !titulo || !desc || !fecha || !cliente || !proyecto || !estatus) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    const nuevaTarea = { id, titulo, desc, fecha, cliente, proyecto, comentarios, estatus };
    tareas.push(nuevaTarea);
    mostrarTareas(tareas);
    callback();
  } catch (error) {
    console.error("Error al registrar tarea:", error);
  }
}

function mostrarTareas(lista) {
  const tabla = document.getElementById('task-table').getElementsByTagName('tbody')[0];
  tabla.innerHTML = '';
  lista.forEach(tarea => {
    const fila = tabla.insertRow();
    fila.innerHTML = `
      <td>${tarea.id}</td>
      <td>${tarea.titulo}</td>
      <td>${tarea.desc}</td>
      <td>${tarea.fecha}</td>
      <td>${tarea.cliente}</td>
      <td>${tarea.proyecto}</td>
      <td>${tarea.comentarios}</td>
      <td>${tarea.estatus}</td>
    `;
    fila.addEventListener('dblclick', () => cargarTarea(tarea));
  });
}

function cargarTarea(tarea) {
  document.getElementById('task-id').value = tarea.id;
  document.getElementById('task-title').value = tarea.titulo;
  document.getElementById('task-desc').value = tarea.desc;
  document.getElementById('start-date').value = tarea.fecha;
  document.getElementById('client-name').value = tarea.cliente;
  document.getElementById('project-id').value = tarea.proyecto;
  document.getElementById('comments').value = '';
  document.getElementById('status').value = tarea.estatus;
}

document.getElementById('update-task').addEventListener('click', function () {
  try {
    const id = document.getElementById('task-id').value.trim();
    const nuevoComentario = document.getElementById('comments').value.trim();
    const nuevoEstatus = document.getElementById('status').value;

    const index = tareas.findIndex(t => t.id === id);
    if (index !== -1) {
      const fechaActual = new Date().toLocaleString();
      if (nuevoComentario) {
        tareas[index].comentarios += `\n[${fechaActual}]: ${nuevoComentario}`;
      }
      tareas[index].estatus = nuevoEstatus;
      mostrarTareas(tareas);
      limpiarCampos();
    }
  } catch (error) {
    console.error("Error al actualizar tarea:", error);
  }
});

document.getElementById('filter-status').addEventListener('change', function () {
  const filtro = this.value;
  if (filtro === "Todos") {
    mostrarTareas(tareas);
  } else {
    const filtradas = tareas.filter(t => t.estatus === filtro);
    mostrarTareas(filtradas);
  }
});

function limpiarCampos() {
  document.getElementById('task-form').reset();
}
