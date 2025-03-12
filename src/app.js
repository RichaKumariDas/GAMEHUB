const path = require('path');
const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const app = express()

//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/gameList', (req, res) => {
    const jsonData = loadGames();
    res.render('gameList', {
        title: 'Game List',
        name: 'MyName',
        jsonData:jsonData
    })
})

app.get('/gameDetail', (req, res) => {
    const gameCode = req.query.gameCode;
    const jsonData = loadGames();
    const game = jsonData.find(game => game.gameCode === gameCode);

    if (game) {
        game.bought = game.bought + 1;
        saveGames(jsonData)
        res.render('gameDetail', {
            title: 'Game Detail',
            name: 'MyName',
            game: game
        });
    } else {
        res.render('gameDetail', {
            title: 'Game Not Found',
            name: 'MyName',
            game: null
        });
    }
});



const saveGames = function(games){
    const dataJSON = JSON.stringify(games)
    fs.writeFileSync('gameDB.json', dataJSON)
}

const loadGames = function(){
    try{
        const dataBuffer = fs.readFileSync('gameDB.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    }
    catch (e){
        return[]
    }
}

app.get('/add', (req, res) => {
    const gameCode = req.query.gameCode;
    const img = req.query.img;
    const title = req.query.title;
    const genre = req.query.genre;
    const about = req.query.about;
    const company = req.query.company;
    const rating = req.query.rating;
    const tournament = req.query.tournament;
    const price = req.query.price;
    const bought = req.query.bought;
    const wallpaper = req.query.wallpaper;
    const video = req.query.video;
    const SS1 = req.query.SS1;
    const SS2 = req.query.SS2;
    const SS3 = req.query.SS3;
    const SS4 = req.query.SS4;

    const games = loadGames();
    const duplicateGames = games.filter(function (game){
        return game.gameCode === gameCode;
    })

    if(duplicateGames.length === 0){
        games.push({
            gameCode: gameCode,
            img: img,
            title: title,
            genre: genre,
            about: about,
            company: company,
            rating: parseInt(rating),
            tournament: tournament,
            price: parseInt(price),
            bought: parseInt(bought),
            wallpaper: wallpaper,
            video: video,
            SS1: SS1,
            SS2: SS2,
            SS3: SS3,
            SS4: SS4
        })
        if(rating != null){
            saveGames(games)
        }
    }

    res.render('add', {
        title: 'Add Game',
        name: 'MyName'
    })
})

app.get('/remove', (req, res) => {
    const gameCode = req.query.gameCode;
    
    const games = loadGames();
    const gamesToKeep = games.filter((game) => game.gameCode !== gameCode)
    
    if(games.length > gamesToKeep.length){
        saveGames(gamesToKeep)
    }

    res.render('remove', {
        title: 'Remove Game',
        name: 'MyName',
        jsonData:games
    })
})


app.get('/about', (req, res) => {
    res.render('about', {
        title: 'ABOUT US',
        name: 'MyHelp'
    })
})

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'CONTACT US',
        name: 'MyHelp'
    })
})


app.get('/', (req, res) => {
    res.render('home', {
        title: 'HOME',
        name: 'MyHelp'
    })
})

app.listen(3000, () => {
    console.log('Server is up on port 3000.');
})
