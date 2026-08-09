/* =====================================================
   LOGIN
===================================================== */

const USUARIO_CORRECTO = "Belén";
const PASSWORD_CORRECTA = "2009sl";


document.addEventListener("DOMContentLoaded", function () {

  const loginForm = document.getElementById("login-form");

  if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

      e.preventDefault();

      iniciarSesion();

    });

  }


  /* Comprobar sesión */

  if (localStorage.getItem("claseSesion") === "activa") {

    mostrarApp();

  } else {

    mostrarLogin();

  }


  /* Cargar información */

  cargarHorario();

  cargarClases();

  cargarCuadernos();

  cargarEncargos();

  cargarAnuncios();

  cargarAgenda();

});


/* =====================================================
   LOGIN
===================================================== */

function iniciarSesion() {

  const usuario =
    document.getElementById("usuario").value.trim();

  const password =
    document.getElementById("password").value;

  const error =
    document.getElementById("login-error");


  if (
    usuario === USUARIO_CORRECTO &&
    password === PASSWORD_CORRECTA
  ) {

    localStorage.setItem(
      "claseSesion",
      "activa"
    );

    mostrarApp();

  } else {

    error.textContent =
      "Usuario o contraseña incorrectos.";

  }

}


function mostrarLogin() {

  document
    .getElementById("login-page")
    .classList.remove("hidden");

  document
    .getElementById("app")
    .classList.add("hidden");

}


function mostrarApp() {

  document
    .getElementById("login-page")
    .classList.add("hidden");

  document
    .getElementById("app")
    .classList.remove("hidden");

  actualizarSaludo();

}


function cerrarSesion() {

  localStorage.removeItem("claseSesion");

  mostrarLogin();

  document.getElementById("usuario").value = "";

  document.getElementById("password").value = "";

}


function actualizarSaludo() {

  const hora = new Date().getHours();

  let saludo = "Hola";

  if (hora < 12) {

    saludo = "Buenos días";

  } else if (hora < 19) {

    saludo = "Buenas tardes";

  } else {

    saludo = "Buenas noches";

  }

  document.getElementById("saludo").textContent =
    saludo + " 👋";

}


/* =====================================================
   NAVEGACIÓN
===================================================== */

