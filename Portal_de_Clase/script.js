const USUARIO_CORRECTO = "Belén";
const PASSWORD_CORRECTA = "2009sl";

const DIAS = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo"
];

const MESES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre"
];


let clases =
  JSON.parse(
    localStorage.getItem("clasesClase") || "[]"
  );

let eventos =
  JSON.parse(
    localStorage.getItem("eventosHorario") || "[]"
  );

let cuadernos =
  JSON.parse(
    localStorage.getItem("cuadernosClase") || "[]"
  );

let encargos =
  JSON.parse(
    localStorage.getItem("encargosClase") || "[]"
  );

let anuncios =
  JSON.parse(
    localStorage.getItem("anunciosClase") || "[]"
  );

let calendarioEventos =
  JSON.parse(
    localStorage.getItem("calendarioClase") || "[]"
  );


let cuadernoActualId = null;

let calendarDate = new Date();

calendarDate.setDate(1);

if(calendarDate.getFullYear() < 2000){

  calendarDate.setFullYear(2026);

}


/* ================= INICIO ================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const form =
      document.getElementById("login-form");

    if(form){

      form.addEventListener(
        "submit",
        e => {

          e.preventDefault();

          iniciarSesion();

        }
      );

    }


    if(
      localStorage.getItem("claseSesion")
      ===
      "activa"
    ){

      mostrarApp();

    }else{

      mostrarLogin();

    }


    cargarClases();

    cargarHorario();

    cargarAgenda();

    cargarCuadernos();

    cargarEncargos();

    cargarAnuncios();

    inicializarCalendario();

  }
);


/* =====================================================
   LOGIN Y REGISTRO
===================================================== */

/* Usuario maestro */
const USUARIO_MAESTRO = "Belén";
const PASSWORD_MAESTRA = "2009sl";


/* =====================================================
   OBTENER USUARIOS
===================================================== */

function obtenerUsuarios() {

  const usuariosGuardados =
    JSON.parse(localStorage.getItem("usuariosClase"));

  if (usuariosGuardados && Array.isArray(usuariosGuardados)) {
    return usuariosGuardados;
  }

  /* Crear usuario maestro si todavía no existe */
  const usuariosIniciales = [
    {
      usuario: USUARIO_MAESTRO,
      password: PASSWORD_MAESTRA
    }
  ];

  localStorage.setItem(
    "usuariosClase",
    JSON.stringify(usuariosIniciales)
  );

  return usuariosIniciales;
}


/* =====================================================
   GUARDAR USUARIOS
===================================================== */

function guardarUsuarios(usuarios) {

  localStorage.setItem(
    "usuariosClase",
    JSON.stringify(usuarios)
  );

}


/* =====================================================
   INICIAR SESIÓN
===================================================== */

function iniciarSesion() {

  const usuarioInput =
    document.getElementById("login-usuario");

  const passwordInput =
    document.getElementById("login-password");

  const error =
    document.getElementById("login-error");


  if (!usuarioInput || !passwordInput) {
    console.error(
      "No se encontraron los campos de inicio de sesión."
    );

    return;
  }


  const usuario =
    usuarioInput.value.trim();

  const password =
    passwordInput.value;


  if (!usuario || !password) {

    if (error) {
      error.textContent =
        "Escribe tu usuario y contraseña.";
    }

    return;
  }


  const usuarios =
    obtenerUsuarios();


  const usuarioEncontrado =
    usuarios.find(function (u) {

      return (
        u.usuario === usuario &&
        u.password === password
      );

    });


  if (usuarioEncontrado) {

    /* Guardar sesión */
    localStorage.setItem(
      "claseSesion",
      "activa"
    );

    localStorage.setItem(
      "usuarioActual",
      usuario
    );


    if (error) {
      error.textContent = "";
    }


    mostrarApp();

  } else {

    if (error) {

      error.textContent =
        "Usuario o contraseña incorrectos.";

    }

  }

}


/* =====================================================
   MOSTRAR REGISTRO
===================================================== */

function mostrarRegistro() {

  const login =
    document.getElementById("login-page");

  const registro =
    document.getElementById("registro-page");


  if (login) {
    login.classList.add("hidden");
  }


  if (registro) {
    registro.classList.remove("hidden");
  }


  const mensaje =
    document.getElementById("registro-mensaje");

  if (mensaje) {
    mensaje.textContent = "";
  }

}


/* =====================================================
   MOSTRAR LOGIN
===================================================== */

