const countries = [];

var elBooksList = document.querySelector('.books');
var elBooksItemTemplate = document.querySelector('#books-item-template').content;

const elSearchForm = document.querySelector('.js-search-form');
const elFormNameInput = elSearchForm.querySelector('.js-name-input');
const elFormYearInput = elSearchForm.querySelector('.js-year-input');
const elFormCountryInput = elSearchForm.querySelector('.js-country-input');
const elFormLanguageInput = elSearchForm.querySelector('.js-language-input');
const elFormSortInput = elSearchForm.querySelector('.js-sort-input');

function showBooks (books) {
  elBooksList.innerHTML = '';
  var elBooksFragment = document.createDocumentFragment();

  for(var book of books){
    var elNewBooksItem = elBooksItemTemplate.cloneNode(true);

    elNewBooksItem.querySelector('.book__img').src = book.imageLink;
    elNewBooksItem.querySelector('.book__title').textContent = book.title;
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
  const criteir = book.title.match(titleRegex) && book.year === Number(elFormYearInput.value);
  return criteir;
 });
}

function bookFind (evt) {
  evt.preventDefault();

  const titleRegex = new RegExp (elFormNameInput.value.trim(), 'gi');
  const foundBooks = findBook(titleRegex);

  if (foundBooks.length > 0) {
    showBooks(foundBooks, titleRegex);
  } else {
    elBooksList.innerHTML = '<div class="col-12 text-center">Book not found</div>'
  }
}

if (elSearchForm) {
  elSearchForm.addEventListener('submit', bookFind)
}


function showCountryOption() {
  const elCountriesFragment = document.createDocumentFragment();
  countries.forEach(country => {
    const elCountryOption = document.createElement('option');
    elCountryOption.textContent = country;
    elCountryOption.value = country;
    elCountriesFragment.appendChild(elCountryOption);
  });
  elFormCountryInput.appendChild(elCountriesFragment);
}

showBooks(books);