function mostrarSeccion(nombre, elemento = null) {

  const secciones =
    document.querySelectorAll(".seccion");

  secciones.forEach(function (seccion) {

    seccion.classList.add("hidden");

  });


  const seleccion =
    document.getElementById(nombre);

  if (seleccion) {

    seleccion.classList.remove("hidden");

  }


  const menuItems =
    document.querySelectorAll(".menu li");

  menuItems.forEach(function (item) {

    item.classList.remove("active");

  });


  if (elemento) {

    elemento.classList.add("active");

  } else {

    menuItems.forEach(function (item) {

      const texto =
        item.textContent.trim().toLowerCase();

      if (
        (nombre === "principal" &&
          texto.includes("panel principal")) ||

        (nombre === "todo" &&
          texto === "to do") ||

        (nombre === "horario" &&
          texto === "horario") ||

        (nombre === "agenda" &&
          texto === "agenda") ||

        (nombre === "cuadernos" &&
          texto.includes("cuadernos")) ||

        (nombre === "encargos" &&
          texto.includes("encargos")) ||

        (nombre === "calendario" &&
          texto.includes("calendario")) ||

        (nombre === "anuncios" &&
          texto.includes("anuncios"))
      ) {

        item.classList.add("active");

      }

    });

  }


  /* cerrar menú móvil */

  document
    .getElementById("sidebar")
    .classList.remove("open");


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


function abrirDesdePanel(nombre) {

  mostrarSeccion(nombre);

}


function toggleSidebar() {

  document
    .getElementById("sidebar")
    .classList.toggle("open");

}


/* =====================================================
   TO DO
===================================================== */

let clases =
  JSON.parse(
    localStorage.getItem("clasesClase")
  ) || [];


function guardarClases() {

  localStorage.setItem(
    "clasesClase",
    JSON.stringify(clases)
  );

}


function abrirCrearClase() {

  document
    .getElementById("modal-clase")
    .classList.remove("hidden");

  setTimeout(function () {

    document
      .getElementById("nombre-clase")
      .focus();

  }, 100);

}


function cerrarCrearClase() {

  document
    .getElementById("modal-clase")
    .classList.add("hidden");

  document
    .getElementById("nombre-clase")
    .value = "";

}


function crearClase() {

  const input =
    document.getElementById("nombre-clase");

  const nombre =
    input.value.trim();

  if (!nombre) {

    alert("Escribe el nombre de la clase.");

    return;

  }


  const nuevaClase = {

    id: Date.now(),

    nombre: nombre,

    tareas: []

  };


  clases.push(nuevaClase);

  guardarClases();

  cargarClases();

  cerrarCrearClase();

}


function cargarClases() {

  const contenedor =
    document.getElementById("lista-clases");

  if (!contenedor) return;


  contenedor.innerHTML = "";


  if (clases.length === 0) {

    contenedor.innerHTML = `

      <div class="empty-section">

        <i class="fas fa-book-open"></i>

        <h3>No hay clases todavía</h3>

        <p>
          Crea una clase y después podrás
          agregar tareas dentro de ella.
        </p>

        <button
          class="primary-button"
          onclick="abrirCrearClase()">

          <i class="fas fa-plus"></i>
          Crear mi primera clase

        </button>

      </div>

    `;

    return;

  }


  clases.forEach(function (clase) {

    const card =
      document.createElement("div");

    card.className = "class-card";


    const cantidad =
      clase.tareas.length;


    card.innerHTML = `

      <div class="class-header">

        <div class="class-title-area">

          <div class="class-icon">

            <i class="fas fa-book"></i>

          </div>

          <div>

            <div class="class-title">
              ${escapeHTML(clase.nombre)}
            </div>

            <div class="class-count">
              ${cantidad}
              ${cantidad === 1 ? "tarea" : "tareas"}
            </div>

          </div>

        </div>


        <div class="class-actions">

          <button
            class="icon-button"
            title="Eliminar clase"
            onclick="eliminarClase(${clase.id})">

            <i class="fas fa-trash"></i>

          </button>

        </div>

      </div>


      <div class="class-body">

        <div class="task-add">

          <input
            type="text"
            id="task-input-${clase.id}"
            placeholder="Agregar una tarea a ${escapeHTML(clase.nombre)}..."
            onkeydown="enterAgregarTarea(event, ${clase.id})">

          <button
            onclick="agregarTarea(${clase.id})"
            title="Agregar tarea">

            <i class="fas fa-plus"></i>

          </button>

        </div>


        <ul class="task-list">

          ${
            clase.tareas.length === 0

              ? `
                <li class="no-tasks">
                  Todavía no hay tareas en esta clase.
                </li>
              `

              : clase.tareas.map(function (tarea) {

                  return `

                    <li class="task-item ${
                      tarea.completada ? "done" : ""
                    }">

                      <input
                        type="checkbox"
                        ${
                          tarea.completada
                            ? "checked"
                            : ""
                        }
                        onchange="
                          cambiarEstadoTarea(
                            ${clase.id},
                            ${tarea.id}
                          )
                        ">

                      <span class="task-text">
                        ${escapeHTML(tarea.texto)}
                      </span>

                      <button
                        class="delete-task"
                        onclick="
                          eliminarTarea(
                            ${clase.id},
                            ${tarea.id}
                          )
                        ">

                        <i class="fas fa-trash"></i>

                      </button>

                    </li>

                  `;

                }).join("")
          }

        </ul>

      </div>

    `;


    contenedor.appendChild(card);

  });

}


function enterAgregarTarea(event, claseId) {

  if (event.key === "Enter") {

    event.preventDefault();

    agregarTarea(claseId);

  }

}


function agregarTarea(claseId) {

  const input =
    document.getElementById(
      `task-input-${claseId}`
    );

  if (!input) return;


  const texto =
    input.value.trim();

  if (!texto) return;


  const clase =
    clases.find(function (c) {

      return c.id === claseId;

    });


  if (!clase) return;


  clase.tareas.push({

    id: Date.now(),

    texto: texto,

    completada: false

  });


  guardarClases();

  cargarClases();

}


function cambiarEstadoTarea(
  claseId,
  tareaId
) {

  const clase =
    clases.find(c => c.id === claseId);

  if (!clase) return;


  const tarea =
    clase.tareas.find(t => t.id === tareaId);

  if (!tarea) return;


  tarea.completada =
    !tarea.completada;


  guardarClases();

  cargarClases();

}


function eliminarTarea(
  claseId,
  tareaId
) {

  const clase =
    clases.find(c => c.id === claseId);

  if (!clase) return;


  clase.tareas =
    clase.tareas.filter(function (tarea) {

      return tarea.id !== tareaId;

    });


  guardarClases();

  cargarClases();

}


