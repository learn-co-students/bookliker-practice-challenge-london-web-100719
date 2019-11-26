// API
API_ENDPOINT = "http://localhost:3000"
API_BOOKS = API_ENDPOINT + "/books"

handleHTTPRequest = (url, callback, config = {}) => {
  return fetch(url, config)
    .then(res => res.json())
    .then(json => callback(json))
}

generateConfig = (method, body) => {
  return config = {
    "method": `${method}`,
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(body)
  }
}


// Variables
bookList = document.querySelector("#list")
bookPanel = document.querySelector("#show-panel")
user = { "id": 1, "username": "pouros" }


// Event Functions
function run() {
  getBookData()
}

getBookData = () => handleHTTPRequest(API_BOOKS, renderBookList)
bookClickHandler = (book) => renderBookPanel(book)
likeButtonHandler = (book) => {
  btn = document.createElement("button")
  hasUserLiked(book) ? btn.innerText = "Un-Like Book" : btn.innerText = "Like Book"
  btn.addEventListener("click", () => { toggleLike(book) })
  return btn
}


// Render Functions
renderBookList = (json) => json.forEach(book => renderBookListEl(book))

renderBookListEl = (book) => {
  li = document.createElement("li")
  li.addEventListener("click", () => { bookClickHandler(book) })
  li.innerText = book.title
  bookList.append(li)
}

renderBookPanel = (book) => {
  // bookPanel.innerHTML = ''
  while (bookPanel.firstChild) bookPanel.removeChild(bookPanel.firstChild);

  h2 = buildElement("h2", book.title)
  p = buildElement("p", book.description)
  img = document.createElement("img")
  img.src = book.img_url
  ul = document.createElement("ul")
  buildListForUl(book, ul)
  btn = likeButtonHandler(book)
  bookPanel.append(h2, img, p, ul, btn)
}

buildElement = (element, content) => {
  el = document.createElement(element)
  el.innerText = content
  return el
}

buildListForUl = (book, ul) => {
  book.users.forEach(user => {
    li = document.createElement("li")
    li.innerText = user.username
    ul.append(li)
  })
}


// Helper Functions
hasUserLiked = (book) => !!book.users.find(e => e.id === user.id)

toggleLike = (book) => {
  hasUserLiked(book) ? book.users = book.users.filter(e => e.id !== user.id) : book.users.push(user)
  patch_url = API_BOOKS + `/${book.id}`
  config = generateConfig("PATCH", book)
  return handleHTTPRequest(patch_url, renderBookPanel, config)
}

// Execute
run()