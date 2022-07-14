const loading = document.querySelector(".loading");
const errorEl = document.querySelector(".error");
const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const searchResults = document.querySelector(".search-results");
const map = L.map("map").setView([28.6138954, 77.2090057], 4);

const Stamen_Toner = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    minZoom: 2,
    maxZoom: 20,
    ext: "png",
  }
);

Stamen_Toner.addTo(map);

searchBtn.onclick = (e) => {
  e.preventDefault();
  GetLocation();
};

async function GetLocation() {
  errorEl.style.display = "";
  searchResults.innerHTML = "";
  loading.style.display = "block";
  const place = encodeURIComponent(searchInput.value);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
  const res = await fetch(url);
  try {
    if (res.ok) {
      loading.style.display = "";
      const data = await res.json();
      if (data.length === 0) {
        throw Error("No location found");
      }
      data.forEach((p) => {
        createSearchResult(p.display_name, p.lat, p.lon);
      });
    }
  } catch (err) {
    errorEl.style.display = "block";
    errorEl.textContent = err.message;
  }
}

function createSearchResult(display_name, lat, lon) {
  const el = document.createElement("p");
  el.setAttribute("data-lat", lat);
  el.setAttribute("data-lon", lon);
  el.textContent = display_name;
  searchResults.appendChild(el);
}

searchResults.addEventListener("click", (e) => {
  const el = e.target;
  const popup_name = el.textContent.split(",")[0];
  const lat = el.getAttribute("data-lat");
  const lon = el.getAttribute("data-lon");
  L.marker([lat, lon]).addTo(map).bindPopup(popup_name).openPopup();
});
