const EPISODES_URL = "https://api.tvmaze.com/shows/82/episodes";
let allEpisodes = [];
let hasFetchedEpisodes = false;

async function setup() {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  const status = document.createElement("p");
  status.id = "status";
  status.textContent = "Loading episodes, please wait...";
  rootElem.appendChild(status);

  const controls = createControls();
  controls.hidden = true;
  rootElem.appendChild(controls);

  const container = createEpisodesContainer();
  rootElem.appendChild(container);

  const footer = document.createElement("footer");
  footer.innerHTML =
    'Data originally provided by <a href="https://www.tvmaze.com/" target="_blank" rel="noopener">TVMaze.com</a>';
  rootElem.appendChild(footer);

  try {
    allEpisodes = await fetchEpisodesOnce();
    status.textContent = "";
    controls.hidden = false;
    renderEpisodes(allEpisodes);
    populateSelector(allEpisodes);
  } catch (error) {
    status.textContent =
      "Something went wrong loading episodes. Please try refreshing the page.";
    console.error(error);
  }
}

async function fetchEpisodesOnce() {
  if (hasFetchedEpisodes) {
    return allEpisodes;
  }
  const response = await fetch(EPISODES_URL);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = await response.json();
  hasFetchedEpisodes = true;
  return data;
}

function createControls() {
  const controls = document.createElement("div");
  controls.id = "controls";

  const searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = "search-input";
  searchInput.placeholder = "Search episodes by name or summary...";
  searchInput.addEventListener("input", handleSearch);

  const matchCount = document.createElement("p");
  matchCount.id = "match-count";

  const selector = document.createElement("select");
  selector.id = "episode-selector";
  selector.addEventListener("change", handleSelect);

  controls.appendChild(searchInput);
  controls.appendChild(matchCount);
  controls.appendChild(selector);

  return controls;
}

function createEpisodesContainer() {
  const container = document.createElement("div");
  container.id = "episodes-container";
  return container;
}

function handleSearch(event) {
  const term = event.target.value.trim().toLowerCase();
  const filtered = allEpisodes.filter((episode) => {
    const name = episode.name.toLowerCase();
    const summary = (episode.summary || "").toLowerCase();
    return name.includes(term) || summary.includes(term);
  });
  renderEpisodes(term === "" ? allEpisodes : filtered);
}

function handleSelect(event) {
  const id = event.target.value;
  if (!id) return;
  const target = document.getElementById(`episode-${id}`);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderEpisodes(episodeList) {
  const container = document.getElementById("episodes-container");
  container.innerHTML = "";

  const matchCount = document.getElementById("match-count");
  matchCount.textContent = `${episodeList.length} episode(s) found`;

  episodeList.forEach((episode) => {
    container.appendChild(createEpisodeCard(episode));
  });
}

function populateSelector(episodeList) {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = '<option value="">Jump to episode...</option>';

  episodeList.forEach((episode) => {
    const option = document.createElement("option");
    option.value = episode.id;
    option.textContent = `${formatEpisodeCode(episode)} - ${episode.name}`;
    selector.appendChild(option);
  });
}

function createEpisodeCard(episode) {
  const card = document.createElement("div");
  card.className = "episode-card";
  card.id = `episode-${episode.id}`;

  const title = document.createElement("h2");
  title.textContent = `${episode.name} - ${formatEpisodeCode(episode)}`;
  card.appendChild(title);

  if (episode.image && episode.image.medium) {
    const img = document.createElement("img");
    img.src = episode.image.medium;
    img.alt = episode.name;
    card.appendChild(img);
  }

  const summary = document.createElement("div");
  summary.innerHTML = episode.summary || "";
  card.appendChild(summary);

  return card;
}

function formatEpisodeCode(episode) {
  const season = String(episode.season).padStart(2, "0");
  const number = String(episode.number).padStart(2, "0");
  return `S${season}E${number}`;
}

window.onload = setup;