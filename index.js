const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const baseURL = 'https://www.zedy3d.com'

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/environment/climate-change',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/environment/climate-crisis',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/climate-change',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'cityam',
        address: 'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
        base: ''
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/environment',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/environment/climate-change',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'un',
        address: 'https://www.un.org/climatechange',
        base: '',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.co.uk/news/science_and_environment',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/topic/climate-change',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'sun',
        address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
        base: ''
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/climate-change/',
        base: ''
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
    res.json('Welcome to wine API')
})
app.get('/news', (req, res) => {
  res.json(articles)
})
app.get('/news/:newspaperid', (req, res) => {
    const newspaperid = req.params.newspaperid
    const newspaperAddress = newspapers.filter(newsPaper=>newsPaper.name == newspaperid)[0].address
    const newspaperBase = newspapers.filter(newsPaper=>newsPaper.name == newspaperid)[0].base
   
    axios.get(newspaperAddress)
    .then(response => {
        const html = response.data
        const payLoad = cheerio.load(html)
        const specificArticle = []

        payLoad('a:contains("climate")', html)
        .each(function(){
            const title = payLoad(this).text()
            const url = payLoad(this).attr('href')

            specificArticle.push({
                title,
                url: newspaperBase + url,
                source: newspaperid
            })
        })
        res.json(specificArticle)
    }).catch(err => {console.log(err);})
})


const PORT = 3001
app.listen(PORT, ()=> console.log(`server started on port ${PORT}`))