function mostrarLogin() {

  const login =
    document.getElementById("login-page");

  const registro =
    document.getElementById("registro-page");


  if (registro) {
    registro.classList.add("hidden");
  }


  if (login) {
    login.classList.remove("hidden");
  }


  const usuario =
    document.getElementById("login-usuario");

  const password =
    document.getElementById("login-password");


  if (usuario) {
    usuario.value = "";
  }


  if (password) {
    password.value = "";
  }

}


/* =====================================================
   CREAR CUENTA
===================================================== */

function crearCuenta() {

  const usuarioInput =
    document.getElementById("registro-usuario");

  const passwordInput =
    document.getElementById("registro-password");

  const mensaje =
    document.getElementById("registro-mensaje");


  if (!usuarioInput || !passwordInput) {
    console.error(
      "No se encontraron los campos de registro."
    );

    return;
  }


  const nuevoUsuario =
    usuarioInput.value.trim();

  const nuevaPassword =
    passwordInput.value;


  /* Validar campos */

  if (!nuevoUsuario || !nuevaPassword) {

    if (mensaje) {
      mensaje.textContent =
        "Completa todos los campos.";
      mensaje.style.color = "#dc2626";
    }

    return;
  }


  /* Mínimo de seguridad */

  if (nuevaPassword.length < 4) {

    if (mensaje) {
      mensaje.textContent =
        "La contraseña debe tener al menos 4 caracteres.";
      mensaje.style.color = "#dc2626";
    }

    return;
  }


  const usuarios =
    obtenerUsuarios();


  /* Comprobar si ya existe */

  const existe =
    usuarios.some(function (u) {

      return (
        u.usuario.toLowerCase() ===
        nuevoUsuario.toLowerCase()
      );

    });


  if (existe) {

    if (mensaje) {
      mensaje.textContent =
        "Ese usuario ya existe.";
      mensaje.style.color = "#dc2626";
    }

    return;
  }


  /* Crear usuario */

  usuarios.push({

    usuario: nuevoUsuario,

    password: nuevaPassword

  });


  guardarUsuarios(usuarios);


  if (mensaje) {

    mensaje.textContent =
      "Cuenta creada correctamente. Ahora puedes iniciar sesión.";

    mensaje.style.color = "#16a34a";

  }


  /* Limpiar formulario */

  usuarioInput.value = "";
  passwordInput.value = "";


  /* Esperar un momento y volver al login */

  setTimeout(function () {

    mostrarLogin();

  }, 1200);

}


/* =====================================================
   MOSTRAR APLICACIÓN
===================================================== */

function mostrarApp() {

  const login =
    document.getElementById("login-page");

  const registro =
    document.getElementById("registro-page");

  const app =
    document.getElementById("app");


  if (login) {
    login.classList.add("hidden");
  }


  if (registro) {
    registro.classList.add("hidden");
  }


  if (app) {
    app.classList.remove("hidden");
  }


  actualizarSaludo();


  /* Mostrar panel principal */

  mostrarSeccion("principal");

}


/* =====================================================
   CERRAR SESIÓN
===================================================== */

function cerrarSesion() {

  localStorage.removeItem(
    "claseSesion"
  );

  localStorage.removeItem(
    "usuarioActual"
  );


  const usuario =
    document.getElementById("login-usuario");

  const password =
    document.getElementById("login-password");


  if (usuario) {
    usuario.value = "";
  }


  if (password) {
    password.value = "";
  }


  mostrarLogin();

}


/* =====================================================
   SALUDO
===================================================== */

function actualizarSaludo() {

  const saludo =
    document.getElementById("saludo");

  const subtitulo =
    document.getElementById("saludo-subtexto");

  const usuario =
    localStorage.getItem("usuarioActual") ||
    USUARIO_MAESTRO;


  const hora =
    new Date().getHours();


  let textoSaludo;


  if (hora < 12) {

    textoSaludo = "Buenos días";

  } else if (hora < 19) {

    textoSaludo = "Buenas tardes";

  } else {

    textoSaludo = "Buenas noches";

  }


  if (saludo) {

    saludo.textContent =
      `${textoSaludo}, ${usuario} 👋`;

  }


  if (subtitulo) {

    subtitulo.textContent =
      `Bienvenido, ${usuario}. Aquí tienes un resumen de hoy.`;

  }


  const usuarioHeader =
    document.getElementById("usuario-header");

  if (usuarioHeader) {

    usuarioHeader.textContent =
      usuario;

  }

}


/* =====================================================
   COMPROBAR SESIÓN AL ABRIR LA PÁGINA
===================================================== */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* Crear usuario maestro automáticamente */
    obtenerUsuarios();


    const sesion =
      localStorage.getItem("claseSesion");


    if (sesion === "activa") {

      mostrarApp();

    } else {

      mostrarLogin();

    }

  }
);


