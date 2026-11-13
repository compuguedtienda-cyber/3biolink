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
    tarjeta.setAttribute("aria-pressed", mostrarReverso);
    caraTrasera.setAttribute("aria-hidden", !mostrarReverso);

    if (mostrarReverso) {
      /* Reinicia la animación de la barra de tiempo */
      barraTiempo.style.animation = "none";
      void barraTiempo.offsetWidth;
      barraTiempo.style.animation = "";

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
