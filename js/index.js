//list-panel show a list of the books



const listPanel = document.querySelector("#list-panel");
const bookList = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

const URL = "http://localhost:3000";
const BOOKS_URL = `${URL}/books`;
const USERS_URL = `${URL}/users`;

let user = {
    "id" : null,
    "username" : null
}

const run = () => {
    getUserDetails(1);
    loadBooks();
}

const loadBooks = () => {
    return processHTTPRequest(renderBooksList, BOOKS_URL);
};

const getUserDetails = (id) => {
    return processHTTPRequest(assignUserDetails,`${USERS_URL}/${id}`)
}

const assignUserDetails = (userData) => {
    return user =  {
        "id": userData.id,
        "username": userData.username
    }
}

const renderBooksList = (booksData) => {
    return bookList.append(...generateBookListItems(booksData));
};

const generateBookListItems = (booksData) => {
    return booksData.map(book => renderBookListItem(book))
}

const renderBookListItem = (book) => {
    const bookLi = document.createElement("li");
    bookLi.textContent = book.title;
    bookLi.addEventListener('click', () => bookClickHandler(book.id));
    return bookLi;
};

const bookClickHandler = (id) => {
    return processHTTPRequest(renderBookPage, `${BOOKS_URL}/${id}`);
}

const renderBookPage = (book) => {
    showPanel.innerHTML = "";

    const bookContainer = document.createElement("div");

    const title = document.createElement("h1");
    title.textContent = book.title;

    const image = document.createElement("img");
    image.src = book.img_url;

    const description = document.createElement("p");
    description.textContent = book.description;

    const readList = document.createElement("ul");
    readList.classList.add("read-list");
    appendReadersToReadList(readList, book.users);
    
    const readButton = document.createElement("button");
    readButton.textContent = "Read Book";
    readButton.addEventListener('click', () => updateReadListHandler(book));

    bookContainer.append(title, image, description, readList, readButton);

    showPanel.append(bookContainer);
}

const appendReadersToReadList = (readList, users) => {
    return users.map(user=> {
        const readLi = document.createElement("li");
        readLi.textContent = user.username;
        readList.append(readLi);
    })
}

const updateReadListHandler = (book) => {
    if (hasUserAlreadyRead(book)) {
        return alert("you already read this");
    } else {
        addNewReaderToList(book);
        makePatchRequest(book, "PATCH");
    }
}

const addNewReaderToList = (book) => {
    return book.users.push(user);
}

const makePatchRequest = (book, method) => {
    configObj = generateConfigObj(book, method);
    return processHTTPRequest(updateReadList, `${BOOKS_URL}/${book.id}`, configObj)
}

const updateReadList = (book) => {
    const readList = document.querySelector(".read-list");
    readList.innerHTML = "";
    return appendReadersToReadList(readList, book.users);
}

const generateConfigObj = (book, method) => {
    return  {
        method: method,
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(book)
    }
}

const hasUserAlreadyRead = (book) => {
    return book.users.find(users => users.id == user["id"]);
}

const processHTTPRequest = (callback, url, configObj = {}) => {
    return fetch(url, configObj)
    .then(res=>res.json())
    .then(data => callback(data));
}

run();




