const { response } = require('express');
const express= require('express')
const axios= require('axios')
const cheerio= require('cheerio')
const app=express();

const newspapers = [
    {
        name: 'yahoo',
        address: 'https://news.yahoo.com/tagged/climate-change/',
        base: ''
    },
    {
        name: 'nbc',
        address: 'https://www.nbcnews.com/climate-in-crisis',
        base: ''
    },
    {
        name: 'cbs',
        address: 'https://www.cbsnews.com/climate-change/',
        base: '',
    },
    {
        name: 'cnn',
        address: 'https://edition.cnn.com/specials/world/cnn-climate',
        base: '',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/climate',
        base: '',
    },
    {
        name: 'fox',
        address: 'https://www.foxnews.com/category/us/environment/climate-change',
        base: 'https://www.foxnews.com/',
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
        name: 'reuters',
        address: 'https://www.reuters.com/subjects/focus-climate-change',
        base: 'https://www.reuters.com',
    },
    {
        name: 'nasa',
        address: 'https://climate.nasa.gov/effects/',
        base: '',
    }
    
]

const articles = []
const websites=[]

newspapers.forEach(newspaper => {
    
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("climate")' || 'a:contains("climate-change")' , html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                
                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
        
})

app.get('/', (req, res) => {
    res.json('Welcome to my Climate Change News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})
app.get('/news/webistes',(req,res)=>{
    newspapers.forEach(newspaper => {
        websites.push({
            source: newspaper.name
        })
    })

    res.json(websites)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const curatedArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                curatedArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(curatedArticles)
        }).catch(err => console.log(err))
})
app.listen(8080,()=>{console.log("Server Sports  api Started");})