function eliminarClase(claseId) {

  if (
    !confirm(
      "¿Seguro que quieres eliminar esta clase y sus tareas?"
    )
  ) {

    return;

  }


  clases =
    clases.filter(function (clase) {

      return clase.id !== claseId;

    });


  guardarClases();

  cargarClases();

}


/* =====================================================
   HORARIO
===================================================== */

let eventos =
  JSON.parse(
    localStorage.getItem("eventosHorario")
  ) || [];


const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo"
];


function guardarHorario() {

  localStorage.setItem(
    "eventosHorario",
    JSON.stringify(eventos)
  );

}


/*
  Convierte HH:MM en minutos desde medianoche.
*/

function horaAMinutos(hora) {

  const partes =
    hora.split(":");

  return (
    parseInt(partes[0], 10) * 60 +
    parseInt(partes[1], 10)
  );

}


/*
  Convierte minutos a hora legible.
*/

function minutosAHora(minutos) {

  minutos =
    Math.round(minutos);

  let horas =
    Math.floor(minutos / 60);

  const mins =
    minutos % 60;

  const periodo =
    horas >= 12 ? "PM" : "AM";


  let horas12 =
    horas % 12;

  if (horas12 === 0) {

    horas12 = 12;

  }


  return (
    horas12 +
    ":" +
    String(mins).padStart(2, "0") +
    " " +
    periodo
  );

}


/*
  Crea las 24 horas correctamente.
*/

function crearHorasHorario() {

  const columna =
    document.getElementById(
      "time-column"
    );

  if (!columna) return;


  columna.innerHTML = "";


  /*
    El horario empieza a la 1 AM
    y termina a las 12 AM.

    Cada hora ocupa 60px.
  */

  for (
    let hora = 1;
    hora <= 24;
    hora++
  ) {

    const label =
      document.createElement("div");

    label.className =
      "time-label";


    const textoHora =
      hora === 24
        ? "12 AM"
        : (
            hora === 12
              ? "12 PM"
              : (
                  hora < 12
                    ? hora + " AM"
                    : (hora - 12) + " PM"
                )
          );


    label.textContent =
      textoHora;


    label.style.top =
      `${(hora - 1) * 60}px`;


    columna.appendChild(label);

  }

}


function cargarHorario() {

  crearHorasHorario();

  renderizarEventos();

}


function agregarEvento() {

  const nombre =
    document
      .getElementById("evento-nombre")
      .value
      .trim();

  const dia =
    parseInt(
      document
        .getElementById("evento-dia")
        .value
    );

  const inicio =
    document
      .getElementById("evento-inicio")
      .value;

  const fin =
    document
      .getElementById("evento-fin")
      .value;


  if (!nombre) {

    alert(
      "Escribe de qué se trata el evento."
    );

    return;

  }


  if (!inicio || !fin) {

    alert(
      "Selecciona la hora de inicio y finalización."
    );

    return;

  }


  const minutosInicio =
    horaAMinutos(inicio);

  const minutosFin =
    horaAMinutos(fin);


  if (
    minutosFin <= minutosInicio
  ) {

    alert(
      "La hora de finalización debe ser después de la hora de inicio."
    );

    return;

  }


  /*
    El horario visual empieza a las 1 AM.
    Permitimos eventos desde 1:00 AM
    hasta 12:00 AM.
  */

  if (
    minutosInicio < 60 ||
    minutosFin > 1440
  ) {

    alert(
      "El horario debe estar entre 1:00 AM y 12:00 AM."
    );

    return;

  }


  eventos.push({

    id: Date.now(),

    nombre: nombre,

    dia: dia,

    inicio: inicio,

    fin: fin

  });


  guardarHorario();

  renderizarEventos();


  document
    .getElementById("evento-nombre")
    .value = "";

}


