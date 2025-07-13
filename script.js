const tabs = document.querySelectorAll(".tab");
const content = document.getElementById("content");
const splineIframeHTML = `<iframe
  id="spline-iframe"
  src="https://my.spline.design/reactiveorb-Y72LpSNUnaZgtqx6g6dFc3rM/"
  allowfullscreen
  frameborder="0"
></iframe>`;

function setActiveTab(tab) {
  tabs.forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
}

function loadPage(page) {
  if (page === "home") {
    content.innerHTML = splineIframeHTML;
    history.pushState(null, "", "/");
  } else {
    fetch(page + ".html")
      .then((response) => {
        if (!response.ok) throw new Error("Page not found");
        return response.text();
      })
      .then((html) => {
        content.innerHTML = `<div class="page-content">${html}</div>`;
        history.pushState(null, "", "/" + page);
      })
      .catch(() => {
        content.innerHTML = `<div class="page-content"><h2>Page Not Found</h2></div>`;
        history.pushState(null, "", "/" + page);
      });
  }
}

// On tab click
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const page = tab.dataset.page;
    setActiveTab(tab);
    loadPage(page);
  });
});

// Handle back/forward buttons
window.addEventListener("popstate", () => {
  let path = window.location.pathname.slice(1); // remove leading '/'
  if (!path) path = "home";

  const tabToActivate = Array.from(tabs).find((t) => t.dataset.page === path);
  if (tabToActivate) setActiveTab(tabToActivate);

  loadPage(path);
});

// On page load: activate tab and load content based on URL
window.addEventListener("DOMContentLoaded", () => {
  let path = window.location.pathname.slice(1);
  if (!path || path === "") path = "home";

  const tabToActivate = Array.from(tabs).find((t) => t.dataset.page === path);
  if (tabToActivate) {
    setActiveTab(tabToActivate);
    loadPage(path);
  } else {
    // fallback to home
    setActiveTab(tabs[0]);
    loadPage("home");
  }
});
