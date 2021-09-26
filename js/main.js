var countries = [];
var languages = [];
const bookList = JSON.parse(localStorage.getItem('booklist')) || [];


var elBooksList = document.querySelector('.books');
var elBooksItemTemplate = document.querySelector('#books-item-template').content;


// BOOKMARK
const elBookListModal = document.querySelector('.booklist-modal');
const elBookListALL = elBookListModal.querySelector('.booklist-modal__list');
const bookListFragment = document.createDocumentFragment();


// FORM
const elSearchForm = document.querySelector('.js-search-form');
const elFormNameInput = elSearchForm.querySelector('.js-name-input');
const elFormYearInput = elSearchForm.querySelector('.js-year-input');
const elFormCountryInput = elSearchForm.querySelector('.js-country-input');
const elFormLanguageInput = elSearchForm.querySelector('.js-language-input');
const elFormSortInput = elSearchForm.querySelector('.js-sort-input');

function showBooks (books, titleRegex = '') {
  elBooksList.innerHTML = '';
  var elBooksFragment = document.createDocumentFragment();

  for(var book of books){
    var elNewBooksItem = elBooksItemTemplate.cloneNode(true);

    elNewBooksItem.querySelector('.book__img').src = book.imageLink;
    if (titleRegex.source !== '(?:)' && titleRegex) {
      elNewBooksItem.querySelector('.book__title').innerHTML = book.title.replace(titleRegex, `<mark class="p-0" style="background-color: yellow;">${titleRegex.source}</mark>`);
    } else {
      elNewBooksItem.querySelector('.book__title').textContent = book.title;
    }
    elNewBooksItem.querySelector('.book__author').textContent = book.author;
    elNewBooksItem.querySelector('.book__year').textContent = book.year;
    elNewBooksItem.querySelector('.book__page').textContent = book.pages;
    elNewBooksItem.querySelector('.book__language').textContent = book.language;
    elNewBooksItem.querySelector('.book__country').textContent = book.country;
    elNewBooksItem.querySelector('.book__link').href = book.link;
    elNewBooksItem.querySelector('.book__link').target = '_blank';

    const elBookmarkBtn = elNewBooksItem.querySelector('.js-bookmark-button');
    elBookmarkBtn.dataset.title = book.title;
    const indexBookInBookList = bookList.findIndex(book => book.title === elBookmarkBtn.dataset.title);
    if (indexBookInBookList > -1) {
      elBookmarkBtn.classList.add('btn-secondary');
      elBookmarkBtn.classList.remove('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmarked ✔';
    } else {
      elBookmarkBtn.classList.remove('btn-secondary');
      elBookmarkBtn.classList.add('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmark';
    }

    elBooksFragment.appendChild(elNewBooksItem);
  }

  elBooksList.appendChild(elBooksFragment);
}

function onBooksListInfoButtonClick(evt) {

  if (evt.target.matches('.js-bookmark-button')) {
    const elBookmarkBtn = evt.target;
    const book = books.find(book => book.title === elBookmarkBtn.dataset.title);
    const indexBookInBookList = bookList.findIndex(book => book.title === elBookmarkBtn.dataset.title);

    if (indexBookInBookList === -1) {
      bookList.push(book);
      elBookmarkBtn.classList.add('btn-secondary');
      elBookmarkBtn.classList.remove('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmarked ✔';
    } else {
      bookList.splice(indexBookInBookList, 1);
      elBookmarkBtn.classList.remove('btn-secondary');
      elBookmarkBtn.classList.add('btn-outline-secondary');
      elBookmarkBtn.textContent = 'Bookmark';
    }

    localStorage.setItem('booklist', JSON.stringify(bookList));
  }
}

function getLanguages() {

  for (book of books) {
    if (!languages.includes(book.language)) {
      languages.push(book.language);
    }
  }
}

function appendLanguages() {

  let languageFragment = document.createDocumentFragment();
  for (const language of languages) {
    const elNewOption = document.createElement('option');
    elNewOption.textContent = language;
    elNewOption.value = language;
    languageFragment.appendChild(elNewOption);
  }
  elFormLanguageInput.appendChild(languageFragment);
}



function getCountries() {
  for (book of books) {
    if (!countries.includes(book.country)) {
      countries.push(book.country);
    }
  }
}

function appendCountires() {
  let countryFragment = document.createDocumentFragment();

  for (const country of countries) {
    const elNewOption = document.createElement('option');
    elNewOption.textContent = country;
    elNewOption.value = country;
    countryFragment.appendChild(elNewOption);
  }
  elFormCountryInput.appendChild(countryFragment);
  }

function sortBooks(books, sortType) {
  if (sortType === 'az') {
    books.sort((a, b) => {
      if (a.title > b.title) return 1;
      if (a.title < b.title) return -1;
      return 0;
    });
  } else if (sortType === 'za') {
    books.sort((a, b) => {
      if (a.title < b.title) return 1;
      if (a.title > b.title) return -1;
      return 0;
    });
  } else if (sortType === 'year_old') {
    books.sort((a, b) => a.year - b.year);
  } else if (sortType === 'year_new') {
    books.sort((a, b) => b.year - a.year);
  }
}


function findBook(titleRegex) {
 return books.filter(book => {
  const findedBooks = book.title.match(titleRegex) && (elFormLanguageInput.value === book.language || elFormLanguageInput.value === 'all') && (elFormCountryInput.value === book.country || elFormCountryInput.value === 'all') && (Number(elFormYearInput.value) >= book.year || elFormYearInput.value === '');
  return findedBooks;
 });
}

function bookFind (evt) {
  evt.preventDefault();

  const titleRegex = new RegExp (elFormNameInput.value.trim(), 'gi');
  const foundBooks = findBook(titleRegex);

  if (foundBooks.length > 0) {
    sortBooks(foundBooks, elFormSortInput.value);
    showBooks(foundBooks, titleRegex);
  } else {
    elBooksList.innerHTML = '<div class="col-12 text-center">Book not found</div>';
  }
}


function showBooklist() {
  elBookListALL.innerHTML = '';

  for (let bookItem of bookList) {
    let newBookmark = `<li class="bookmark booklist-modal__item list-group-item d-flex align-items-center justify-content-between" data-unique-id="${bookItem.title}">
    <h3 class="bookmark__title h5">${bookItem.title} (${bookItem.year})</h3>
    <button class="bookmark__remove btn btn-danger btn-sm text-white" type="button" title="Remove from booklist" data-unique-id="${bookItem.title}">&#10006;</button>
    </li>`;
    elBookListALL.insertAdjacentHTML('beforeend', newBookmark)
  }
}

elBookListModal.addEventListener('show.bs.modal', showBooklist);

elBookListModal.addEventListener('click', (evt) => {
  if (evt.target.matches('.bookmark__remove')) {
    const bookmarkIndex = bookList.findIndex(bookmark => bookmark.title === evt.target.dataset.uniqueId);
    const removedBookmark = bookList.splice(bookmarkIndex, 1)[0];

    const elBookmark = elBooksList.querySelector(`.js-bookmark-button[data-title="${removedBookmark.title}"]`);
    elBookmark.classList.remove('btn-secondary');
    elBookmark.classList.add('btn-outline-secondary');
    elBookmark.textContent = 'Bookmark';

    localStorage.setItem('booklist', JSON.stringify(bookList));
    showBooklist();
  }
});


if (elSearchForm) {
  elSearchForm.addEventListener('submit', bookFind);
}

if (elBooksList) {
  elBooksList.addEventListener('click', onBooksListInfoButtonClick);
}

getLanguages();
appendLanguages();
getCountries();
appendCountires();
showBooks(books);

