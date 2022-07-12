const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
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

L.marker([28.6138954, 77.2090057]).addTo(map).bindPopup("Hii!").openPopup();

searchBtn.onclick = GetLocation;

async function GetLocation() {
  const place = encodeURIComponent(searchInput.value);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${place}`;
  const res = await fetch(url);
  try {
    if (res.ok) {
      const locations = [];
      const data = await res.json();
      if (data.length === 0) {
        throw Error("No location found");
      }
      data.forEach((p) => {
        const loc = {
          name: p.display_name,
          lat: p.lat,
          lon: p.lon,
        };
        locations.push(loc);
      });
      console.log(locations);
    }
  } catch (e) {
    console.log(e);
  }
}
