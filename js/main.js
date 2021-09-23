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
    elNewBooksItem.querySelector('.book__link').href = book.link;

    elBooksFragment.appendChild(elNewBooksItem);
  }

  elBooksList.appendChild(elBooksFragment);
}

function findBooks (titleRegex) {
  for (book of books) {
    if (elFormNameInput.value === book.title) {
      return book.title;
    }
  }
}

function onBookSearch (evt) {
  evt.preventDefault();

  const titleRegex = new RegExp(elFormNameInput, 'gi');
  const foundBooks = findBooks(titleRegex);

  if(foundBooks.length > 0) {
    showBooks(foundBooks);
  } else {
    elBooksList.innerHTML = '<div class="col-12 text-center">Book not found</div>';
  }
}

if(elSearchForm) {
  elSearchForm.addEventListener('submit', onBookSearch);
}


showBooks(books);

