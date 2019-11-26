document.addEventListener("DOMContentLoaded", function() {
    const leftPanel = document.getElementById("list-panel");
    const rightPanel = document.getElementById("show-panel");
    const ul = document.createElement("ul");


    fetch('http://localhost:3000/books')
    .then(function(response) {
      return response.json();
    }).then(function(result) {
      console.log(result);
      result.forEach(book => {
          const li = document.createElement("li");
          li.innerText = book.title;
         ul.appendChild(li);
         leftPanel.appendChild(ul);
         li.addEventListener("click", (event)=>{
            event.preventDefault();
            const header = document.createElement("h1");
            header.innerText = book.title;
            const image = document.createElement("img");
            image.src = book.img_url;
            const paragraph = document.createElement("p");
            paragraph.innerText = book.description;
            const button = document.createElement("button");
            button.innerText = "Read Book";
            rightPanel.appendChild(header);
            rightPanel.appendChild(image);
            rightPanel.appendChild(paragraph);
            rightPanel.appendChild(button);
            button.addEventListener("click", (event)=>{
                event.preventDefault();
                let formData = {
                    users: [...book.users, {id: 1, username: "pouros"}]
                  };
                  
                  let configObj = {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                    },
                    body: JSON.stringify(formData)
                  };
                  
                  fetch(`http://localhost:3000/books/${book.id}`, configObj)
                    .then(function(response) {
                      return response.json();
                    })
                    .then(function(object) {
                      console.log(object);
                    });
            } )
          } )
      });
    });
});










