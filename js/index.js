const BooksURL = "http://localhost:3000/books";

let bigDiv = document.querySelector('#show-panel')
let listPanel = document.querySelector("#list-panel")
let listPanelList = document.querySelector('#list')

document.addEventListener("DOMContentLoaded", function() {

    fetch(BooksURL)
        .then(res => res.json())
        .then(data => data.forEach(book => renderBook(book)) )

    function renderBook(book) {
        let newDiv = document.createElement('div')
        let newBigLi = document.createElement('li')

        let newH2 = document.createElement('h2')
        newH2.innerHTML = book.title

        let newP = document.createElement('p')
        newP.innerHTML = book.description
        newP.style.visibility = 'hidden';

        let newImg = document.createElement('img')
        newImg.src = book.img_url
        newImg.style.visibility = 'hidden';

        let newUl = document.createElement('ul')
        newUl.style.visibility = 'hidden';

        createLiForUser(book, newUl)

        let newButton = document.createElement('button')
        newButton.innerHTML = 'Like <3'
        newButton.style.visibility = 'hidden';

        newDiv.append(newH2, newP, newImg, newUl, newButton)
        bigDiv.append(newDiv)

        newH2.addEventListener('click', function(){
            newP.style.visibility = 'visible';
            newImg.style.visibility = 'visible';
            newUl.style.visibility = 'visible';
            newButton.style.visibility = 'visible';
        })

        newH2.addEventListener('dblclick', function(){
            newP.style.visibility = 'hidden';
            newImg.style.visibility = 'hidden';
            newUl.style.visibility = 'hidden';
            newButton.style.visibility = 'hidden';
        })

        if (book.users.includes({username:"pouros"})) {
            newButton.style.opacity = 0.5
            newButton.disabled = true;
        }

        newButton.addEventListener('click', () => patchBookLike(book, newUl))


        function patchBookLike(book, newUl) {
            // debugger
            book.users.push({"id":1, "username":"pouros"})

            fetch(`${BooksURL}/${book.id}`, {
                method: "PATCH",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(book)
            })
            .then(res => res.json())
            .then(book => createLiForUser(book, newUl)) 
        } 

        function createLiForUser(book, newUl) {
            newUl.innerHTML = '';
            book.users.forEach(function(user){
                let newLi = document.createElement('li')
                newLi.innerHTML = user.username
                newUl.appendChild(newLi)
            })
        }


    }

});
