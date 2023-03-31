import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/simple-lightbox.min.css';
// import 'simplelightbox/src/simple-lightbox.scss';
import 'simplelightbox/dist/simple-lightbox.css';

var lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 100,
  scrollZoom: false,
  close: false,
  overlayOpacity: 0.666,
});

const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const searchBtnEl = document.querySelector('.search-btn');
const loadMoreBtnEl = document.querySelector('.load-more');
const galleryEl = document.querySelector('.gallery');

const renderPicturesPerRequest = 40;
let paginationCounter = 1;

searchFormEl.addEventListener('submit', handleFormSubmit);
loadMoreBtnEl.addEventListener('click', handleloadMoreBtnClick);
searchInputEl.addEventListener('input', () => {
  if (!searchInputEl.value) {
    searchBtnEl.setAttribute('disabled', 'true');
  } else {
    searchBtnEl.removeAttribute('disabled');
  }
});

function handleFormSubmit(e) {
  e.preventDefault();
  const query = searchInputEl.value;

  paginationCounter = 1;

  getRequest(query)
    .then(res => {
      if (!res.data.total) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notiflix.Notify.success(
          `Hooray! We found ${res.data.totalHits} images.`
        );
      }

      if (paginationCounter * renderPicturesPerRequest >= res.data.totalHits) {
        loadMoreBtnEl.classList.add('is-hidden');
      } else {
        loadMoreBtnEl.classList.remove('is-hidden');
      }
      return res.data.hits;
    })
    .then(createPictureMarkup)
    .then(markup => {
      addPictureMarkup(markup);
      smoothScroll();
      lightbox.refresh();
    })
    .catch(err => console.warn(err));
}

function handleloadMoreBtnClick() {
  paginationCounter += 1;

  const query = searchInputEl.value;

  getRequest(query)
    .then(res => {
      if (paginationCounter * renderPicturesPerRequest >= res.data.totalHits) {
        loadMoreBtnEl.classList.add('is-hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      return res.data.hits;
    })
    .then(createPictureMarkup)
    .then(markup => {
      loadMorePictureMarkup(markup);
      smoothScroll();
      lightbox.refresh();
    })
    .catch(err => console.warn(err));
}

function getRequest(query) {
  const BASE_URL = 'https://pixabay.com/api/';
  const params = {
    key: '34891957-fbaa485884f22f3e8d25bd4d4',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: paginationCounter,
    per_page: renderPicturesPerRequest,
  };

  return axios.get(BASE_URL, { params });
}

function createPictureMarkup(elements) {
  return elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function addPictureMarkup(markup) {
  galleryEl.innerHTML = markup;
}

function loadMorePictureMarkup(markup) {
  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
