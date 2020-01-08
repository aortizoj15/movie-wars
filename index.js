const inputWidgetConfig = {
  makeItem: movie => {
    const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
      <img src="${imgSrc}"/>
      ${movie.Title} (${movie.Year})
    `;
  },
  inputWidgetValue: movie => {
    return movie.Title;
  },
  fetchData: async searchTerm => {
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
  }
};
makeInputWidget({
  ...inputWidgetConfig,
  rootElement: document.querySelector("#left-input-widget"),
  onItemSelect: movie => {
    const tutorial = document.querySelector(".tutorial");
    const leftSummary = document.querySelector('#left-summary');
    tutorial.classList.add("is-hidden");
    fetchMovie(movie, leftSummary, 'left');
  }
});
makeInputWidget({
  ...inputWidgetConfig,
  rootElement: document.querySelector("#right-input-widget"),
  onItemSelect: movie => {
    const tutorial = document.querySelector(".tutorial");
    const rightSummary = document.querySelector('#right-summary');
    tutorial.classList.add("is-hidden");
    fetchMovie(movie, rightSummary, 'right');
  }
});

let leftDetails;
let rightDetails;
const fetchMovie = async (movie, summaryContainer, sideIdentifier) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      apikey: "763ec5e7",
      i: movie.imdbID
    }
  });
  summaryContainer.innerHTML = movieTemplate(response.data)
  if (sideIdentifier === 'left') {
    leftDetails = response.data;
  }
  else {
    rightDetails = response.data;
  }
  if (leftMovieDetails && rightMovieDetails) {
    compareMovies();
  }
}

const movieTemplate = (movieDetail) => {
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