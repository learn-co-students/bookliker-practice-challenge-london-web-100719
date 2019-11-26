const listPanel = document.querySelector("#list-panel");
const bookList = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

const URL = "http://localhost:3000";
const BOOKS_URL = `${URL}/books`;
const USERS_URL = `${URL}/users`;

let user = { "id" : null, "username" : null }

const run = () => {
    getUserDetails(1);
    loadBooks();
}

const getUserDetails = (id) => {
    return processHTTPRequest(assignUserDetails,`${USERS_URL}/${id}`)
}

const assignUserDetails = (userData) => {
    return user =  { "id": userData.id, "username": userData.username }
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
    bookLi.addEventListener('click', bookClickHandler(book.id));
    return bookLi;
};

const bookClickHandler = (id) => e => {
    return processHTTPRequest(createBookPageElements, `${BOOKS_URL}/${id}`);
}

const createBookPageElements = (book) => {
    const bookContainer = renderElement("div");
    const title = renderElement("h1", book.title);
    const description = renderElement("p", book.description);
    const image = renderElement("img");
    const readList = renderElement("ul");

    let buttonText = "";
    hasUserAlreadyRead(book) ? buttonText = "Unlike Book": buttonText = "Like Book";
    const readButton = renderElement("button", buttonText);

    elements = [title, image, description, readButton, readList];

    image.src = book.img_url;
    image.height = 200;
    readList.classList.add("read-list");
    appendReadersToReadList(readList, book.users);
    readButton.addEventListener('click', updateReadListHandler(book, readButton));

    renderElementsToPage(elements, bookContainer)
}

const renderElement = (element, content = "") => {
    item = document.createElement(element);
    item.textContent = content;
    return item
}

const renderElementsToPage = (elements, bookContainer) => {
    bookContainer.append(...elements);
    while (showPanel.firstChild) showPanel.removeChild(showPanel.firstChild);
    showPanel.append(bookContainer);
}

const appendReadersToReadList = (readList, users) => {
    return users.map(user=> {
        const readLi = renderElement("li", user.username);
        readList.append(readLi);
    })
}

const updateReadListHandler = (book, button) => e => {
    if (hasUserAlreadyRead(book)) {
        removeUserFromList(book);
        button.textContent = "Like Book";
    } else {
        addNewReaderToList(book);
        button.textContent = "Unlike Book";
    }
    makePatchRequest(book, "PATCH");
}

const hasUserAlreadyRead = (book) => {
    return book.users.find(_user => _user.id === user["id"]);
}

const removeUserFromList = (book) => {
    return book.users = book.users.filter(_user => _user.id !== user["id"]);
}

const addNewReaderToList = (book) => book.users.push(user);

const makePatchRequest = (book, method) => {
    const configObj = generateConfigObj(book, method);
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