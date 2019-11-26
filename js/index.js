const BOOKS_URL = 'http://localhost:3000/books';
const USERS_URL = 'http://localhost:3000/users';

const currentUser = {"id": 1, "username": "pouros"};

let allBooks = [];

document.addEventListener("DOMContentLoaded", () => {

	renderBooks();

});

let renderBooks = async () => {

	await fetch(BOOKS_URL)
	.then(res => res.json())
	.then(res => { listBookTitles(res) });

};

let listBookTitles = (bookList) => {

	const titleUL = document.querySelector('#list');

	for (book of bookList ) {

		let titleInUL = document.createElement('li');
		titleInUL.addEventListener('click', showBook);
		titleInUL.textContent = book.title;
		titleInUL.id = book.id;
		titleUL.append(titleInUL);
		allBooks.push(book);

	};

};

let showBook = (event) => {

	let targetId = -1;

	const container = document.querySelector('#show-panel');

	if (event instanceof MouseEvent) {

		targetId = event.target.id;

		container.innerHTML = '';

		let book = allBooks.find(book => book.id == targetId);

		let bookHeading = document.createElement('h2');
		let bookPicture = document.createElement('img');
		let bookDescrip = document.createElement('p');
		let bookReadBut = document.createElement('button');
		let bookReaders = document.createElement('h3');

		for (person of book.users) {

			bookReaders.textContent += person.username + " ";

		};

		bookHeading.textContent = book.title;
		bookPicture.src = book.img_url;
		bookDescrip.textContent = book.description;
		bookReadBut.textContent = 'Read Book';
		bookReadBut.id = book.id;

		bookReadBut.addEventListener('click', readBook);

		container.append(bookHeading, bookPicture, bookDescrip, bookReaders, bookReadBut);

	} else {

		targetId = event.url.split("/").slice(-1)[0];

		let book = allBooks.find(book => book.id == targetId);

		let listOfNames = container.getElementsByTagName('h3')[0];
		listOfNames.textContent = "";

		for (person of book.users) {

			listOfNames.textContent += person.username + " ";

		};

	};

};

let readBook = (event) => {

	let targetId = event.target.id;

	let book = allBooks.find(book => book.id == targetId);

	for (user of book.users) {

		if (user.id == currentUser.id) {

			alert("You've already read this book my guy");
			return;

		};

	};

	book.users.push(currentUser);

	let readerDataObj = {

		method: "PATCH",
		headers: {

			"Content-Type": "application/json"

		},
		body: JSON.stringify(

			{"users": book.users}

		)

	};

	fetch(`${BOOKS_URL}/${book.id}`, readerDataObj).then(showBook);

};