function renderizarEventos() {

  const columnas =
    document.querySelectorAll(
      ".day-column"
    );


  columnas.forEach(function (columna) {

    columna.innerHTML = "";

  });


  /*
    Agrupar eventos por día.
  */

  for (let dia = 0; dia < 7; dia++) {

    const eventosDia =
      eventos.filter(function (evento) {

        return evento.dia === dia;

      });


    const columna =
      document.querySelector(
        `.day-column[data-day="${dia}"]`
      );


    if (!columna) continue;


    /*
      Calculamos grupos de eventos
      que se cruzan.

      Esto permite que:

      Matemáticas 8:00 - 10:00
      Historia    9:30 - 11:00

      aparezcan lado a lado.
    */

    const grupos =
      calcularGruposDeSolapamiento(
        eventosDia
      );


    grupos.forEach(function (grupo) {

      grupo.forEach(function (evento, index) {

        const inicio =
          horaAMinutos(
            evento.inicio
          );

        const fin =
          horaAMinutos(
            evento.fin
          );


        /*
          1 AM = minuto 60.

          Así:
          1:00 AM → 0px
          2:00 AM → 60px
          8:00 AM → 420px
        */

        const top =
          inicio - 60;


        const height =
          fin - inicio;


        const cantidad =
          grupo.length;


        const width =
          100 / cantidad;


        const left =
          index * width;


        const elemento =
          document.createElement("div");

        elemento.className =
          "calendar-event";


        elemento.style.top =
          `${top}px`;


        elemento.style.height =
          `${Math.max(height, 20)}px`;


        elemento.style.left =
          `calc(${left}% + 3px)`;


        elemento.style.width =
          `calc(${width}% - 6px)`;


        elemento.innerHTML = `

          <div class="calendar-event-title">

            ${escapeHTML(evento.nombre)}

          </div>

          <div class="calendar-event-time">

            ${minutosAHora(inicio)}
            -
            ${minutosAHora(fin)}

          </div>

        `;


        elemento.title =
          `${evento.nombre} | ${minutosAHora(inicio)} - ${minutosAHora(fin)}`;


        elemento.onclick =
          function () {

            eliminarEvento(evento.id);

          };


        columna.appendChild(elemento);

      });

    });

  }

}


/*
  Encuentra eventos que se cruzan.

  Ejemplo:

  A: 8:00 - 10:00
  B: 9:30 - 11:00

  Ambos forman un grupo.
*/

function calcularGruposDeSolapamiento(
  lista
) {

  const ordenados =
    [...lista].sort(function (a, b) {

      return (
        horaAMinutos(a.inicio) -
        horaAMinutos(b.inicio)
      );

    });


  const grupos = [];


  ordenados.forEach(function (evento) {

    const inicio =
      horaAMinutos(evento.inicio);

    const fin =
      horaAMinutos(evento.fin);


    let grupoEncontrado = null;


    for (
      const grupo of grupos
    ) {

      const seCruza =
        grupo.some(function (otro) {

          const otroInicio =
            horaAMinutos(
              otro.inicio
            );

          const otroFin =
            horaAMinutos(
              otro.fin
            );


          return (
            inicio < otroFin &&
            fin > otroInicio
          );

        });


      if (seCruza) {

        grupoEncontrado =
          grupo;

        break;

      }

    }


    if (grupoEncontrado) {

      grupoEncontrado.push(evento);

    } else {

      grupos.push([evento]);

    }

  });


  return grupos;

}


function eliminarEvento(id) {

  const evento =
    eventos.find(e => e.id === id);

  if (!evento) return;


  if (
    !confirm(
      `¿Eliminar "${evento.nombre}" del horario?`
    )
  ) {

    return;

  }


  eventos =
    eventos.filter(function (e) {

      return e.id !== id;

    });


  guardarHorario();

  renderizarEventos();

}


/* =====================================================
   AGENDA
===================================================== */

function cargarAgenda() {

  const editor =
    document.getElementById(
      "agenda-editor"
    );

  if (!editor) return;


  editor.innerHTML =
    localStorage.getItem(
      "agendaContenido"
    ) || "";


  editor.addEventListener(
    "input",
    function () {

      localStorage.setItem(
        "agendaContenido",
        editor.innerHTML
      );

    }
  );

}


function formatoAgenda(comando) {

  document.execCommand(
    comando,
    false,
    null
  );

  guardarAgenda();

}


function cambiarFuenteAgenda() {

  const fuente =
    document.getElementById(
      "agenda-font"
    ).value;

  document.execCommand(
    "fontName",
    false,
    fuente
  );

  guardarAgenda();

}


function cambiarTamanoAgenda() {

  const tamano =
    document.getElementById(
      "agenda-size"
    ).value;


  document.execCommand(
    "fontSize",
    false,
    "7"
  );


  const seleccion =
    window.getSelection();


  if (
    seleccion &&
    seleccion.rangeCount > 0
  ) {

    const elementos =
      document.querySelectorAll(
        "#agenda-editor font[size='7']"
      );


    elementos.forEach(function (elemento) {

      elemento.style.fontSize =
        tamano;

      elemento.removeAttribute("size");

    });

  }


  guardarAgenda();

}


