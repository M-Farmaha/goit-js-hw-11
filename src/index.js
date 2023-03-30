import axios from 'axios';

const searchFormEl = document.querySelector('.search-form');
const searchInputEl = document.querySelector('.search-input');
const searchBtnEl = document.querySelector('.search-btn');
const galleryEl = document.querySelector('.gallery');

searchFormEl.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(e) {
  e.preventDefault();

  const query = searchInputEl.value;

  getRequest(query)
    .then(res => res.data.hits)
    .then(createPictureMarkup)
    .then(addPictureMarkup)
    .then(console.log)
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
    page: 1,
    per_page: 8,
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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
