/* ==========================================================================
   COMPUGUED · TARJETAS GIRATORIAS
   Al tocar una tarjeta gira y muestra su cara trasera. Pasado un tiempo,
   vuelve sola a la cara frontal.
   ========================================================================== */


/* ==========================================================================
   CONFIGURACIÓN (puedes editar este valor)
   ========================================================================== */

/* Tiempo que la tarjeta permanece volteada, en milisegundos (10000 = 10 segundos) */
const TIEMPO_REVERSO_MS = 10000;

/* Se envía al CSS para que la barra inferior de la tarjeta dure exactamente lo mismo */
document.documentElement.style.setProperty("--tiempo-reverso", TIEMPO_REVERSO_MS + "ms");


/* ==========================================================================
   LÓGICA DE CADA TARJETA
   Clases que se agregan o quitan (definidas en css/styles.css):
     tarjeta-volteada → muestra la cara trasera
     tarjeta-vista    → la tarjeta ya fue tocada al menos una vez
   ========================================================================== */
document.querySelectorAll(".tarjeta").forEach(function (tarjeta) {

  const caraTrasera = tarjeta.querySelector(".cara-trasera");
  const barraTiempo = tarjeta.querySelector(".tarjeta-barra-tiempo");
  let temporizador = null;

  /* Muestra (true) u oculta (false) la cara trasera */
  function voltearTarjeta(mostrarReverso) {
    clearTimeout(temporizador);

    tarjeta.classList.toggle("tarjeta-volteada", mostrarReverso);
    tarjeta.classList.add("tarjeta-vista");

    /* Accesibilidad: informa a lectores de pantalla el estado actual */
    tarjeta.setAttribute("aria-pressed", String(mostrarReverso));
    if (caraTrasera) {
      caraTrasera.setAttribute("aria-hidden", String(!mostrarReverso));
    }

    if (mostrarReverso) {
      /* Reinicia la animación de la barra de tiempo */
      if (barraTiempo) {
        barraTiempo.style.animation = "none";
        void barraTiempo.offsetWidth;
        barraTiempo.style.animation = "";
      }

      /* Regresa sola a la cara frontal pasado el tiempo configurado */
      temporizador = setTimeout(function () {
        voltearTarjeta(false);
      }, TIEMPO_REVERSO_MS);
    }
  }

  /* Cambia entre cara frontal y trasera */
  function alternarTarjeta() {
    voltearTarjeta(!tarjeta.classList.contains("tarjeta-volteada"));
  }

  /* Con clic o toque */
  tarjeta.addEventListener("click", alternarTarjeta);

  /* Con teclado (Enter o barra espaciadora) */
  tarjeta.addEventListener("keydown", function (evento) {
    if (evento.key === "Enter" || evento.key === " ") {
      evento.preventDefault();
      alternarTarjeta();
    }
  });
});


/* ==========================================================================
   CLIMA EN TIEMPO REAL · CHICLAYO
   Consulta la temperatura actual en Open-Meteo (gratuito, sin clave) y la
   muestra en el widget .clima (esquina superior izquierda).
   El estilo y el efecto flotante están en css/styles.css (sección 5.1).
   ========================================================================== */


/* ==========================================================================
   CONFIGURACIÓN DEL CLIMA (puedes editar estos valores)
   ========================================================================== */

/* Coordenadas de Chiclayo */
const CLIMA_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=-6.7714&longitude=-79.8409&current_weather=true";

/* Suma fija a la temperatura recibida (igual que en el otro proyecto). Ponle 0 para no ajustar */
const CLIMA_AJUSTE_GRADOS = 1;

/* Cada cuánto se actualiza, en milisegundos (600000 = 10 minutos) */
const CLIMA_ACTUALIZAR_MS = 600000;


/* ==========================================================================
   LÓGICA DEL CLIMA
   ========================================================================== */
const textoTemperatura = document.querySelector(".clima-temperatura");

/* Consulta el clima y escribe la temperatura. Si falla, muestra "-- °C" */
function actualizarClima() {
  if (!textoTemperatura) {
    return;
  }

  fetch(CLIMA_URL)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      const grados = Math.round(datos.current_weather.temperature) + CLIMA_AJUSTE_GRADOS;
      textoTemperatura.textContent = grados + " °C";
    })
    .catch(function () {
      textoTemperatura.textContent = "-- °C";
    });
}

/* Carga inicial */
actualizarClima();

/* Actualizar cada 10 minutos */
setInterval(actualizarClima, CLIMA_ACTUALIZAR_MS);