/* ================= NAVEGACIÓN ================= */

function mostrarSeccion(
  nombre,
  el = null
){

  document
    .querySelectorAll(".seccion")
    .forEach(
      s =>
        s.classList.add("hidden")
    );


  const s =
    document.getElementById(nombre);

  if(s){

    s.classList.remove("hidden");

  }


  document
    .querySelectorAll(".menu li")
    .forEach(
      x =>
        x.classList.remove("active")
    );


  if(el){

    el.classList.add("active");

  }else{

    const item =
      [
        ...document.querySelectorAll(
          ".menu li"
        )
      ].find(
        x =>
          x.textContent
            .trim()
            .toLowerCase()
            .includes(
              nombre === "principal"
                ? "panel principal"
                : nombre
            )
      );

    if(item){

      item.classList.add("active");

    }

  }


  if(nombre === "horario"){

    cargarHorario();

  }


  if(nombre === "calendario"){

    renderizarCalendario();

  }


  if(nombre === "cuadernos"){

    cargarCuadernos();

  }


  if(nombre === "anuncios"){

    cargarAnuncios();

  }


  document
    .getElementById("sidebar")
    ?.classList
    .remove("open");


  window.scrollTo({
    top:0,
    behavior:"smooth"
  });

}


function abrirDesdePanel(nombre){

  mostrarSeccion(nombre);

}


function toggleSidebar(){

  document
    .getElementById("sidebar")
    ?.classList
    .toggle("open");

}


/* ================= TODO ================= */

function abrirCrearClase(){

  document
    .getElementById("modal-clase")
    .classList
    .remove("hidden");

  setTimeout(
    () =>
      document
        .getElementById("nombre-clase")
        .focus(),
    50
  );

}


function cerrarCrearClase(){

  document
    .getElementById("modal-clase")
    .classList
    .add("hidden");

  document
    .getElementById("nombre-clase")
    .value = "";

}


function crearClase(){

  const n =
    document
      .getElementById("nombre-clase")
      .value
      .trim();


  if(!n){

    alert(
      "Escribe el nombre de la clase."
    );

    return;

  }


  clases.push({

    id:Date.now(),

    nombre:n,

    tareas:[]

  });


  guardarClases();

  cargarClases();

  cerrarCrearClase();

}


function guardarClases(){

  localStorage.setItem(
    "clasesClase",
    JSON.stringify(clases)
  );

}


function cargarClases(){

  const box =
    document.getElementById(
      "lista-clases"
    );

  if(!box)return;


  box.innerHTML = "";


  if(!clases.length){

    box.innerHTML =
      `
      <div class="empty-section">
        <p>
          No hay clases todavía.
          Crea una clase para empezar.
        </p>
      </div>
      `;

    return;

  }


  clases.forEach(c => {

    const card =
      document.createElement("div");

    card.className =
      "class-card";


    card.innerHTML =
      `
      <div class="class-header">

        <div class="class-title-area">

          <div class="class-icon">
            <i class="fas fa-book"></i>
          </div>

          <div>

            <div class="class-title">
              ${escapeHTML(c.nombre)}
            </div>

            <div class="class-count">

              ${c.tareas.length}
              ${c.tareas.length === 1
                ? "tarea"
                : "tareas"}

            </div>

          </div>

        </div>


        <div class="class-actions">

          <button
            onclick="eliminarClase(${c.id})"
            title="Eliminar clase"
          >

            <i class="fas fa-trash"></i>

          </button>

        </div>

      </div>


      <div class="class-body">

        <div class="task-add">

          <input
            id="task-input-${c.id}"
            placeholder="Agregar una tarea a ${escapeHTML(c.nombre)}..."
            onkeydown="enterAgregarTarea(event,${c.id})"
          >

          <button
            onclick="agregarTarea(${c.id})"
          >

            <i class="fas fa-plus"></i>

          </button>

        </div>


        <ul class="task-list">

          ${
            c.tareas.length

            ?

            c.tareas
              .map(
                t =>
                  `
                  <li
                    class="task-item ${t.completada ? "done" : ""}"
                  >

                    <input
                      type="checkbox"
                      ${t.completada ? "checked" : ""}
                      onchange="cambiarEstadoTarea(${c.id},${t.id})"
                    >

                    <span class="task-text">
                      ${escapeHTML(t.texto)}
                    </span>

                    <button
                      class="delete-task"
                      onclick="eliminarTarea(${c.id},${t.id})"
                    >

                      <i class="fas fa-trash"></i>

                    </button>

                  </li>
                  `
              )
              .join("")

            :

            `
            <li class="no-tasks">
              Todavía no hay tareas en esta clase.
            </li>
            `
          }

        </ul>

      </div>
      `;


    box.appendChild(card);

  });

}


