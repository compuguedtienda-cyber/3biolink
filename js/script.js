/* ====== CONFIGURACIÓN ====== */
var TIEMPO_VISIBLE = 10000; /* milisegundos que la tarjeta se queda girada (10 s) */
/* =========================== */

document.querySelectorAll(".tarjeta").forEach(function (tarjeta) {
  var temporizador = null;
  var caraTrasera = tarjeta.querySelector(".cara-trasera");

  /* Gira la tarjeta: true = muestra el reverso, false = vuelve al frente */
  function girar(activar) {
    clearTimeout(temporizador);
    tarjeta.classList.toggle("activa", activar);
    tarjeta.classList.add("vista"); /* detiene el parpadeo del icono de girar */
    tarjeta.setAttribute("aria-pressed", activar);
    caraTrasera.setAttribute("aria-hidden", !activar);

    if (activar) {
      /* Reinicia la animación de la barra inferior */
      var barra = tarjeta.querySelector(".tarjeta__barra");
      barra.style.animation = "none";
      void barra.offsetWidth;
      barra.style.animation = "";

      /* Vuelve al frente automáticamente */
      temporizador = setTimeout(function () {
        girar(false);
      }, TIEMPO_VISIBLE);
    }
  }

  /* Clic o toque */
  tarjeta.addEventListener("click", function () {
    girar(!tarjeta.classList.contains("activa"));
  });

  /* Teclado (Enter o Espacio) */
  tarjeta.addEventListener("keydown", function (e) {
    if (e.target !== tarjeta) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      girar(!tarjeta.classList.contains("activa"));
    }
  });
});
