//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function episodeCode(episode) {
  const s = String(episode.season).padStart(2, "0");
  const e = String(episode.number).padStart(2, "0");
  return `S${s}E${e}`;
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("article");
    card.innerHTML = `
      <h2><a href="${episode.url}">${episodeCode(episode)} - ${episode.name}</a></h2>
      <img src="${episode.image.medium}" alt="${episode.name}">
      <p>${episode.summary}</p>
    `;
    rootElem.appendChild(card);
  });

  const credit = document.createElement("p");
  credit.innerHTML = `Data from <a href="https://www.tvmaze.com">TVMaze.com</a>`;
  rootElem.appendChild(credit);
}

window.onload = setup;