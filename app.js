const searchInput = document.getElementById("searchInput");
const topicFilter = document.getElementById("topicFilter");
const cardGrid = document.getElementById("cardGrid");
const template = document.getElementById("simCardTemplate");
const countLabel = document.getElementById("countLabel");

let simulations = [];
let publishedRepos = null;

function uniqueTopics(items) {
  return [...new Set(items.map((item) => item.topic))].sort();
}

function hydrateTopics() {
  topicFilter.textContent = "";

  const all = document.createElement("option");
  all.value = "all";
  all.textContent = "All topics";
  topicFilter.append(all);

  for (const topic of uniqueTopics(simulations)) {
    const option = document.createElement("option");
    option.value = topic;
    option.textContent = topic;
    topicFilter.append(option);
  }
}

function filterSims() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedTopic = topicFilter.value;

  return simulations.filter((sim) => {
    const matchesTopic = selectedTopic === "all" || sim.topic === selectedTopic;
    const haystack = `${sim.title} ${sim.topic} ${sim.description} ${sim.repo}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query);
    return matchesTopic && matchesQuery;
  });
}

function renderCards() {
  const filtered = filterSims();
  cardGrid.textContent = "";

  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No simulations match your search.";
    cardGrid.append(empty);
    countLabel.textContent = "0 simulations";
    return;
  }

  filtered.forEach((sim, index) => {
    const node = template.content.firstElementChild.cloneNode(true);

    node.querySelector(".topic").textContent = sim.topic;
    node.querySelector("h3").textContent = sim.title;
    node.querySelector(".description").textContent = sim.description;
    node.querySelector(".repo").textContent = sim.repo;

    const link = node.querySelector(".launch");
    const hosted = window.location.protocol.startsWith("http");

    if (hosted) {
      if (sim.webUrl) {
        link.href = sim.webUrl;
        link.textContent = "Launch";
      } else if (sim.repoUrl) {
        link.href = sim.repoUrl;
        link.textContent = "Open Repo";
      } else {
        link.removeAttribute("href");
        link.textContent = "Local Only";
        link.setAttribute("aria-disabled", "true");
        link.style.pointerEvents = "none";
        link.style.opacity = "0.6";
      }
    } else {
      link.href = sim.localUrl;
      link.textContent = "Launch";
    }

    link.setAttribute("aria-label", `Open ${sim.title}`);

    node.style.animationDelay = `${index * 45}ms`;
    cardGrid.append(node);
  });

  countLabel.textContent = `${filtered.length} simulation${filtered.length === 1 ? "" : "s"}`;
}

function showLoadError() {
  cardGrid.textContent = "";
  const p = document.createElement("p");
  p.className = "empty-state";
  p.textContent = "Could not load simulations.json. Run generate-simulations.js and refresh.";
  cardGrid.append(p);
  countLabel.textContent = "0 simulations";
}

async function loadSimulations() {
  try {
    const response = await fetch("./simulations.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    simulations = Array.isArray(payload) ? payload : [];

    try {
      const publishedResponse = await fetch("./published-repos.json", { cache: "no-store" });
      if (publishedResponse.ok) {
        const publishedPayload = await publishedResponse.json();
        if (Array.isArray(publishedPayload)) {
          publishedRepos = new Set(publishedPayload);
          simulations = simulations.filter((sim) => publishedRepos.has(sim.repo));
        }
      }
    } catch {
      publishedRepos = null;
    }

    hydrateTopics();
    renderCards();
  } catch {
    simulations = [];
    hydrateTopics();
    showLoadError();
  }
}

searchInput.addEventListener("input", renderCards);
topicFilter.addEventListener("change", renderCards);

loadSimulations();