function enterAgregarTarea(e,id){

  if(e.key === "Enter"){

    e.preventDefault();

    agregarTarea(id);

  }

}


function agregarTarea(claseId){

  const input =
    document.getElementById(
      `task-input-${claseId}`
    );

  if(!input)return;


  const text =
    input.value.trim();


  if(!text)return;


  const c =
    clases.find(
      x =>
        x.id === claseId
    );

  if(!c)return;


  c.tareas.push({

    id:Date.now(),

    texto:text,

    completada:false

  });


  guardarClases();

  cargarClases();

}


function cambiarEstadoTarea(
  cid,
  tid
){

  const c =
    clases.find(
      x =>
        x.id === cid
    );

  const t =
    c?.tareas.find(
      x =>
        x.id === tid
    );


  if(!t)return;


  t.completada =
    !t.completada;


  guardarClases();

  cargarClases();

}


function eliminarTarea(
  cid,
  tid
){

  const c =
    clases.find(
      x =>
        x.id === cid
    );

  if(!c)return;


  c.tareas =
    c.tareas.filter(
      t =>
        t.id !== tid
    );


  guardarClases();

  cargarClases();

}


function eliminarClase(id){

  if(
    !confirm(
      "¿Eliminar esta clase y sus tareas?"
    )
  ){

    return;

  }


  clases =
    clases.filter(
      c =>
        c.id !== id
    );


  guardarClases();

  cargarClases();

}


/* ================= HORARIO ================= */

function guardarHorario(){

  localStorage.setItem(
    "eventosHorario",
    JSON.stringify(eventos)
  );

}


function horaMin(h){

  if(h === "00:00"){

    return 1440;

  }


  const [a,b] =
    h.split(":")
     .map(Number);


  return a * 60 + b;

}


function horaTexto(min){

  if(min === 1440){

    return "12:00 AM";

  }


  let h =
    Math.floor(min / 60);

  let m =
    min % 60;

  let p =
    h >= 12
      ? "PM"
      : "AM";

  let h12 =
    h % 12 || 12;


  return (
    `${h12}:${String(m).padStart(2,"0")} ${p}`
  );

}


function crearHorasHorario(){

  const col =
    document.getElementById(
      "time-column"
    );

  if(!col)return;


  col.innerHTML = "";


  for(
    let i = 0;
    i < 24;
    i++
  ){

    const label =
      document.createElement("div");

    label.className =
      "time-label";


    const h =
      i + 1;


    label.textContent =
      h === 24
        ? "12 AM"
        : h === 12
          ? "12 PM"
          : h < 12
            ? `${h} AM`
            : `${h - 12} PM`;


    label.style.top =
      `${i * 60}px`;


    col.appendChild(label);

  }

}


function cargarHorario(){

  crearHorasHorario();

  renderizarEventos();

}


