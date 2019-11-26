document.addEventListener("DOMContentLoaded", function() {

    renderBooks()
});

const URL = "http://localhost:3001/books"

// fetching books to list them in div 'list'

function fetchBooks(url){
    return fetch(url)
    .then(resp => resp.json())
}

function renderBooks(){
    fetchBooks(URL)
    .then(displayBooks)
}

function displayBooks(books){
    const listUL = document.getElementById("list")
    books.forEach( book => addBook(book, listUL) )
}

function addBook(book, element){
    const li = createElementWith("li", "innerText", book.title, "id", book.id)
    li.addEventListener('click', event => renderThumbnail(event))
    element.append(li)
}

function createElementWith(element, type, name, type1, name1){
    const createEl = document.createElement(element)
    createEl[type] = name
    createEl[type1] = name1
    return createEl
}

function renderThumbnail(event){ 
    const bookId = event.target.id
    fetchBooks(`${URL}/${bookId}`)
    .then(displayThumbnail)
    
}

//  listing blurb

function displayThumbnail(book){
    const showPanelDiv = document.getElementById("show-panel")
    removeChildren(showPanelDiv)
    addThumbnail(book, showPanelDiv)
}

function addThumbnail(book, element){
    const cardDiv = createElementWith("div", "className", "card")
    const h2 = createElementWith("h2", "innerText", book.title)
    const p = createElementWith("p", "innerText", book.description)
    const titleP = createElementWith("p", "innerText", "User who have liked this book:")
    const ul = createElementWith("ul", "style", "list-style-type:none")
    const img = createElementWith("img", "src", book.img_url)
    const likeButton = createElementWith("button", "innerText", "Like")
    likeButton.addEventListener('click', () => likeBookListener(book, ul))
    renderUsers(book, ul)
    cardDiv.append(h2,img,p, titleP, ul, likeButton)
    element.appendChild(cardDiv)
}

function removeChildren(element){
    element.querySelectorAll("*").forEach( n => n.remove() )
}

function renderUsers(book, ulEl){
    removeChildren(ulEl)
    const users = book.users
    users.forEach( (user) => {
        addUser(user, ulEl)
    }) 
}

function addUser(user, ulEl){


    const li = createElementWith("li", "innerText", user.username)
    ulEl.appendChild(li)
    
}

function likeBookListener(book, ulEl){

    if (!hasUserLikedBook(book)){
        book.users.push({id:1, username: "pouros"}) 
    } else if (hasUserLikedBook(book)){
       book.users = book.users.filter( (user) => user.id !== 1)
    }
    
    const configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },

        body: JSON.stringify({
            users: book.users
        })
    }
     
    fetch(`${URL}/${book.id}`, configObj)
    .then(resp => resp.json())
    .then((book) => renderUsers(book, ulEl))
}

function hasUserLikedBook(book){
    return book.users.find( user => user.id === 1)
}


