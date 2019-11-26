// URLs
const API_ENDPOINT = "http://localhost:3000"
const BOOKS_URL = `${API_ENDPOINT}/books`

// DOM elements
const ul = document.querySelector("#list")
const show = document.querySelector("#show-panel")
const currentUser = {"id":1, "username":"pouros"}


// fetch books
function getBooks() {
    return fetch(BOOKS_URL)
        .then(function(resp) {
            return resp.json()
        })
}

// fetch and render index of books
getBooks().then(function(booksJson) {
    booksJson.forEach(function(book) {
        renderBookTitle(book)
    })
})

// render single book title
function renderBookTitle(book) {
    let li = document.createElement("li")
    li.id = book.id
    li.innerText = book.title
    li.style.cursor = "pointer"

    li.addEventListener("click", function() {
        renderBookItem(book)
    })

    ul.appendChild(li)

    return li
}

// render single book item
function renderBookItem(book) {
    show.innerHTML = ""
    // while (show.firstChild) show.removeChild(show.firstChild);

    let h3 = document.createElement("h3")
    h3.innerText = book.title

    let img = document.createElement("img")
    img.src = book.img_url

    let p = document.createElement("p")
    p.innerText = book.description

    let ul = document.createElement("ul")

    book.users.forEach(function(user) {
        let li = document.createElement("li")
        li.innerText = user.username
        ul.appendChild(li)
    })

    let btn = document.createElement("button")
    btn.id = book.id
    btn.innerText = "Like Book"

    btn.addEventListener("click", function() {
        book.users.push(currentUser)
        likeBook(book)
    })

    show.append(h3, img, p, ul, btn)

    return show
}

// like book
function likeBook(book) {
    let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "users": book.users
        })
    }

    fetch (`${BOOKS_URL}/${book.id}`, configObj)
        .then(function(resp) {
            return resp.json()
        })
        .then(function() {
            renderBookItem(book)
        })
}


