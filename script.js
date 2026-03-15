const DATA_PATHS = {
  couple: "./data/couple.json",
  schedule: "./data/schedule.json"
};

let weddingDays = [];

const timelineEl = document.getElementById("timeline");
const dayFiltersEl = document.getElementById("day-filters");
const sideFiltersEl = document.getElementById("side-filters");
const eventCardTemplate = document.getElementById("event-card-template");

const modalEl = document.getElementById("ritual-modal");
const modalCloseEl = document.getElementById("modal-close");
const modalSideEl = document.getElementById("modal-side");
const modalTitleEl = document.getElementById("modal-title");
const modalTimeEl = document.getElementById("modal-time");
const modalDescriptionEl = document.getElementById("modal-description");

const sideLabels = {
  all: "All Events",
  bride: "Bride Side",
  groom: "Groom Side",
  both: "Both Families"
};

const pageTitleEl = document.getElementById("page-title");
const pageDescriptionEl = document.getElementById("page-description");
const heroEyebrowEl = document.getElementById("hero-eyebrow");
const groomNameEl = document.getElementById("groom-name");
const brideNameEl = document.getElementById("bride-name");
const heroSubtitleEl = document.getElementById("hero-subtitle");

const state = {
  selectedSide: "all",
  selectedDay: "all"
};

async function loadWeddingData() {
  const [coupleRes, scheduleRes] = await Promise.all([
    fetch(DATA_PATHS.couple),
    fetch(DATA_PATHS.schedule)
  ]);

  if (!coupleRes.ok || !scheduleRes.ok) {
    throw new Error("Could not load wedding data files.");
  }

  const couplePayload = await coupleRes.json();
  const schedulePayload = await scheduleRes.json();

  return {
    couple: couplePayload.couple,
    seo: couplePayload.seo,
    days: schedulePayload.days || []
  };
}

function applyCoupleContent(couple, seo) {
  if (seo?.title) {
    document.title = seo.title;
    if (pageTitleEl) {
      pageTitleEl.textContent = seo.title;
    }
  }

  if (seo?.description && pageDescriptionEl) {
    pageDescriptionEl.setAttribute("content", seo.description);
  }

  if (couple?.heroEyebrow && heroEyebrowEl) {
    heroEyebrowEl.textContent = couple.heroEyebrow;
  }

  if (couple?.groomName && groomNameEl) {
    groomNameEl.textContent = couple.groomName;
  }

  if (couple?.brideName && brideNameEl) {
    brideNameEl.textContent = couple.brideName;
  }

  if (couple?.subtitle && heroSubtitleEl) {
    heroSubtitleEl.textContent = couple.subtitle;
  }
}

function initDayFilters() {
  dayFiltersEl.innerHTML = "";

  const allDayButton = document.createElement("button");
  allDayButton.className = "chip active";
  allDayButton.dataset.day = "all";
  allDayButton.textContent = "All Days";
  dayFiltersEl.appendChild(allDayButton);

  for (const day of weddingDays) {
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.dataset.day = day.id;
    btn.textContent = day.title.replace("Day ", "");
    dayFiltersEl.appendChild(btn);
  }
}

function setActiveChip(container, key, value) {
  const chips = container.querySelectorAll(".chip");
  chips.forEach((chip) => {
    chip.classList.toggle("active", chip.dataset[key] === value);
  });
}

function getFilteredData() {
  const side = state.selectedSide;
  const day = state.selectedDay;

  return weddingDays
    .filter((dayItem) => day === "all" || dayItem.id === day)
    .map((dayItem) => {
      const events = dayItem.events.filter((event) => {
        if (side === "all") {
          return true;
        }
        return event.side === side || event.side === "both";
      });
      return { ...dayItem, events };
    })
    .filter((dayItem) => dayItem.events.length > 0);
}

function openModal(dayTitle, event) {
  modalSideEl.textContent = sideLabels[event.side];
  modalTitleEl.textContent = event.title;
  modalTimeEl.textContent = `${dayTitle} • ${event.time} • ${event.location}`;
  modalDescriptionEl.textContent = event.ritualDescription;
  modalEl.showModal();
}

function createEventCard(dayTitle, event) {
  const clone = eventCardTemplate.content.cloneNode(true);
  const card = clone.querySelector(".event-card");

  card.dataset.side = event.side;
  card.querySelector(".event-time").textContent = event.time;
  card.querySelector(".event-title").textContent = event.title;

  const sideTag = card.querySelector(".event-side");
  sideTag.textContent = sideLabels[event.side];
  sideTag.dataset.side = event.side;

  card.querySelector(".event-location").textContent = event.location;

  const detailsBtn = card.querySelector(".details-btn");
  detailsBtn.addEventListener("click", () => openModal(dayTitle, event));

  return clone;
}

function renderTimeline() {
  const filteredDays = getFilteredData();
  timelineEl.innerHTML = "";

  if (filteredDays.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No events match your current filters.";
    timelineEl.appendChild(emptyState);
    return;
  }

  for (const day of filteredDays) {
    const dayBlock = document.createElement("section");
    dayBlock.className = "day-block";

    const header = document.createElement("header");
    header.className = "day-header";
    header.innerHTML = `<h2>${day.title}</h2><p>${day.dateLabel}</p>`;

    const eventsContainer = document.createElement("div");
    eventsContainer.className = "day-events";

    day.events.forEach((event) => {
      eventsContainer.appendChild(createEventCard(day.title, event));
    });

    dayBlock.append(header, eventsContainer);
    timelineEl.appendChild(dayBlock);
  }
}

function renderLoadError(error) {
  timelineEl.innerHTML = "";
  const emptyState = document.createElement("div");
  emptyState.className = "empty-state";

  if (window.location.protocol === "file:") {
    emptyState.innerHTML =
      "Could not load schedule data because this page is opened from your file system.<br/>Run <strong>python3 -m http.server 8000</strong> in this folder, then open <strong>http://localhost:8000</strong>.";
  } else {
    emptyState.textContent = "Could not load schedule data. Check files in /data and refresh.";
  }

  if (error) {
    console.error("Wedding data load error:", error);
  }

  timelineEl.appendChild(emptyState);
}

function initEventListeners() {
  sideFiltersEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-side]");
    if (!button) {
      return;
    }

    state.selectedSide = button.dataset.side;
    setActiveChip(sideFiltersEl, "side", state.selectedSide);
    renderTimeline();
  });

  dayFiltersEl.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-day]");
    if (!button) {
      return;
    }

    state.selectedDay = button.dataset.day;
    setActiveChip(dayFiltersEl, "day", state.selectedDay);
    renderTimeline();
  });

  modalCloseEl.addEventListener("click", () => modalEl.close());
  modalEl.addEventListener("click", (event) => {
    const modalBounds = modalEl.getBoundingClientRect();
    const isBackdropClick =
      event.clientX < modalBounds.left ||
      event.clientX > modalBounds.right ||
      event.clientY < modalBounds.top ||
      event.clientY > modalBounds.bottom;

    if (isBackdropClick) {
      modalEl.close();
    }
  });
}

async function init() {
  try {
    const data = await loadWeddingData();
    weddingDays = data.days;
    applyCoupleContent(data.couple, data.seo);
    initDayFilters();
    initEventListeners();
    renderTimeline();
  } catch (error) {
    renderLoadError(error);
  }
}

init();
