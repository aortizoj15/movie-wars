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
    const response = await axios.get("https://www.omdbapi.com/", {
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
  const leftSummaryValues = document.querySelectorAll('#left-summary .notification');
  const rightSummaryValues = document.querySelectorAll('#right-summary .notification');

  leftSummaryValues.forEach((val, idx) => {
    const rightValueElement = rightSummaryValues[idx];
    const currentLeftValue = parseInt(val.dataset.value);
    const currentRightValue = parseInt(rightValueElement.dataset.value);
    if (currentLeftValue > currentRightValue) {
      val.classList.remove('is-dark');
      val.classList.add('is-primary');
    }
    else {
      rightValueElement.classList.remove('is-dark');
      rightValueElement.classList.add('is-primary');
    }
  });
}

const movieTemplate = ({BoxOffice, Title, Genre, Plot, Poster, Awards, Year, Metascore, imdbVotes, imdbRating}) => {
  const boxOfficeToNum = parseInt(BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  const metascoreToNum = parseInt(Metascore);
  const imdbRatingToNum = parseFloat(imdbRating);
  const imdbVotesToNum = parseInt(imdbVotes.replace(/,/g, ''));
  const awardWordArr = Awards.split(' ');
  const awardCount = awardWordArr.reduce((acc, val) => {
    const validValue = parseInt(val);
    if (isNaN(validValue)) {
      return acc;
    }
    return acc + validValue;
  }, 0);
  console.log(awardCount);

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
    <article data-value=${awardCount} class="notification is-dark">
      <p class="title">${Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
    <article data-value=${boxOfficeToNum} class="notification is-dark">
      <p class="title">${BoxOffice}</p>
      <p class="subtitle">BoxOffice</p>
    </article>
    <article data-value=${metascoreToNum} class="notification is-dark">
      <p class="title">${Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
    <article data-value=${imdbRatingToNum} class="notification is-dark">
      <p class="title">${imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotesToNum} class="notification is-dark">
      <p class="title">${imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
    <article data-value=${Year} class="notification is-dark">
      <p class="title">${Year}</p>
      <p class="subtitle">Release Year</p>
    </article>
    `;
}
