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

const getUserDetails = (id) => {
    return processHTTPRequest(assignUserDetails,`${USERS_URL}/${id}`)
}

const assignUserDetails = (userData) => {
    return user =  {
        "id": userData.id,
        "username": userData.username
    }
}

const loadBooks = () => {
    return processHTTPRequest(renderBooksList, BOOKS_URL);
};

const renderBooksList = (booksData) => {
    return bookList.append(...generateBookListItems(booksData));
};

const generateBookListItems = (booksData) => {
    return booksData.map(book => renderBookListItem(book))
}

const renderBookListItem = (book) => {
    const bookLi = renderElement("li", book.title);
    bookLi.addEventListener('click', () => bookClickHandler(book.id));
    return bookLi;
};

const bookClickHandler = (id) => {
    return processHTTPRequest(createBookPageElements, `${BOOKS_URL}/${id}`);
}

const createBookPageElements = (book) => {
    const bookContainer = renderElement("div");
    const title = renderElement("h1", book.title);
    const description = renderElement("p", book.description);
    const readButton = renderElement("button", "Read Book");
    const image = renderElement("img");
    const readList = renderElement("ul");

    elements = [title, image, description, readList, readButton];

    image.src = book.img_url;
    readList.classList.add("read-list");
    appendReadersToReadList(readList, book.users);
    readButton.addEventListener('click', updateReadListHandler(book));

    renderElementsToPage(elements, bookContainer)
}

const renderElementsToPage = (elements, bookContainer) => {
    bookContainer.append(...elements);
    showPanel.innerHTML = "";
    showPanel.append(bookContainer);
}

const renderElement = (element, content = "") => {
    item = document.createElement(element);
    item.textContent = content;
    return item
}

const appendReadersToReadList = (readList, users) => {
    return users.map(user=> {
        const readLi = renderElement("li", user.username);
        readList.append(readLi);
    })
}

const updateReadListHandler = (book) => e => {
    if (hasUserAlreadyRead(book)) {
        return alert("you already read this");
    } else {
        addNewReaderToList(book);
        makePatchRequest(book, "PATCH");
    }
}

const hasUserAlreadyRead = (book) => {
    return book.users.find(users => users.id == user["id"]);
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

const processHTTPRequest = (callback, url, configObj = {}) => {
    return fetch(url, configObj)
    .then(res=>res.json())
    .then(data => callback(data));
}

run();