function agregarEvento(){

  const nombre =
    document
      .getElementById("evento-nombre")
      .value
      .trim();


  const dia =
    Number(
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


  const color =
    document
      .getElementById("evento-color")
      .value;


  if(
    !nombre ||
    !inicio ||
    !fin
  ){

    alert(
      "Completa el evento y las horas."
    );

    return;

  }


  const a =
    horaMin(inicio);

  const b =
    horaMin(fin);


  if(
    a < 60 ||
    b <= a ||
    b > 1440
  ){

    alert(
      "Usa un horario entre 1:00 AM y 12:00 AM y una finalización posterior."
    );

    return;

  }


  eventos.push({

    id:Date.now(),

    nombre,

    dia,

    inicio,

    fin,

    color

  });


  guardarHorario();

  renderizarEventos();


  document
    .getElementById("evento-nombre")
    .value = "";

}


function gruposSolapados(lista){

  const sorted =
    [...lista].sort(
      (a,b) =>
        horaMin(a.inicio) -
        horaMin(b.inicio)
    );


  const groups = [];


  sorted.forEach(e => {

    const a =
      horaMin(e.inicio);

    const b =
      horaMin(e.fin);


    let g =
      groups.find(
        x =>
          x.some(
            o =>
              a < horaMin(o.fin) &&
              b > horaMin(o.inicio)
          )
      );


    if(g){

      g.push(e);

    }else{

      groups.push([e]);

    }

  });


  return groups;

}


function renderizarEventos(){

  document
    .querySelectorAll(".day-column")
    .forEach(
      c =>
        c.innerHTML = ""
    );


  for(
    let d = 0;
    d < 7;
    d++
  ){

    const col =
      document.querySelector(
        `.day-column[data-day="${d}"]`
      );


    if(!col)continue;


    gruposSolapados(
      eventos.filter(
        e =>
          e.dia === d
      )
    )
    .forEach(
      group =>
        group.forEach(
          (e,i) => {

            const a =
              horaMin(e.inicio);

            const b =
              horaMin(e.fin);


            const el =
              document.createElement("div");


            const w =
              100 / group.length;


            el.className =
              "evento";


            el.style.top =
              `${a - 60}px`;


            el.style.height =
              `${Math.max(
                22,
                b - a
              )}px`;


            el.style.left =
              `calc(${i*w}% + 3px)`;


            el.style.width =
              `calc(${w}% - 6px)`;


            el.style.background =
              e.color + "33";


            el.style.borderLeftColor =
              e.color;


            el.innerHTML =
              `
              <div class="evento-nombre">
                ${escapeHTML(e.nombre)}
              </div>

              <div class="evento-hora">
                ${horaTexto(a)}
                -
                ${horaTexto(b)}
              </div>
              `;


            el.title =
              "Clic para eliminar";


            el.onclick =
              () =>
                eliminarEvento(e.id);


            col.appendChild(el);

          }
        )
    );

  }

}


function eliminarEvento(id){

  const e =
    eventos.find(
      x =>
        x.id === id
    );


  if(!e)return;


  if(
    !confirm(
      `¿Eliminar "${e.nombre}" del horario?`
    )
  ){

    return;

  }


  eventos =
    eventos.filter(
      x =>
        x.id !== id
    );


  guardarHorario();

  renderizarEventos();

}


/* ================= AGENDA ================= */

function cargarAgenda(){

  const e =
    document.getElementById(
      "agenda-editor"
    );


  if(!e)return;


  e.innerHTML =
    localStorage.getItem(
      "agendaClase"
    ) || "";


  e.addEventListener(
    "input",
    guardarAgenda
  );

}


function guardarAgenda(){

  const e =
    document.getElementById(
      "agenda-editor"
    );


  if(e){

    localStorage.setItem(
      "agendaClase",
      e.innerHTML
    );

  }

}


function formatoAgenda(cmd){

  const e =
    document.getElementById(
      "agenda-editor"
    );


  e.focus();

  document.execCommand(
    cmd,
    false,
    null
  );

  guardarAgenda();

}


function cambiarFuenteAgenda(){

  const e =
    document.getElementById(
      "agenda-editor"
    );


  e.focus();


  document.execCommand(
    "fontName",
    false,
    document.getElementById(
      "agenda-font"
    ).value
  );


  guardarAgenda();

}


function cambiarTamanoAgenda(){

  const e =
    document.getElementById(
      "agenda-editor"
    );


  e.focus();


  document.execCommand(
    "fontSize",
    false,
    "7"
  );


  e
    .querySelectorAll(
      "font[size='7']"
    )
    .forEach(
      x => {

        x.style.fontSize =
          document.getElementById(
            "agenda-size"
          ).value;

        x.removeAttribute("size");

      }
    );


  guardarAgenda();

}


/* ================= CUADERNOS ================= */

function guardarCuadernos(){

  localStorage.setItem(
    "cuadernosClase",
    JSON.stringify(cuadernos)
  );

}


function crearCuaderno(){

  const n =
    prompt(
      "¿Cómo quieres llamar al cuaderno?"
    )?.trim();


  if(!n)return;


  const c = {

    id:Date.now(),

    nombre:n,

    contenido:""

  };


  cuadernos.push(c);

  guardarCuadernos();

  cargarCuadernos();

  abrirCuaderno(c.id);

}


function cargarCuadernos(){

  const box =
    document.getElementById(
      "lista-cuadernos"
    );


  if(!box)return;


  box.innerHTML = "";


  if(!cuadernos.length){

    box.innerHTML =
      `
      <div class="empty-section">

        <p>
          No tienes cuadernos todavía.
          Pulsa “Nuevo cuaderno”
          para crear uno.
        </p>

      </div>
      `;

    return;

  }


  cuadernos.forEach(c => {

    const card =
      document.createElement(
        "div"
      );


    card.className =
      "notebook-card";


    card.onclick =
      e => {

        if(
          !e.target.closest(
            ".notebook-delete"
          )
        ){

          abrirCuaderno(c.id);

        }

      };


    card.innerHTML =
      `
      <div class="notebook-card-icon">

        <i class="fas fa-book"></i>

      </div>

      <h3>
        ${escapeHTML(c.nombre)}
      </h3>

      <p>
        Abrir cuaderno →
      </p>

      <button
        class="notebook-delete"
        onclick="eliminarCuaderno(${c.id})"
      >

        <i class="fas fa-trash"></i>

      </button>
      `;


    box.appendChild(card);

  });

}


function abrirCuaderno(id){

  const c =
    cuadernos.find(
      x =>
        x.id === id
    );


  if(!c)return;


  cuadernoActualId =
    id;


  document
    .getElementById(
      "lista-cuadernos"
    )
    .classList
    .add("hidden");


  document
    .querySelector(
      "#cuadernos .page-heading"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "cuaderno-editor-container"
    )
    .classList
    .remove("hidden");


  document
    .getElementById(
      "cuaderno-abierto-nombre"
    )
    .textContent =
      c.nombre;


  const e =
    document.getElementById(
      "cuaderno-editor"
    );


  e.innerHTML =
    c.contenido || "";


  e.oninput =
    guardarContenidoCuaderno;


  e.focus();

}


function cerrarCuaderno(){

  guardarContenidoCuaderno();

  cuadernoActualId =
    null;


  document
    .getElementById(
      "cuaderno-editor-container"
    )
    .classList
    .add("hidden");


  document
    .getElementById(
      "lista-cuadernos"
    )
    .classList
    .remove("hidden");


  document
    .querySelector(
      "#cuadernos .page-heading"
    )
    .classList
    .remove("hidden");


  cargarCuadernos();

}


function guardarContenidoCuaderno(){

  if(
    cuadernoActualId === null
  ){

    return;

  }


  const c =
    cuadernos.find(
      x =>
        x.id === cuadernoActualId
    );


  const e =
    document.getElementById(
      "cuaderno-editor"
    );


  if(c && e){

    c.contenido =
      e.innerHTML;


    guardarCuadernos();

  }

}


function eliminarCuaderno(id){

  const c =
    cuadernos.find(
      x =>
        x.id === id
    );


  if(
    !c ||
    !confirm(
      `¿Eliminar el cuaderno "${c.nombre}"?`
    )
  ){

    return;

  }


  cuadernos =
    cuadernos.filter(
      x =>
        x.id !== id
    );


  guardarCuadernos();

  cargarCuadernos();

}


function eliminarCuadernoActual(){

  if(
    cuadernoActualId !== null
  ){

    eliminarCuaderno(
      cuadernoActualId
    );

  }

  cerrarCuaderno();

}


function formatoCuaderno(cmd){

  const e =
    document.getElementById(
      "cuaderno-editor"
    );


  e.focus();


  document.execCommand(
    cmd,
    false,
    null
  );


  guardarContenidoCuaderno();

}


function cambiarFuenteCuaderno(f){

  const e =
    document.getElementById(
      "cuaderno-editor"
    );


  e.focus();


  document.execCommand(
    "fontName",
    false,
    f
  );


  guardarContenidoCuaderno();

}


function cambiarTamanoCuaderno(s){

  const e =
    document.getElementById(
      "cuaderno-editor"
    );


  e.focus();


  document.execCommand(
    "fontSize",
    false,
    "7"
  );


  e
    .querySelectorAll(
      "font[size='7']"
    )
    .forEach(
      x => {

        x.style.fontSize = s;

        x.removeAttribute("size");

      }
    );


  guardarContenidoCuaderno();

}


/* ================= ENCARGOS ================= */

function guardarEncargos(){

  localStorage.setItem(
    "encargosClase",
    JSON.stringify(encargos)
  );

}


function agregarEncargo(){

  const i =
    document.getElementById(
      "nuevo-encargo"
    );


  const t =
    i.value.trim();


  if(!t)return;


  encargos.push({

    id:Date.now(),

    texto:t

  });


  guardarEncargos();

  i.value = "";

  cargarEncargos();

}


function cargarEncargos(){

  const l =
    document.getElementById(
      "lista-encargos"
    );


  if(!l)return;


  l.innerHTML = "";


  encargos.forEach(e => {

    const li =
      document.createElement(
        "li"
      );


    li.innerHTML =
      `
      <span>
        ${escapeHTML(e.texto)}
      </span>

      <button
        class="icon-button"
        onclick="eliminarEncargo(${e.id})"
      >

        <i class="fas fa-trash"></i>

      </button>
      `;


    l.appendChild(li);

  });

}


function eliminarEncargo(id){

  encargos =
    encargos.filter(
      e =>
        e.id !== id
    );


  guardarEncargos();

  cargarEncargos();

}


/* ================= ANUNCIOS ================= */

function guardarAnuncios(){

  localStorage.setItem(
    "anunciosClase",
    JSON.stringify(anuncios)
  );

}


function agregarAnuncio(){

  const i =
    document.getElementById(
      "nuevo-anuncio"
    );


  const t =
    i.value.trim();


  if(!t)return;


  anuncios.unshift({

    id:Date.now(),

    texto:t,

    fecha:
      new Date()
        .toLocaleDateString("es-GT")

  });


  guardarAnuncios();

  i.value = "";

  cargarAnuncios();

}


function cargarAnuncios(){

  const box =
    document.getElementById(
      "lista-anuncios"
    );


  if(!box)return;


  box.innerHTML = "";


  anuncios.forEach(a => {

    const el =
      document.createElement(
        "div"
      );


    el.className =
      "announcement";


    el.innerHTML =
      `
      <div class="announcement-head">

        <strong>
          ${escapeHTML(a.texto)}
        </strong>

        <button
          class="announcement-delete"
          onclick="eliminarAnuncio(${a.id})"
        >

          <i class="fas fa-trash"></i>

        </button>

      </div>

      <div class="announcement-date">

        ${escapeHTML(a.fecha)}

      </div>
      `;


    box.appendChild(el);

  });

}


function eliminarAnuncio(id){

  anuncios =
    anuncios.filter(
      a =>
        a.id !== id
    );


  guardarAnuncios();

  cargarAnuncios();

}


/* ================= CALENDARIO ================= */

function guardarCalendario(){

  localStorage.setItem(
    "calendarioClase",
    JSON.stringify(
      calendarioEventos
    )
  );

}


function inicializarCalendario(){

  const ms =
    document.getElementById(
      "calendar-month"
    );

  const ys =
    document.getElementById(
      "calendar-year"
    );

  const dm =
    document.getElementById(
      "cal-event-month"
    );

  const dy =
    document.getElementById(
      "cal-event-year"
    );

  const dd =
    document.getElementById(
      "cal-event-day"
    );


  if(!ms || !ys)return;


  MESES.forEach(
    (m,i) => {

      ms.add(
        new Option(m,i)
      );

      dm.add(
        new Option(m,i)
      );

    }
  );


  for(
    let y = 2000;
    y <= 3000;
    y++
  ){

    ys.add(
      new Option(y,y)
    );

    dy.add(
      new Option(y,y)
    );

  }


  ys.value =
    calendarDate.getFullYear();

  ms.value =
    calendarDate.getMonth();

  dm.value =
    calendarDate.getMonth();

  dy.value =
    calendarDate.getFullYear();


  llenarDiasCalendario();

  renderizarCalendario();

}


function diasEnMes(y,m){

  return new Date(
    y,
    m + 1,
    0
  ).getDate();

}


function llenarDiasCalendario(){

  const d =
    document.getElementById(
      "cal-event-day"
    );


  const m =
    Number(
      document.getElementById(
        "cal-event-month"
      ).value
    );


  const y =
    Number(
      document.getElementById(
        "cal-event-year"
      ).value
    );


  if(!d)return;


  const old =
    Number(d.value) || 1;


  d.innerHTML = "";


  for(
    let i = 1;
    i <= diasEnMes(y,m);
    i++
  ){

    d.add(
      new Option(i,i)
    );

  }


  d.value =
    Math.min(
      old,
      d.options.length
    );

}


function cambiarCalendarioPorSelect(){

  calendarDate.setFullYear(
    Number(
      document.getElementById(
        "calendar-year"
      ).value
    ),
    Number(
      document.getElementById(
        "calendar-month"
      ).value
    ),
    1
  );


  renderizarCalendario();

}


function cambiarMesCalendario(delta){

  let y =
    calendarDate.getFullYear();

  let m =
    calendarDate.getMonth()
    + delta;


  if(m < 0){

    m = 11;

    y--;

  }


  if(m > 11){

    m = 0;

    y++;

  }


  y =
    Math.max(
      2000,
      Math.min(
        3000,
        y
      )
    );


  calendarDate =
    new Date(
      y,
      m,
      1
    );


  document
    .getElementById(
      "calendar-year"
    )
    .value = y;


  document
    .getElementById(
      "calendar-month"
    )
    .value = m;


  renderizarCalendario();

}


function fechaClave(
  y,
  m,
  d
){

  return `${y}-${String(
    m + 1
  ).padStart(2,"0")}-${String(
    d
  ).padStart(2,"0")}`;

}


function renderizarCalendario(){

  const box =
    document.getElementById(
      "calendar"
    );


  if(!box)return;


  const y =
    calendarDate.getFullYear();

  const m =
    calendarDate.getMonth();


  document
    .getElementById(
      "calendar-year"
    )
    .value = y;


  document
    .getElementById(
      "calendar-month"
    )
    .value = m;


  const first =
    (
      new Date(
        y,
        m,
        1
      ).getDay()
      + 6
    ) % 7;


  const last =
    diasEnMes(y,m);


  const prev =
    diasEnMes(
      y,
      m - 1
    );


  let h =
    `
    <div class="calendar-weekdays">

      ${
        DIAS
          .map(
            x =>
              `<div>${x.toUpperCase()}</div>`
          )
          .join("")
      }

    </div>

    <div class="calendar-grid">
    `;


  for(
    let i = 0;
    i < 42;
    i++
  ){

    let n =
      i - first + 1;

    let yy = y;

    let mm = m;

    let muted = false;


    if(n < 1){

      n =
        prev + n;

      mm =
        m - 1;


      if(mm < 0){

        mm = 11;

        yy--;

      }


      muted = true;

    }


    else if(n > last){

      n =
        n - last;

      mm =
        m + 1;


      if(mm > 11){

        mm = 0;

        yy++;

      }


      muted = true;

    }


    const key =
      fechaClave(
        yy,
        mm,
        n
      );


    const evs =
      calendarioEventos.filter(
        e =>
          e.fecha === key
      );


    const today =
      new Date();


    const istoday =
      key ===
      fechaClave(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );


    h +=
      `
      <div
        class="calendar-day
        ${muted ? "muted" : ""}
        ${istoday ? "today" : ""}"
      >

        <div class="day-number">
          ${n}
        </div>

        ${
          evs
            .slice(0,12)
            .map(
              e =>
                `
                <div
                  class="cal-event"
                  style="
                    background:${e.color}22;
                    border-left:3px solid ${e.color}
                  "
                  title="Clic para eliminar"
                  onclick="eliminarEventoCalendario(event,${e.id})"
                >
                  ${escapeHTML(e.titulo)}
                </div>
                `
            )
            .join("")
        }

      </div>
      `;

  }


  box.innerHTML =
    h + "</div>";

}


function agregarEventoCalendario(){

  const title =
    document
      .getElementById(
        "cal-event-title"
      )
      .value
      .trim();


  const d =
    Number(
      document.getElementById(
        "cal-event-day"
      ).value
    );


  const m =
    Number(
      document.getElementById(
        "cal-event-month"
      ).value
    );


  const y =
    Number(
      document.getElementById(
        "cal-event-year"
      ).value
    );


  const color =
    document.getElementById(
      "cal-event-color"
    ).value;


  if(!title){

    alert(
      "Escribe el nombre del evento."
    );

    return;

  }


  const date =
    new Date(
      y,
      m,
      d
    );


  if(
    date.getFullYear() !== y ||
    date.getMonth() !== m ||
    date.getDate() !== d
  ){

    alert(
      "La fecha seleccionada no existe."
    );

    return;

  }


  const key =
    fechaClave(
      y,
      m,
      d
    );


  const count =
    calendarioEventos.filter(
      e =>
        e.fecha === key
    ).length;


  if(count >= 12){

    alert(
      "Ese día ya tiene el máximo de 12 eventos."
    );

    return;

  }


  calendarioEventos.push({

    id:Date.now(),

    titulo:title,

    fecha:key,

    color

  });


  guardarCalendario();


  document
    .getElementById(
      "cal-event-title"
    )
    .value = "";


  calendarDate =
    new Date(
      y,
      m,
      1
    );


  document
    .getElementById(
      "calendar-year"
    )
    .value = y;


  document
    .getElementById(
      "calendar-month"
    )
    .value = m;


  renderizarCalendario();

}


function eliminarEventoCalendario(
  e,
  id
){

  e.stopPropagation();


  const x =
    calendarioEventos.find(
      a =>
        a.id === id
    );


  if(
    !x ||
    !confirm(
      `¿Eliminar "${x.titulo}"?`
    )
  ){

    return;

  }


  calendarioEventos =
    calendarioEventos.filter(
      a =>
        a.id !== id
    );


  guardarCalendario();

  renderizarCalendario();

}


/* ACTUALIZAR DÍAS AL CAMBIAR MES/AÑO */

document
  .getElementById(
    "cal-event-month"
  )
  ?.addEventListener(
    "change",
    () => {
      llenarDiasCalendario();
    }
  );


document
  .getElementById(
    "cal-event-year"
  )
  ?.addEventListener(
    "change",
    () => {
      llenarDiasCalendario();
    }
  );


/* ================= SEGURIDAD DE TEXTO ================= */

function escapeHTML(t){

  const d =
    document.createElement(
      "div"
    );

  d.textContent =
    t;

  return d.innerHTML;

}