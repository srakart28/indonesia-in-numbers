// Indonesia in Numbers — a hash router over the five sections in views.js.
//
//   #/               the overview      #/economy       the economy
//   #/demographics   demographics      #/provinces     the province table
//   #/society        society
//
// Everything is in this folder, so the site works from its own files with no network.
// window.__shotReady is false while a page renders and true once it is on screen, so a screenshot
// script knows when to capture.

import { pages } from './views.js';

const app = document.getElementById('app');
const links = document.querySelectorAll('nav a[data-route]');

const routes = {
  '/': 'overview',
  '/demographics': 'demographics',
  '/economy': 'economy',
  '/provinces': 'provinces',
  '/society': 'society',
};

function render() {
  window.__shotReady = false;
  const path = location.hash.replace(/^#/, '') || '/';
  const name = routes[path] ?? 'overview';
  const page = pages[name]();
  document.title = `${page.title} | Indonesia in Numbers`;
  app.innerHTML = page.html;
  links.forEach((a) => a.classList.toggle('active', a.dataset.route === name));
  window.scrollTo(0, 0);
  page.mount();
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
