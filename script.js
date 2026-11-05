/* ====== CONFIGURA AQUÍ ====== */
var WHATSAPP = "51926845127"; /* tu número con código de país, sin + ni espacios */
/* ============================ */
var HOLD = 10000; /* 10 segundos */

document.querySelectorAll("[data-msg]").forEach(function(a){
  a.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(a.getAttribute("data-msg"));
  a.target = "_blank"; a.rel = "noopener";
});

document.querySelectorAll(".card").forEach(function(card){
  var timer = null, back = card.querySelector(".back");
  function set(on){
    clearTimeout(timer);
    card.classList.toggle("on", on);
    card.classList.add("seen");
    card.setAttribute("aria-pressed", on);
    back.setAttribute("aria-hidden", !on);
    if(on){
      var bar = card.querySelector(".bar");
      bar.style.animation = "none"; void bar.offsetWidth; bar.style.animation = "";
      timer = setTimeout(function(){ set(false); }, HOLD);
    }
  }
  card.addEventListener("click", function(e){
    if(e.target.closest("a")) return;
    set(!card.classList.contains("on"));
  });
  card.addEventListener("keydown", function(e){
    if(e.target !== card) return;
    if(e.key === "Enter" || e.key === " "){ e.preventDefault(); set(!card.classList.contains("on")); }
  });
});
