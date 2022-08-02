'use strict'

function onInit() {
  renderFilterByQueryStringParams()
  renderBooks()
  checkIfOnlyOnePage()
  onCheckModalOpened()
}

function renderBooks() {
  const books = getBooksForDisplay()

  var strHTMLs = `
    <thead>
        <tr>
            <th>Id</th>
            <th onclick="onSetSort('name')">Title</th>
            <th onclick="onSetSort('price')">Price</th>
            <th>Rating</th>
            <th>Image</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
    `

  if (books.length > 0) {
    books.map((book) => {
      return (strHTMLs += `
            <tr>
                <th>${book.id}</th>
                <th>${book.name}</th>
                <th>$${book.price}</th>
                <th>${book.rate}</th>
                <th><img src="${book.imgUrl}" width="80"></th>
                <th>
                    <button onclick="onReadBook('${book.id}')" class="action-btn btn-read">Read</button>
                    <button onclick="onUpdateBook('${book.id}')" class="action-btn btn-update">Update</button>
                    <button onclick="onRemoveBook('${book.id}')" class="action-btn btn-delete">Delete</button>
                </th>
            </tr>
            `)
    })
  }

  strHTMLs += `</tbody>`
  document.querySelector('.books-table').innerHTML = strHTMLs
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onAddBook() {
  var name = prompt('Enter book name')
  var price = +prompt('Enter book price')

  if (price > 150) {
    alert('This is a cheap store! The maximum price for a book is 150$')
    return
  }

  if (name && price) {
    addBook(name, price)
    renderBooks()
    checkIfOnlyOnePage()
  }
}

function onUpdateBook(bookId) {
  var price = +prompt('Enter the new book price')
  if (price) {
    updateBook(bookId, price)
    renderBooks()
  }
}

function onReadBook(bookId) {
  const book = getBookById(bookId)
  saveReadBook(book)
  renderModal(book)
}

function onCloseModal() {
  document.querySelector('.modal').classList.remove('shown')
  closeModal()
  renderBooks()
}

function renderModal(book) {
  const strHTMLs = `
        <h3>${book.name}</h3>
      <h4>Price - <span>$${book.price}</span></h4>
      <img src="${book.imgUrl}" />
      <h4>Rating</h4>
      <div class="adjust-rating">
        <button onclick="onChangeRating('${book.id}', -1)" class="minus">-</button>
        <input class="rating-input" type="text" value="${book.rate}" />
        <button onclick="onChangeRating('${book.id}', 1)" class="plus">+</button>
      </div>
      <button class="action-btn" onclick="onCloseModal()">Close</button>
    `

  var elModal = document.querySelector('.modal')
  elModal.innerHTML = strHTMLs
  elModal.classList.add('shown')
}

function onChangeRating(bookId, diff) {
  changeRating(bookId, diff)

  const book = getBookById(bookId)
  renderModal(book)
}

function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy)

  console.log(`gFilterBy:`, gFilterBy)
  renderBooks()

  const queryStringParams = `?maxPrice=${filterBy.maxPrice}&minRate=${filterBy.minRate}&bookTitle=${filterBy.bookTitle}`
  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    queryStringParams
  window.history.pushState({ path: newUrl }, '', newUrl)
}

function renderFilterByQueryStringParams() {
  const queryStringParams = new URLSearchParams(window.location.search)
  const filterBy = {
    maxPrice: queryStringParams.get('maxPrice') || 150,
    minRate: queryStringParams.get('minRate') || 0,
    bookTitle: queryStringParams.get('bookTitle') || '',
  }

  if (!filterBy.maxPrice && !filterBy.minRate && !filterBy.bookTitle) return

  document.querySelector('.filter-price-range').value = filterBy.maxPrice
  document.querySelector('.filter-rating-range').value = filterBy.minRate
  document.querySelector('.filter-input').value = filterBy.bookTitle

  setBookFilter(filterBy)
}

function onNextPage() {
  const isLastPage = nextPage()
  const elPrevPage = document.querySelector('.prev-page')
  const elNextPage = document.querySelector('.next-page')

  elPrevPage.removeAttribute('disabled', '')
  if (isLastPage) {
    elNextPage.setAttribute('disabled', '')
  }
  renderBooks()
}

function onPrevPage() {
  const isFirstPage = prevPage()
  const elPrevPage = document.querySelector('.prev-page')
  const elNextPage = document.querySelector('.next-page')

  elNextPage.removeAttribute('disabled', '')
  if (isFirstPage) {
    elPrevPage.setAttribute('disabled', '')
  }
  renderBooks()
}

function checkIfOnlyOnePage() {
  if (PAGE_SIZE === gBooks.length) {
    document.querySelector('.next-page').setAttribute('disabled', '')
  } else {
    document.querySelector('.next-page').removeAttribute('disabled', '')
  }
}

function onSetSort(sortBy) {
  setBookSort(sortBy)
  renderBooks()
}

function onCheckModalOpened() {
  const book = checkModalOpened()

  if (book) renderModal(book)
}
