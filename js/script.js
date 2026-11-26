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
   Datos de Open-Meteo (gratuito, sin clave). Se consulta al abrir la página y
   luego cada cierto tiempo. El icono animado lo elige el CSS según el atributo
   data-estado del bloque .clima (ver sección 5.1 de css/styles.css).
   ========================================================================== */


/* ==========================================================================
   CONFIGURACIÓN DEL CLIMA (puedes editar estos valores)
   ========================================================================== */

/* Coordenadas de Chiclayo */
const CLIMA_LATITUD = -6.7714;
const CLIMA_LONGITUD = -79.8409;

/* Cada cuánto se actualiza, en milisegundos (600000 = 10 minutos) */
const CLIMA_ACTUALIZAR_MS = 600000;

const CLIMA_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=" + CLIMA_LATITUD +
  "&longitude=" + CLIMA_LONGITUD +
  "&current=temperature_2m,weather_code,is_day" +
  "&timezone=America%2FLima";


/* ==========================================================================
   LÓGICA DEL CLIMA
   ========================================================================== */
const cajaClima = document.querySelector(".clima");
const textoTemperatura = document.querySelector(".clima-temperatura");

/* Convierte el código de clima de Open-Meteo en un estado (icono) y una descripción */
function interpretarClima(codigo, esDia) {
  if (codigo === 0 || codigo === 1) {
    return esDia
      ? { estado: "sol", texto: "despejado" }
      : { estado: "luna", texto: "noche despejada" };
  }
  if (codigo === 2) {
    return { estado: "parcial", texto: "parcialmente nublado" };
  }
  if (codigo === 45 || codigo === 48) {
    return { estado: "niebla", texto: "con neblina" };
  }
  if ((codigo >= 51 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) {
    return { estado: "lluvia", texto: "con lluvia" };
  }
  if (codigo >= 95) {
    return { estado: "tormenta", texto: "con tormenta" };
  }
  return { estado: "nublado", texto: "nublado" };
}

/* Define el color del borde según la temperatura */
function nivelDeTemperatura(grados) {
  if (grados < 20) {
    return "fresco";
  }
  if (grados >= 27) {
    return "calido";
  }
  return "templado";
}

/* Consulta el clima y actualiza la cajita. Si falla, deja "--°" sin romper la página */
async function actualizarClima() {
  if (!cajaClima || !textoTemperatura) {
    return;
  }

  try {
    const respuesta = await fetch(CLIMA_URL, { cache: "no-store" });
    if (!respuesta.ok) {
      throw new Error("Respuesta no válida");
    }

    const datos = await respuesta.json();
    const actual = datos.current;
    const grados = Math.round(actual.temperature_2m);
    const clima = interpretarClima(actual.weather_code, actual.is_day === 1);

    textoTemperatura.textContent = grados + "°";
    cajaClima.dataset.estado = clima.estado;
    cajaClima.dataset.nivel = nivelDeTemperatura(grados);
    cajaClima.setAttribute("aria-label", "Chiclayo: " + grados + " grados, " + clima.texto);
  } catch (error) {
    textoTemperatura.textContent = "--°";
    cajaClima.dataset.estado = "sinDatos";
    cajaClima.setAttribute("aria-label", "Clima de Chiclayo no disponible");
  }
}

/* Primera consulta al abrir y luego cada CLIMA_ACTUALIZAR_MS */
actualizarClima();
setInterval(actualizarClima, CLIMA_ACTUALIZAR_MS);

/* Al volver a la pestaña o app después de un rato, se actualiza de inmediato */
document.addEventListener("visibilitychange", function () {
  if (!document.hidden) {
    actualizarClima();
  }
});