function guardarAgenda() {

  const editor =
    document.getElementById(
      "agenda-editor"
    );

  if (!editor) return;


  localStorage.setItem(
    "agendaContenido",
    editor.innerHTML
  );

}


/* =====================================================
   CUADERNOS
===================================================== */

let cuadernos =
  JSON.parse(
    localStorage.getItem(
      "cuadernosClase"
    )
  ) || [];


let cuadernoActualId = null;


function guardarCuadernos() {

  localStorage.setItem(
    "cuadernosClase",
    JSON.stringify(cuadernos)
  );

}


function crearCuaderno() {

  const nombre =
    prompt(
      "¿Cómo quieres llamar al cuaderno?"
    );


  if (!nombre) return;


  const nombreLimpio =
    nombre.trim();


  if (!nombreLimpio) return;


  const nuevo = {

    id: Date.now(),

    nombre: nombreLimpio,

    contenido: ""

  };


  cuadernos.push(nuevo);

  guardarCuadernos();

  cargarCuadernos();

  abrirCuaderno(nuevo.id);

}


function cargarCuadernos() {

  const contenedor =
    document.getElementById(
      "lista-cuadernos"
    );

  if (!contenedor) return;


  contenedor.innerHTML = "";


  if (cuadernos.length === 0) {

    contenedor.innerHTML = `

      <div class="empty-section">

        <i class="fas fa-book"></i>

        <h3>No tienes cuadernos todavía</h3>

        <p>
          Crea tu primer cuaderno para comenzar
          a escribir tus apuntes.
        </p>

        <button
          class="primary-button"
          onclick="crearCuaderno()">

          <i class="fas fa-plus"></i>
          Crear cuaderno

        </button>

      </div>

    `;

    return;

  }


  cuadernos.forEach(function (cuaderno) {

    const card =
      document.createElement("div");

    card.className =
      "notebook-card";


    card.onclick =
      function (event) {

        if (
          event.target.closest(
            ".notebook-delete"
          )
        ) {

          return;

        }

        abrirCuaderno(cuaderno.id);

      };


    card.innerHTML = `

      <div class="notebook-card-icon">

        <i class="fas fa-book"></i>

      </div>


      <h3>
        ${escapeHTML(cuaderno.nombre)}
      </h3>


      <p>
        Abrir cuaderno →
      </p>


      <button
        class="notebook-delete"
        onclick="
          eliminarCuaderno(
            ${cuaderno.id}
          )
        "
        title="Eliminar cuaderno">

        <i class="fas fa-trash"></i>

      </button>

    `;


    contenedor.appendChild(card);

  });

}


function abrirCuaderno(id) {

  const cuaderno =
    cuadernos.find(function (c) {

      return c.id === id;

    });


  if (!cuaderno) return;


  cuadernoActualId =
    id;


  document
    .getElementById(
      "lista-cuadernos"
    )
    .classList.add("hidden");


  document
    .querySelector(
      "#cuadernos .page-heading"
    )
    .classList.add("hidden");


  const editorContainer =
    document.getElementById(
      "cuaderno-editor-container"
    );


  editorContainer.classList.remove(
    "hidden"
  );


  document
    .getElementById(
      "cuaderno-abierto-nombre"
    )
    .textContent =
      cuaderno.nombre;


  const editor =
    document.getElementById(
      "cuaderno-editor"
    );


  editor.innerHTML =
    cuaderno.contenido || "";


  editor.focus();


  editor.oninput =
    function () {

      guardarContenidoCuaderno();

    };

}


function cerrarCuaderno() {

  guardarContenidoCuaderno();


  cuadernoActualId =
    null;


  document
    .getElementById(
      "cuaderno-editor-container"
    )
    .classList.add("hidden");


  document
    .getElementById(
      "lista-cuadernos"
    )
    .classList.remove("hidden");


  document
    .querySelector(
      "#cuadernos .page-heading"
    )
    .classList.remove("hidden");


  cargarCuadernos();

}


function guardarContenidoCuaderno() {

  if (
    cuadernoActualId === null
  ) {

    return;

  }


  const cuaderno =
    cuadernos.find(function (c) {

      return c.id === cuadernoActualId;

    });


  if (!cuaderno) return;


  cuaderno.contenido =
    document
      .getElementById(
        "cuaderno-editor"
      )
      .innerHTML;


  guardarCuadernos();

}


