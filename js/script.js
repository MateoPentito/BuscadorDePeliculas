
const apiKey = 'e9fbb2c4';
const boton_buscar = document.getElementById("boton-buscar");
const input_pelicula = document.getElementById("input-pelicula");
const resultado = document.getElementById("resultado");
const boton_categoria = document.querySelectorAll(".categorias button");



boton_buscar.addEventListener('click', () => {
    const query = input_pelicula.value;
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error("Error en la API:", error));
});


async function buscarPeliculas() {
    const query = input_pelicula.value.trim();
    if (!query) {
        return alert("Ingresa una pelicula");
    }
    const cargarDiv = document.createElement("div");
    cargarDiv.textContent = "Cargando..."
    resultado.appendChild(cargarDiv);

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=e9fbb2c4`);
        const data = await response.json();

        resultado.removeChild(cargarDiv);

        if (data.Response == "True") {
            const pelicula = data.Search[0];
            const detalleResponse = await fetch(`https://www.omdbapi.com/?i=${pelicula.imdbID}&apikey=e9fbb2c4`);
            const detalle = await detalleResponse.json();

            const peliculaDiv = document.createElement("div");
            peliculaDiv.classList.add("pelicula");

            peliculaDiv.innerHTML = `
                <h3>${detalle.Title}</h3>
                <p>Año: ${detalle.Year}</p>
                <p>Genero: ${detalle.Genre}</p>
                <img src="${detalle.Poster !== "N/A" ? detalle.Poster : "https://via.placeholder.com/150"}" alt="${detalle.Title}" />
                <p><strong>Sinopsis:</strong> ${detalle.Plot}</p>
                `;
            resultado.appendChild(peliculaDiv);

        } else {
            resultado.innerHTML = `<p>No se encontraron resultados para "${query}"</p>`;
        }
    } catch (error) {
        resultado.innerHTML = "<p>Error al buscar películas. Intenta de nuevo.</p>";
        console.error(error);
    }
    input_pelicula.value = "";
}


boton_buscar.addEventListener("click", buscarPeliculas);
input_pelicula.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        buscarPeliculas();
    }
})



//Categoria

boton_categoria.forEach(boton => {
    boton.addEventListener("click", () => {
        const genero = boton.dataset.genero;
        buscarPeliculasPorGenero(genero);
    })
})

async function buscarPeliculasPorGenero(genero) {
    const cargarDiv = document.createElement("p");
    cargarDiv.textContent = "Buscando peliculas...";
    resultado.appendChild(cargarDiv);

    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${genero}&apikey=e9fbb2c4`);
        const data = await response.json();

        resultado.removeChild(cargarDiv);

        if (data.Response === "True") {
            for (const pelicula of data.Search) {
                const detalleResponse = await fetch(`https://www.omdbapi.com/?i=${pelicula.imdbID}&apikey=e9fbb2c4`);
                const detalle = await detalleResponse.json();

                if (detalle.Genre.includes(genero)) {
                    const peliculaDiv = document.createElement("div");
                    peliculaDiv.classList.add("pelicula");

                    peliculaDiv.innerHTML = `
                        <h3>${detalle.Title}</h3>
                        <p>Año: ${detalle.Year}</p>
                        <p>Genero: ${detalle.Genre}</p>
                        <p>${detalle.Plot}</p>
                        <img src="${detalle.Poster !== "N/A" ? detalle.Poster : "https://via.placeholder.com/150"}">
                    `;
                    resultado.appendChild(peliculaDiv);
                } else {
                    const error = document.createElement("p");
                    error.textContent = "No se encontraron peliculas."
                    resultado.appendChild(error);
                }

            }
        }
    } catch (error) {
        console.error(error);
    }
}
