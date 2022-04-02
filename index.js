const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const baseURL = 'https://www.zedy3d.com'

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/'
    },
    {
        name: 'thegardian',
        address: 'https://www.theguardian.com/us'
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/'
    }
]

const articles = []

newspapers.forEach(newspaper =>{
    axios.get(newspaper.address)
    .then(res => {
        const html = res.data
        const payLoad = cheerio.load(html)

        payLoad('a:contains("climate")', html)
        .each(function(){
            const title = payLoad(this).text()
            const url = payLoad(this).attr('href')

            articles.push({
                title,
                url,
                source: newspaper.name
            })
        })
    })
})

app.get('/', (req, res) => {
    res.json('Welcome')
})
app.get('/climate', (req, res) => {
  res.json(articles)
})


const PORT = 3001
app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))