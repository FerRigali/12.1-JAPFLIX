let movies = [];

document.addEventListener("DOMContentLoaded", function () {
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(response => response.json())
        .then(data => {
            movies = data;
            console.log(movies);
        })
        .catch(error => console.error("Error al obtener datos", error));
});

const btnBuscar = document.getElementById("btnBuscar");
const inputBuscar = document.getElementById("inputBuscar");
const lista = document.getElementById("lista");

btnBuscar.addEventListener("click", function () {
    const query = inputBuscar.value.toLowerCase();
    lista.innerHTML = ""; // Limpiar la lista antes de mostrar resultados

    const filteredMovies = movies.filter(movie => {
        console.log("Géneros:", movie.genres); // Verifica qué géneros tiene la película
        return movie.title.toLowerCase().includes(query) ||
               movie.genres.some(genre => {
                   console.log("Género actual:", genre); // Verifica cada género
                   return typeof genre === 'string' && genre.toLowerCase().includes(query);
               }) ||
               movie.tagline.toLowerCase().includes(query) ||
               movie.overview.toLowerCase().includes(query);
    });
    

        filteredMovies.forEach(movie => {
            const li = document.createElement("li");
            li.classList.add("list-group-item");

            // Calculamos el número de estrellas basado en el vote_average (escala de 5)
            const starRating = Math.round(movie.vote_average / 2);

            // Creamos la estructura HTML de las estrellas
            const starsHtml = `
                <div class="star-rating">
                    <input type="radio" name="star${movie.id}" id="star5-${movie.id}" ${starRating === 5 ? 'checked' : ''}/>
                    <label for="star5-${movie.id}"></label>
                    <input type="radio" name="star${movie.id}" id="star4-${movie.id}" ${starRating === 4 ? 'checked' : ''}/>
                    <label for="star4-${movie.id}"></label>
                    <input type="radio" name="star${movie.id}" id="star3-${movie.id}" ${starRating === 3 ? 'checked' : ''}/>
                    <label for="star3-${movie.id}"></label>
                    <input type="radio" name="star${movie.id}" id="star2-${movie.id}" ${starRating === 2 ? 'checked' : ''}/>
                    <label for="star2-${movie.id}"></label>
                    <input type="radio" name="star${movie.id}" id="star1-${movie.id}" ${starRating === 1 ? 'checked' : ''}/>
                    <label for="star1-${movie.id}"></label>
                </div>
            `;

            li.innerHTML = `
                <h5>${movie.title}</h5>
                <p>${movie.tagline}</p>
                ${starsHtml}  <!-- Aquí insertamos las estrellas -->
            `;

            li.addEventListener('click', () => {
                // Actualiza los elementos del Offcanvas
                document.getElementById('offcanvasMovieLabel').innerText = movie.title;
                document.getElementById('movieOverview').innerText = movie.overview;
                document.getElementById('movieGenres').innerText = movie.genres.map(genre => genre.name).join(', ');
            
                // Actualizar detalles
                document.getElementById('releaseYear').innerText = new Date(movie.release_date).getFullYear(); // Obtener solo el año
                document.getElementById('duration').innerText = movie.runtime; // Duración en minutos
                document.getElementById('budget').innerText = movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'; // Presupuesto
                document.getElementById('revenue').innerText = movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'; // Ganancias
            
                // Mostrar el Offcanvas
                const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasMovie'));
                offcanvas.show();
            
                // Agregar el evento al botón para mostrar/ocultar detalles
                const btnDetalles = document.getElementById('btnDetalles');
                const infoDetalles = document.getElementById('infoDetalles');
            
                btnDetalles.addEventListener('click', () => {
                    // Cambiar el estilo de display para mostrar u ocultar los detalles
                    if (infoDetalles.style.display === "none") {
                        infoDetalles.style.display = "block";
                        btnDetalles.innerText = "Ocultar detalles"; // Cambiar el texto del botón
                    } else {
                        infoDetalles.style.display = "none";
                        btnDetalles.innerText = "Ver más detalles"; // Cambiar el texto del botón
                    }
                });
            });
                 

            lista.appendChild(li);
        });
    }
);
