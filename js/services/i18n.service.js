'use strict'

var gTrans = {
  'main-title': {
    en: 'Welcome to my bookshop',
    he: 'ברוכים הבאים לחנות הספרים שלי',
  },
  'create-book': {
    en: 'Create new book',
    he: 'צור ספר חדש',
  },
  'filter-books': {
    en: 'Filter Books',
    he: 'סינון ספרים',
  },
  'max-price': {
    en: 'Max Price:',
    he: 'מחיר מקסימלי:',
  },
  'min-rating': {
    en: 'Min Rating:',
    he: 'דירוג מינימלי:',
  },
  'search-book-input-placeholder': {
    en: 'Search for books..',
    he: 'חפש שם ספר..',
  },
  'prev-page': {
    en: 'Prev Page',
    he: 'עמוד קודם',
  },
  'next-page': {
    en: 'Next Page',
    he: 'עמוד הבא',
  },
  'book-id': {
    en: 'Id',
    he: 'מזהה',
  },
  'book-title': {
    en: 'Title',
    he: 'כותרת',
  },
  'book-price': {
    en: 'Price',
    he: 'מחיר',
  },
  'book-rating': {
    en: 'Rating',
    he: 'דירוג',
  },
  'book-image': {
    en: 'image',
    he: 'תמונה',
  },
  'book-actions': {
    en: 'Actions',
    he: 'פעולות',
  },
  read: {
    en: 'Read',
    he: 'קרא',
  },
  update: {
    en: 'Update',
    he: 'עדכן',
  },
  delete: {
    en: 'Delete',
    he: 'מחק',
  },
  'modal-price': {
    en: 'Price - ',
    he: 'מחיר - ',
  },
  'modal-rating': {
    en: 'Rating',
    he: 'דירוג',
  },
  'close-modal': {
    en: 'Close',
    he: 'סגור',
  },
}

var gCurrLang = 'en'

function getTrans(transKey) {
  const key = gTrans[transKey]

  if (!key) return 'UNKNOWN'

  let translateVal = key[gCurrLang]
  // If translation not found - use english
  if (!translateVal) translateVal = key['en']
  return translateVal
}

function doTrans() {
  const els = document.querySelectorAll('[data-trans]')

  els.forEach((el) => {
    const translateKey = el.dataset.trans
    const translateVal = getTrans(translateKey)
    el.innerText = translateVal
    if (el.placeholder !== undefined) el.placeholder = translateVal
  })
}

function setLang(lang) {
  gCurrLang = lang
}

function formatPrice(price) {
  // return new Intl.NumberFormat(gCurrLang, shekelOpt).format(price)
  price = gCurrLang === 'en' ? price : price * 3.37

  return new Intl.NumberFormat(gCurrLang, {
    style: 'currency',
    currency: gCurrLang === 'en' ? 'usd' : 'ils',
  }).format(price)
  // console.log(new Intl.NumberFormat('he', shekelOpt).format(num))
  // console.log(new Intl.NumberFormat('fr', shekelOpt).format(num))
}
