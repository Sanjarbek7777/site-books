var countries = [];
var languages = [];

var elBooksList = document.querySelector('.books');
var elBooksItemTemplate = document.querySelector('#books-item-template').content;

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

function findBook(titleRegex) {
 return books.filter(book => {
  const findedBooks = book.title.match(titleRegex) && (elFormLanguageInput.value == book.language || elFormLanguageInput.value == 'all') && (elFormCountryInput.value == book.country || elFormCountryInput.value == 'all') && (Number(elFormYearInput.value) >= book.year || elFormYearInput.value == '');
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
    elBooksList.innerHTML = '<div class="col-12 text-center">Book not found</div>'
  }
}

if (elSearchForm) {
  elSearchForm.addEventListener('submit', bookFind)
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
  for (const lan of languages) {
    const elNewOption = document.createElement('option');
    elNewOption.textContent = lan;
    elNewOption.value = lan;
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

  for (const con of countries) {
    const elNewOption = document.createElement('option');
    elNewOption.textContent = con;
    elNewOption.value = con;
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

getLanguages();
appendLanguages();
getCountries();
appendCountires();
showBooks(books);

