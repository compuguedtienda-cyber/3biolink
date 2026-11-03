/* ===== SLIDER (loop infinito) ===== */
const track = document.querySelector('.slider-track');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

let slides = Array.from(track.children);
let index = 1;
let slideWidth;

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
firstClone.id = 'first-clone';
lastClone.id = 'last-clone';

track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);
slides = Array.from(track.children);

function setPosition() {
  slideWidth = slides[0].clientWidth;
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

function goTo(newIndex) {
  if (newIndex < 0 || newIndex > slides.length - 1) return;
  index = newIndex;
  track.style.transition = 'transform 0.4s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}

window.addEventListener('load', setPosition);
window.addEventListener('resize', setPosition);

next.addEventListener('click', () => goTo(index + 1));
prev.addEventListener('click', () => goTo(index - 1));

/* Salto invisible al llegar a un clon */
track.addEventListener('transitionend', () => {
  const id = slides[index].id;
  if (id === 'first-clone') index = 1;
  else if (id === 'last-clone') index = slides.length - 2;
  else return;

  track.style.transition = 'none';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
});

/* ===== COMPARTIR ===== */
function copyLink() {
  navigator.clipboard.writeText(location.href)
    .then(() => alert('Enlace copiado'));
}

async function sharePage() {
  const data = { title: 'COMPUGUED', text: 'Catálogo Tecnológico', url: location.href };

  if (navigator.share && window.isSecureContext) {
    try {
      await navigator.share(data);
    } catch (err) {
      if (err.name !== 'AbortError') copyLink(); // si solo canceló, no copiar
    }
  } else {
    copyLink();
  }
}

document.getElementById('btn-share').addEventListener('click', (e) => {
  e.preventDefault();
  sharePage();
});

/* ===== CLIMA ===== */
const tempEl = document.querySelector('.temp');
const iconEl = document.querySelector('.weather-icon');
const WEATHER_API =
  'https://api.open-meteo.com/v1/forecast?latitude=-6.7714&longitude=-79.8409&current_weather=true';

function getWeatherIcon(t) {
  if (t >= 26) return 'img/clima/calor2.png';
  if (t < 21)  return 'img/clima/frio.png';
  return 'img/clima/normal.png'; // 21 a 25
}

function updateWeather() {
  fetch(WEATHER_API)
    .then(r => r.json())
    .then(d => {
      const t = Math.round(d.current_weather.temperature) + 1; // ajuste fijo de +1
      tempEl.textContent = `${t} °C`;
      iconEl.src = getWeatherIcon(t);
    })
    .catch(() => {
      tempEl.textContent = '-- °C';
    });
}

updateWeather();
setInterval(updateWeather, 600000); // cada 10 minutos
