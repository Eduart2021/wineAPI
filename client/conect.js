const feedDisplay = document.querySelector('#feed')

fetch('http://localhost:3001/news')
.then(response => response.json())
.then(data => {
    data.forEach(article =>{
        const articleItem = `<div><h4>`+ article.title + `</h4><p>` + article.url + `</p></div>`
        feedDisplay.insertAdjacentHTML("beforeend", articleItem)
    })
    
})