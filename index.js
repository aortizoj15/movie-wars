const movieDataFetch = async (searchTerm) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "763ec5e7",
      s: searchTerm
    }
  });
  if (response.data.Error) {
    return [];
  }
  return response.data.Search;
};

const autocompleteComponent = document.querySelector('.autocomplete');
autocompleteComponent.innerHTML = `
  <label><b>Search for Movie</b></label>
  <input class="input" name="search" placeholder="Ex. Avengers" type="text" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

const searchInput = document.querySelector('input');
const dropdown = document.querySelector('.dropdown');
const leftContainer = document.querySelector('.container');
const resultsContainer = document.querySelector('.results');
const summaryContainer = document.querySelector("#summary");



const onInput = async e => {
  const movieArr = await movieDataFetch(e.target.value);
  if (!movieArr.length) {
    dropdown.classList.remove('is-active');
    return;
  }
  resultsContainer.innerHTML = '';
  dropdown.classList.add('is-active');
  for (const movie of movieArr) {
    const movieItem = document.createElement('a');
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster
    movieItem.classList.add('dropdown-item');
    movieItem.innerHTML = `
      <img src="${imgSrc}"/>
      ${movie.Title}
    `;
    movieItem.addEventListener('click', async e => {
      dropdown.classList.remove('is-active');
      searchInput.value = movie.Title;
      fetchMovie(movie);
    });
    resultsContainer.appendChild(movieItem);
  }
};
searchInput.addEventListener('input', debounce(onInput, 500));
document.addEventListener('click', e => {
  if (!autocompleteComponent.contains(e.target)) {
    dropdown.classList.remove('is-active');
  }
})

const fetchMovie = async (movie) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "763ec5e7",
      i: movie.imdbID
    }
  });
  summaryContainer.innerHTML = movieTemplate(response.data)
}

const movieTemplate = (movieDetail) => {
  console.log(movieDetail);
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}" alt="movieDetail.Title" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
    <p class="title">${movieDetail.Year}</p>
    <p class="subtitle">Year</p>
    </article>
    <article class="notification is-primary">
    <p class="title">${movieDetail.Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}