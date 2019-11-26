// document.addEventListener("DOMContentLoaded", function() {});

const API_ENDPOINT = "http://localhost:3000"
const API_BOOKS = API_ENDPOINT + "/books"
const bookList = document.querySelector("#list")
const bookPanel = document.querySelector("#show-panel")
const user = { "id": 1, "username": "pouros" }

function run() {
  getBookData()
}

const getBookData = () => {
  fetch(API_BOOKS)
    .then(res => res.json())
    .then(json => json.forEach(book => renderBookListEl(book)))
}

const bookClickHandler = (book) => {
  renderBookPanel(book)
}

const likeClickHandler = (book) => {
  const users = book.users
  if (users.find(e => e.id === user.id)) {
    window.alert("You've already liked this book!")
  } else {
    addUserToBook(book)
  }
}

const renderBookListEl = (book) => {
  const li = document.createElement("li")
  li.addEventListener("click", () => { bookClickHandler(book) })
  li.innerText = book.title
  bookList.append(li)
}

const renderBookPanel = (book) => {
  bookPanel.innerHTML = ''

  const h2 = document.createElement("h2")
  const img = document.createElement("img")
  const p = document.createElement("p")
  const ul = document.createElement("ul")
  const btn = document.createElement("button")

  h2.innerText = book.title
  img.src = book.img_url
  p.innerText = book.description
  btn.innerText = "Like Book"
  btn.addEventListener("click", () => { likeClickHandler(book) })

  book.users.forEach(user => {
    const li = document.createElement("li")
    li.innerText = user.username
    ul.append(li)
  })

  bookPanel.append(h2, img, p, ul, btn)
}

const addUserToBook = (book) => {
  const patch_url = API_BOOKS + `/${book.id}`
  book.users.push(user)
  obj = {
    "method": "PATCH",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(book)
  }
  fetch(patch_url, obj)
    .then(res => res.json())
    .then(json => renderBookPanel(json))
}

run()