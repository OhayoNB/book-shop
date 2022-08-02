'use strict'

const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 3

var gBooks
var gFilterBy = { maxPrice: 150, minRate: 0, bookTitle: '' }
var gSortDirection = 1
var gPageIdx = 0

_createBooks()

function _createBooks() {
  var books = loadFromStorage(STORAGE_KEY)

  if (!books || !books.length) {
    books = []
    for (var i = 0; i < 5; i++) {
      books.push(_createBook())
    }
  }
  gBooks = books
  _saveBooksToStorage()
}

function _createBook(name = makeLorem(), price = '26') {
  return {
    id: makeId(),
    name,
    price: +price,
    imgUrl: `img/book${getRandomIntInclusive(1, 4)}.png`,
    rate: 0,
  }
}

function getBooksForDisplay() {
  var books = gBooks.filter(
    (book) =>
      book.rate >= gFilterBy.minRate &&
      book.price <= gFilterBy.maxPrice &&
      book.name.toLowerCase().includes(gFilterBy.bookTitle.toLowerCase())
  )

  const startIdx = gPageIdx * PAGE_SIZE

  books = books.slice(startIdx, startIdx + PAGE_SIZE)

  return books
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex((book) => bookId === book.id)
  gBooks.splice(bookIdx, 1)

  _saveBooksToStorage()
}

function addBook(name, price) {
  const book = _createBook(name, price)
  gBooks.unshift(book)
  _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
  const book = gBooks.find((book) => book.id === bookId)

  book.price = newPrice
  _saveBooksToStorage()
}

function getBookById(bookId) {
  const book = gBooks.find((book) => book.id === bookId)

  if (book) return book
}

function changeRating(bookId, diff) {
  const book = gBooks.find((book) => book.id === bookId)

  if (book.rate === 0 && diff === -1) return
  if (book.rate === 10 && diff === 1) return

  book.rate += diff
  // readBook function call to save the changed rating to the opened book modal
  saveReadBook(book)
  _saveBooksToStorage()
}

function setBookFilter(filterBy = {}) {
  if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
  if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
  if (filterBy.bookTitle !== undefined) gFilterBy.bookTitle = filterBy.bookTitle

  return gFilterBy
}

function nextPage() {
  gPageIdx++

  const isLastPage = PAGE_SIZE + gPageIdx * PAGE_SIZE >= gBooks.length
  return isLastPage
}

function prevPage() {
  gPageIdx--

  const isFirstPage = gPageIdx === 0
  return isFirstPage
}

function setBookSort(sortBy) {
  if (gSortDirection === 1) gSortDirection = -1
  else gSortDirection = 1

  if (sortBy === 'name') {
    gBooks.sort(
      (book1, book2) => book1.name.localeCompare(book2.name) * gSortDirection
    )
  } else if (sortBy === 'price') {
    gBooks.sort((book1, book2) => (book1.price - book2.price) * gSortDirection)
  }
}

function saveReadBook(book) {
  saveToStorage('detailedBook', book)
}

function closeModal() {
  localStorage.removeItem('detailedBook')
}

function checkModalOpened() {
  const detailedBook = loadFromStorage('detailedBook')

  return detailedBook
}

function isOnlyOnePage() {
  return gBooks.length <= PAGE_SIZE
}
