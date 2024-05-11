const searchInput = document.querySelector("#search");
const container = document.querySelector(".container");
const body = document.querySelector(".main");
const loader = document.querySelector(".loader");
const formContainer = document.querySelector(".form-container");
const title = document.querySelector(".title");

// Los paises descargados desde la api se guardan en el array de countries
// La api deberia pedirse solo una vez
// Usar este array para crear el filtrado
let countries = [];

// Funcion que pide todos los paises
const getCountries = async () => {
  // Llamo a la API Rest Countries
  countries = await (await fetch(`https://restcountries.com/v3.1/all`)).json();
  // Transformo la respuesta a JSON

  // Guardo el array de los paises recibido dentro de contries
};

getCountries();

searchInput.addEventListener("keyup", async (e) => {
  e.preventDefault();
  if (e.key === "Backspace") {
    await getCountries();
  }
  const mensaje = document.createElement("p");
  if (e.key === "Backspace" && e.target.value === "") {
    mensaje.classList.add("esconder");
    mensaje.classList.remove("mensaje");
  }
  container.classList.add("container-listo");
  await (countries = countries.filter((pais) => {
    if (
      pais.translations.spa.common
        .toLowerCase()
        .startsWith(e.target.value.toLowerCase())
    ) {
      return pais;
    }
  }));

  if (countries.length >= 10) {
    container.classList.remove("esconder");
    container.innerHTML = "";
    mensaje.classList.add("mensaje");
    mensaje.innerHTML = `
    Demasiados paises, realiza una busqueda mas especifica
    `;
    container.append(mensaje);
  } else if (countries.length < 10 && countries.length > 1) {
    container.classList.remove("container-uno");
    container.classList.add("container-listo");
    container.innerHTML = "";
    countries.forEach((pais) => {
      const section = document.createElement("section");
      section.classList.add("container-pais");
      section.innerHTML = `
            <div class="bandera-container">
              <img src="${pais.flags.png}" alt="">
            </div>
            <div class="name-container">
              <p>${pais.translations.spa.common}</p>
            </div>
          `;
      container.append(section);
    });
  } else if (countries.length === 1) {
    const clima = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${countries[0].latlng[0]}&lon=${countries[0].latlng[1]}&appid=75b38b5e527a061fec93b80aa2ca204a&units=metric`
      )
    ).json();
    container.classList.remove("container-listo");
    container.classList.add("container-uno");
    countries.forEach((pais) => {
      container.innerHTML = `
      <div class="container-un-pais">
      <img src="${pais.flags.png}" alt="">
      <div class="container-lado-bandera">
        <div class="clima">
          <span>
            <img src="https://openweathermap.org/img/wn/${clima.weather[0].icon}@2x.png">             
          </span>
          <p>${clima.weather[0].main}</p>
        </div>
        <div class="temperatura">
          <p>${clima.main.temp} °C</p>
        </div>
      </div>
      <div class="container-lado-datos">
        <h2>${pais.translations.spa.common}</h2>
        <p>Capital: ${pais.capital[0]}</p>
        <p>${pais.population} de habitantes</p>
        <p>Region: ${pais.region}</p>
        <p>Continente: ${pais.continents[0]}</p>
        <p>${pais.timezones[0]}</p>
      </div>
    </div>
        `;
    });
  }
});