function eliminarCuaderno(id) {

  const cuaderno =
    cuadernos.find(c => c.id === id);

  if (!cuaderno) return;


  if (
    !confirm(
      `¿Eliminar el cuaderno "${cuaderno.nombre}"?`
    )
  ) {

    return;

  }


  cuadernos =
    cuadernos.filter(function (c) {

      return c.id !== id;

    });


  guardarCuadernos();

  cargarCuadernos();

}


function eliminarCuadernoActual() {

  if (
    cuadernoActualId === null
  ) {

    return;

  }


  const id =
    cuadernoActualId;


  const cuaderno =
    cuadernos.find(c => c.id === id);


  if (!cuaderno) return;


  if (
    !confirm(
      `¿Eliminar "${cuaderno.nombre}"?`
    )
  ) {

    return;

  }


  cuadernos =
    cuadernos.filter(function (c) {

      return c.id !== id;

    });


  guardarCuadernos();

  cerrarCuaderno();

}


function formatoCuaderno(comando) {

  document.execCommand(
    comando,
    false,
    null
  );

  guardarContenidoCuaderno();

}


function cambiarFuenteCuaderno(
  fuente
) {

  document.execCommand(
    "fontName",
    false,
    fuente
  );

  guardarContenidoCuaderno();

}


function cambiarTamanoCuaderno(
  tamano
) {

  document.execCommand(
    "fontSize",
    false,
    "7"
  );


  const editor =
    document.getElementById(
      "cuaderno-editor"
    );


  editor
    .querySelectorAll(
      "font[size='7']"
    )
    .forEach(function (elemento) {

      elemento.style.fontSize =
        tamano;

      elemento.removeAttribute(
        "size"
      );

    });


  guardarContenidoCuaderno();

}


/* =====================================================
   ENCARGOS
===================================================== */

let encargos =
  JSON.parse(
    localStorage.getItem(
      "encargosClase"
    )
  ) || [];


function guardarEncargos() {

  localStorage.setItem(
    "encargosClase",
    JSON.stringify(encargos)
  );

}


function agregarEncargo() {

  const input =
    document.getElementById(
      "nuevo-encargo"
    );


  const texto =
    input.value.trim();


  if (!texto) return;


  encargos.push({

    id: Date.now(),

    texto: texto

  });


  input.value = "";

  guardarEncargos();

  cargarEncargos();

}


function cargarEncargos() {

  const lista =
    document.getElementById(
      "lista-encargos"
    );

  if (!lista) return;


  lista.innerHTML = "";


  encargos.forEach(function (encargo) {

    const li =
      document.createElement("li");


    li.innerHTML = `

      <span>
        ${escapeHTML(encargo.texto)}
      </span>

      <button
        class="icon-button"
        onclick="
          eliminarEncargo(
            ${encargo.id}
          )
        ">

        <i class="fas fa-trash"></i>

      </button>

    `;


    lista.appendChild(li);

  });

}


function eliminarEncargo(id) {

  encargos =
    encargos.filter(function (e) {

      return e.id !== id;

    });


  guardarEncargos();

  cargarEncargos();

}


/* =====================================================
   ANUNCIOS
===================================================== */

let anuncios =
  JSON.parse(
    localStorage.getItem(
      "anunciosClase"
    )
  ) || [];


function guardarAnuncios() {

  localStorage.setItem(
    "anunciosClase",
    JSON.stringify(anuncios)
  );

}


function agregarAnuncio() {

  const input =
    document.getElementById(
      "nuevo-anuncio"
    );


  const texto =
    input.value.trim();


  if (!texto) return;


  anuncios.push({

    id: Date.now(),

    texto: texto,

    fecha: new Date().toLocaleDateString(
      "es-GT"
    )

  });


  input.value = "";

  guardarAnuncios();

  cargarAnuncios();

}


function cargarAnuncios() {

  const contenedor =
    document.getElementById(
      "lista-anuncios"
    );

  if (!contenedor) return;


  contenedor.innerHTML = "";


  anuncios.forEach(function (anuncio) {

    const elemento =
      document.createElement("div");


    elemento.className =
      "announcement";


    elemento.innerHTML = `

      <strong>
        ${escapeHTML(anuncio.texto)}
      </strong>

      <p>
        ${escapeHTML(anuncio.fecha)}
      </p>

    `;


    contenedor.appendChild(elemento);

  });

}


/* =====================================================
   SEGURIDAD / TEXTO
===================================================== */

function escapeHTML(texto) {

  const div =
    document.createElement("div");

  div.textContent =
    texto;

  return div.innerHTML;

}