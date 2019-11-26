// document.addEventListener("DOMContentLoaded", function() {});

const API_ENDPOINT = "http://localhost:3000"
const API_BOOKS = API_ENDPOINT + "/books"
const bookList = document.querySelector("#list")
const bookPanel = document.querySelector("#show-panel")
const user = { "id": 1, "username": "pouros" }

function run() {
  getBookData()
}

const handleHTTPRequest = (url, callback, config = {}) => {
  return fetch(url, config)
    .then(res => res.json())
    .then(json => callback(json))
}


const getBookData = () => handleHTTPRequest(API_BOOKS, renderBookList)

const renderBookList = (json) => json.forEach(book => renderBookListEl(book))

const bookClickHandler = (book) => renderBookPanel(book)

const likeButtonHandler = (book) => {
  const btn = document.createElement("button")
  hasUserLiked(book) ? btn.innerText = "Un-Like Book" : btn.innerText = "Like Book"
  btn.addEventListener("click", () => { toggleLike(book) })
  return btn
}

const hasUserLiked = (book) => !!book.users.find(e => e.id === user.id)

const renderBookListEl = (book) => {
  const li = document.createElement("li")
  li.addEventListener("click", () => { bookClickHandler(book) })
  li.innerText = book.title
  bookList.append(li)
}

const renderBookPanel = (book) => {
  bookPanel.innerHTML = ''

  const h2 = buildElement("h2", book.title)
  const p = buildElement("p", book.description)
  const img = document.createElement("img")
  img.src = book.img_url
  const ul = document.createElement("ul")
  buildListForUl(book, ul)
  let btn = likeButtonHandler(book)
  bookPanel.append(h2, img, p, ul, btn)
}

const buildElement = (element, content) => {
  let el = document.createElement(element)
  el.innerText = content
  return el
}

const buildListForUl = (book, ul) => {
  book.users.forEach(user => {
    const li = document.createElement("li")
    li.innerText = user.username
    ul.append(li)
  })
}

const toggleLike = (book) => {
  hasUserLiked(book) ? book.users = book.users.filter(e => e.id !== user.id) : book.users.push(user)
  const patch_url = API_BOOKS + `/${book.id}`
  let config = generateConfig("PATCH", book)
  return handleHTTPRequest(patch_url, renderBookPanel, config)
}

const generateConfig = (method, body) => {
  return config = {
    "method": `${method}`,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(body)
  }
}


run()