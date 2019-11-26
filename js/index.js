document.addEventListener("DOMContentLoaded", function() {});
document.body.style.backgroundColor = "darkgrey"

//API points

API_ENDPOINT = "http://localhost:3000"
API_BOOKS = "/books"
API_USERS = "/users"

//DOM elements
const list = document.querySelector("#list")
const show = document.querySelector("#show-panel")

let LIKED = false

const getBooks = () => {
  fetch(`${API_ENDPOINT}${API_BOOKS}`)
  .then(resp => resp.json())
  .then(json => renderBooks(json))
}

const renderBooks = (book) => {
  book.forEach(el => {
    renderBook(el)
  })
}

const renderBook = (book) => {
  let newLi = document.createElement("li")
  newLi.textContent = book.title
  newLi.id = book.id
  list.appendChild(newLi)
  newLi.addEventListener("click", () => showBook(book))
}

const showBook = (book) => {
  show.innerHTML = null
  let image = document.createElement("img")
  image.src = book.img_url
  let p = document.createElement("p")
  p.textContent = book.description
  let ul = document.createElement("ul")
  ul.textContent = "Users who liked this book:"
  let button = document.createElement("button")
  button.style.height = '100px'
  button.style.width = '100px'

  if (LIKED) {
    button.style.backgroundColor = "grey"
    button.textContent = `UNLIKE`
  } else {
    button.style.backgroundColor = "firebrick"
    button.textContent = `LIKE`
  }
  button.addEventListener("click", () => updateUsers(book))

  show.appendChild(image)
  show.appendChild(p)
  show.appendChild(ul)
  show.appendChild(button)


  book.users.forEach((el) => {
    let li = document.createElement("li")
    li.textContent = el.username
    ul.appendChild(li)
  })

}

const updateUsers = (book) => {

  let user = {id: 1, username: "pouros"}

  if (book.users.map(x => x.id).includes(user.id)) {
    book.users.pop()
    LIKED = false
  } else {
    book.users.push(user)
    LIKED = true
  }

  const configObj = {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      "accept": "application/json"
    },
    body: JSON.stringify(book)
  }


  fetch(`${API_ENDPOINT}${API_BOOKS}/${book.id}`, configObj).then(showBook(book))
}

getBooks()