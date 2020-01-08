const makeInputWidget = ({rootElement, makeItem, onItemSelect, inputWidgetValue, fetchData}) => {
  rootElement.innerHTML = `
  <label><b>Search</b></label>
  <input class="input" name="search" placeholder="Ex. Avengers" type="text" />
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results"></div>
    </div>
  </div>
`;

  const searchInput = rootElement.querySelector("input");
  const dropdown = rootElement.querySelector(".dropdown");
  const resultsContainer = rootElement.querySelector(".results");

  const onInput = async e => {
    const itemArr = await fetchData(e.target.value);
    if (!itemArr.length) {
      dropdown.classList.remove("is-active");
      return;
    }
    resultsContainer.innerHTML = "";
    dropdown.classList.add("is-active");
    for (const item of itemArr) {
      const itemContainer = document.createElement("a");
      itemContainer.classList.add("dropdown-item");
      itemContainer.innerHTML = makeItem(item);
      itemContainer.addEventListener("click", async e => {
        dropdown.classList.remove("is-active");
        searchInput.value = inputWidgetValue(item);
        onItemSelect(item);
      });
      resultsContainer.appendChild(itemContainer);
    }
  };
  searchInput.addEventListener("input", debounce(onInput, 500));
  document.addEventListener("click", e => {
    if (!rootElement.contains(e.target)) {
      dropdown.classList.remove("is-active");
    }
  });
}