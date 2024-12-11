const calendarElement = document.getElementById("calendar");
const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");
const monthNameElement = document.getElementById("month-name");
const addCultivoButton = document.getElementById("add-cultivo");
const formularioElement = document.getElementById("formulario");
const editFormularioElement = document.getElementById("edit-formulario");
const cancelarButton = document.getElementById("cancelar");
const cancelarEditarButton = document.getElementById("cancelar-editar");
const cultivosList = document.getElementById("cultivos-list");
const mostrarEventosButton = document.getElementById("mostrar-eventos-btn");
const tablaEventosElement = document.getElementById("tabla-eventos");
const tablaEventosBody = document.getElementById("tabla-eventos-body");

let currentDate = new Date();
let eventos = [];
let eventoEditIndex = null;

// Renderiza el calendario
function renderCalendar() {
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  
  monthNameElement.innerText = `${getMonthName(month)} ${year}`;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  calendarElement.innerHTML = '';  // Limpiar el calendario

  // Crear los días del mes
  for (let i = 0; i < firstDay.getDay(); i++) {
    calendarElement.innerHTML += '<div></div>';
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const dayElement = document.createElement("div");
    dayElement.innerText = i;
    dayElement.addEventListener("click", () => showEventForm(i));

    // Verificar si hay evento para ese día y también para el mismo mes y año
    const evento = eventos.find(evento => {
      const eventoFecha = new Date(evento.fecha);
      return eventoFecha.getDate() === i && eventoFecha.getMonth() === month && eventoFecha.getFullYear() === year;
    });

    if (evento) {
      dayElement.classList.add("event");
      const editButton = document.createElement("button");
      editButton.innerText = "Editar";
      editButton.addEventListener("click", (e) => {
        e.stopPropagation(); // Evitar que el click se propague
        editEvent(evento, i); // Llamar a la función de edición
      });
      dayElement.appendChild(editButton);
    }

    calendarElement.appendChild(dayElement);
  }
}

// Limpiar los campos del formulario
function clearFields() {
  document.getElementById("cultivo").value = ''; // Limpiar campo cultivo
  document.getElementById("area").value = '';    // Limpiar campo area
  document.getElementById("fecha").value = '';   // Limpiar campo fecha

  // Limpiar los campos del formulario de edición también (si es necesario)
  document.getElementById("edit-cultivo").value = '';
  document.getElementById("edit-area").value = '';
  document.getElementById("edit-fecha").value = '';
}

// Obtener el nombre del mes
function getMonthName(month) {
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return months[month];
}

// Cambio de mes
prevMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});

// Mostrar formulario de agregar cultivo
addCultivoButton.addEventListener("click", () => {
  clearFields();  // Limpiar campos cuando se va a agregar un cultivo
  formularioElement.classList.remove("hidden");
  editFormularioElement.classList.add("hidden");
});

// Mostrar formulario de edición
cancelarEditarButton.addEventListener("click", () => {
  editFormularioElement.classList.add("hidden");
  formularioElement.classList.remove("hidden");
});

cancelarButton.addEventListener("click", () => {
  formularioElement.classList.add("hidden");
});

// Agregar cultivo
document.getElementById("planificar-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const cultivo = document.getElementById("cultivo").value;
  const area = document.getElementById("area").value;
  const fecha = document.getElementById("fecha").value;

  const newCultivo = {
    cultivo,
    area,
    fecha
  };

  // Si estamos editando un evento, actualizamos los datos
  if (eventoEditIndex !== null) {
    eventos[eventoEditIndex] = newCultivo; // Actualiza el evento existente
    eventoEditIndex = null;
  } else {
    eventos.push(newCultivo); // Si no estamos editando, agregamos un nuevo evento
  }

  renderCalendar(); // Volver a renderizar el calendario después de agregar o actualizar
  displayEvents();  // Actualizar la tabla de eventos

  formularioElement.classList.add("hidden"); // Ocultar el formulario de agregar evento
});

// Función para editar un evento (Actualizar)
function editEvent(evento, day) {
  // Guardar el índice del evento para actualizarlo
  eventoEditIndex = eventos.findIndex(e => e.fecha === evento.fecha);

  // Mostrar formulario de edición
  formularioElement.classList.add("hidden");
  editFormularioElement.classList.remove("hidden");

  // Rellenar los campos de edición con los datos del evento
  document.getElementById("edit-cultivo").value = evento.cultivo;
  document.getElementById("edit-area").value = evento.area;
  document.getElementById("edit-fecha").value = evento.fecha;

  // Cuando se confirme la edición
  document.getElementById("edit-form").onsubmit = function (e) {
    e.preventDefault();

    // Obtener los datos de los campos de edición
    const updatedCultivo = document.getElementById("edit-cultivo").value;
    const updatedArea = document.getElementById("edit-area").value;
    const updatedFecha = document.getElementById("edit-fecha").value;

    // Actualizar el evento en el arreglo
    eventos[eventoEditIndex] = {
      cultivo: updatedCultivo,
      area: updatedArea,
      fecha: updatedFecha
    };

    // Volver a renderizar el calendario y la tabla de eventos
    renderCalendar();
    displayEvents();

    // Ocultar el formulario de edición
    editFormularioElement.classList.add("hidden");
    formularioElement.classList.remove("hidden");
  };
}

// Eliminar evento
function deleteEvent(rowIndex) {
  // Eliminar el evento de la lista usando el índice
  eventos.splice(rowIndex, 1);

  // Volver a renderizar la tabla de eventos
  displayEvents();

  // Volver a renderizar el calendario sin perder el estado
  renderCalendar();
}

// Mostrar eventos en tabla
function displayEvents() {
  tablaEventosBody.innerHTML = '';
  eventos.forEach((evento, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${evento.cultivo}</td>
      <td>${evento.area}</td>
      <td>${evento.fecha}</td>
      <td>
        <button onclick="deleteEvent(${index})">Eliminar</button>
      </td>
    `;
    tablaEventosBody.appendChild(row);
  });
}

// Mostrar eventos en tabla
mostrarEventosButton.addEventListener("click", () => {
  tablaEventosElement.classList.toggle("hidden");
  displayEvents();
});

// Mostrar formulario de evento al hacer click en un día
function showEventForm(day) {
  // Usar la zona horaria local al crear la fecha
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // Enero es 0, Febrero 1, etc.

  // Crear la fecha usando la zona horaria local
  const selectedDate = new Date(year, month, day);

  // Mostrar la fecha seleccionada
  alert(`Evento de siembra para el día ${selectedDate.toLocaleDateString()}`);

  // Establecer la fecha en el campo de formulario
  document.getElementById("fecha").value = selectedDate.toISOString().split('T')[0]; // Establece la fecha en el formulario correctamente
}

renderCalendar(); // Inicializa el calendario

