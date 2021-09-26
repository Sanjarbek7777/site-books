var countries = [];
var languages = [];
var bookmarkList = [];

var elBooksList = document.querySelector('.books');
var elBooksItemTemplate = document.querySelector('#books-item-template').content;
var elBookmarksTemplate = document.querySelector('#bookmarks__template').content;


// BOOKMARK
var elBookmarksModal = document.querySelector('.bookmarks-modal');
var elBookmarksList = elBookmarksModal.querySelector('.bookmarks__list');
var elWatchlistFragment = document.createDocumentFragment();



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

    elBooksFragment.appendChild(elNewBooksItem);
  }

  elBooksList.appendChild(elBooksFragment);
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

function showBookmarksList () {
  elBookmarksList.innerHTML = '';
  let elBookmarksFragment = document.createDocumentFragment();
  for (const bookmark of books) {
    const elNewBookmarksItem = elBookmarksTemplate.cloneNode(true);

    elNewBookmarksItem.querySelector('.js-bookmarks-link').textContent = bookmark.title;
    elNewBookmarksItem.querySelector('.js-bookmarks-link').href = bookmark.link;
    elNewBookmarksItem.querySelector('.js-bookmarks-year').textContent = bookmark.year;
    elNewBookmarksItem.querySelector('js-bookmarks-close').dataset.title = bookmark.title;

    elBookmarksFragment.appendChild(elNewBookmarksItem);
  }
  elBookmarksList.appendChild(elBookmarksFragment);
}

elBookmarksModal.addEventListener('show.bs.modal', showBookmarksList);

elBookmarksModal.addEventListener('click', (evt) => {
  if (evt.target.matches('.js-bookmarks-close')) {
    const bookmarkIndex = bookmarkList.findIndex(bookmark => bookmark.title === evt.target.dataset.title);
    const elBookmark = elBooksList.querySelector('.book__btn');


    bookmarkList.splice(bookmarkIndex, 1);
    elBookmark.textContent = 'Bookmark';
    elBookmark.classList.remove('bookmark-btn');


    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
    showBookmarksList();
  }
});

function onBooksListInfoButtonClick(evt) {
  if (evt.target.matches('.book__btn')) {
    const elBookmarkButton = evt.target;

    if (elBookmarkButton.matches('.bookmark-btn')) {
      elBookmarkButton.textContent = 'Bookmark';
      elBookmarkButton.classList.remove('bookmark-btn');

      const elBookmarkIndex = bookmarkList.findIndex(book => book.title === elBookmarkButton.dataset.title);
      bookmarkList.splice(bookmarkIndex, 1);
    } else {
      elBookmarkButton.textContent = 'Bookmarked';
      elBookmarkButton.classList.add('bookmark-btn');

      const newBookmark = books.find(book => book.title === elBookmarkButton.dataset.title);
      bookmarkList.push(newBookmark);
    }
    localStorage.setItem('bookmarkList', JSON.stringify(bookmarkList));
  }
}


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

