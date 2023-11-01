const apiKey = "9acdd6dd850cb566f5122c120457cb71";
const searchInput = document.getElementById("search-input");
const movieList = document.getElementById("movie-list");
const watchOptionsPopup = document.getElementById("watch-options-popup");
const watchOptionsContent = document.getElementById("watch-options-content");
const watchOptionsList = document.getElementById("watch-options-list");
const closeWatchOptions = document.getElementById("close-watch-options");
const detailsPopup = document.getElementById("details-popup");
const detailsContent = document.getElementById("details-content");
const closeDetails = document.getElementById("close-details");
let debounceTimer;

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(searchMovies, 500);
});

async function searchMovies() {
  const searchTerm = searchInput.value.trim();

  if (searchTerm === "") {
    resetResults();
    return;
  }

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.results) {
    displayMovies(data.results);
  } else {
    resetResults();
  }
}

function displayMovies(movies) {
  movieList.innerHTML = "";

  movies.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    movieList.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
  const movieCard = document.createElement("div");
  movieCard.classList.add("movie-card");

  const posterImg = document.createElement("img");
  posterImg.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
  posterImg.classList.add("movie-poster");

  const moreDetailsButton = document.createElement("button");
  moreDetailsButton.textContent = "More Details";
  moreDetailsButton.classList.add("more-details-button");
  moreDetailsButton.addEventListener("click", () => {
    showDetails(movie);
  });

  const watchOptionsButton = document.createElement("button");
  watchOptionsButton.textContent = "Watch Options";
  watchOptionsButton.classList.add("watch-options-button");
  watchOptionsButton.addEventListener("click", () => {
    showWatchOptions(movie.id);
  });

  movieCard.appendChild(posterImg);
  movieCard.appendChild(moreDetailsButton);
  movieCard.appendChild(watchOptionsButton);

  return movieCard;
}

function resetResults() {
  movieList.innerHTML = "";
}

function showDetails(movie) {
  document.getElementById("overview").textContent = movie.overview;
  document.getElementById("popularity").textContent = movie.popularity;
  document.getElementById("vote-average").textContent = movie.vote_average;

  detailsPopup.style.display = "block";
}

closeDetails.addEventListener("click", () => {
  detailsPopup.style.display = "none";
});

closeWatchOptions.addEventListener("click", () => {
  watchOptionsPopup.style.display = "none";
});

function showWatchOptions(movieId) {
  const watchOptionsUrl = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${apiKey}`;
  fetch(watchOptionsUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.results.IN) {
        displayWatchOptions(data.results.IN);
      } else {
        alert("Watch options not available for this country.");
      }
    });
}

function displayWatchOptions(options) {
  watchOptionsList.innerHTML = "";

  for (const optionType in options) {
    if (Array.isArray(options[optionType])) {
      options[optionType].forEach((option) => {
        const optionElement = document.createElement("div");
        optionElement.classList.add("watch-option");
        optionElement.innerHTML = `
                            <img src="https://image.tmdb.org/t/p/w200${option.logo_path}" alt="${option.provider_name}" />
                            <span>${option.provider_name}</span>
                        `;
        watchOptionsList.appendChild(optionElement);
      });
    }
  }

  watchOptionsPopup.style.display = "block";
}
