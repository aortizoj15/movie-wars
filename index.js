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
  if (leftDetails && rightDetails) {
    compareMovies();
  }
}

const compareMovies = () => {

}

const movieTemplate = ({BoxOffice, Title, Genre, Plot, Poster, Awards, Year, Metascore, imdbVotes, imdbRating}) => {
  if (BoxOffice && Metascore && imdbRating) {
    const dollarToNum = parseInt(BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascoreToNum = parseInt(Metascore);
    const imdbRatingToNum = parseFloat(imdbRating);
    const imdbVotesToNum = parseInt(imdbVotes.replace(/,/g, ''));
    let count = 0;
    const wordArr = Awards.split(' ');
    wordArr.reduce((acc, val) => {
      const validValue = parseInt(val);
      if (isNaN(validValue)) {
        return acc;
      }
      count = count + validValue;
      return count;
    });
  }
  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${Poster}" alt="movieDetail.Title" />
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${Title}</h1>
          <h4>${Genre}</h4>
          <p>${Plot}</p>
        </div>
      </div>
    </article>
    <article class="notification is-dark">
      <p class="title">${Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-dark">
    <p class="title">${Year} Released</p>
    <p class="subtitle">Year</p>
    </article>
    <article class="notification is-dark">
    <p class="title">${BoxOffice}</p>
    <p class="subtitle">BoxOffice</p>
    </article>
    <article class="notification is-dark">
    <p class="title">${Metascore}</p>
    <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-dark">
      <p class="title">${imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-dark">
      <p class="title">${imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `;
}