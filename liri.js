require("dotenv").config();
var keys = require('./keys');
var Spotify = require('node-spotify-api');
var cTable = require('console.table');
var request = require('request');
var moment = require('moment');
var fs = require('fs');
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

function getBands(artist) {
    var queryURL = "http://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    request(queryURL, function (error, response, body) {
        if (error) console.log(error);
        var result  =  JSON.parse(body)[0];;
        console.log("Venue name " + result.venue.name);
        console.log("Venue location " + result.venue.city);
        console.log("Date of Event " +  moment(result.datetime).format("MM/DD/YYYY"));
    });
}
function getSongs(songName) {
    if (songName == undefined) {
        songName = "The sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: songName, limit: 10  }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var tableArray = [];
        for (var i = 0; i < data.tracks.items.length; i++ ) {
            var result = {
                artist : data.tracks.items[i].album.artists[0].name,
                album_name : data.tracks.items[i].album.name,
                song_name : data.tracks.items[i].name,
                preview_url : data.tracks.items[i].preview_url
            }
            tableArray.push(result);
        }
        var table = cTable.getTable(tableArray);
        console.log(table);
    });
}
function getMovies(movieName) {
    if (movieName == undefined) {
        movieName = "Mr. Nobody";
    }
    request('http://www.omdbapi.com/?i=tt3896198&apikey=55e8eecb&t=' + process.argv[3], function (error, response, body) {
        var result  =  JSON.parse(body);
        console.log("Title :" + result.Title);
        console.log("Year :" + result.Released);
        console.log("IMDB Rating :" + result.imdbRating );
        console.log("Rotten Tomatoes :" + result.Ratings[1].Value);
        console.log("Country :" +  result.Country);
        console.log("Language :" + result.Language);
        console.log("Movie Plot :" + result.Plot);
        console.log("Actors :" +  result.Actors);
    });
}
if (process.argv[2] == 'concert-this' ) {
    var artist = process.argv.slice(3).join(" ");
    console.log(artist);
    getBands(artist)
} else if ( process.argv[2] == 'spotify-this-song') {
    var songName = process.argv.slice(3).join(" ");
    getSongs(songName)
} else if ( process.argv[2] == 'movie-this') {
    var movieName = process.argv.slice(3).join(" ");
    getMovies(movieName)
} else if ( process.argv[2] == 'do-what-it-says') {
    console.log('do what it says')
    fs.readFile("random.txt", "utf8", function (err, data) {
        data = data.split(",");
        var action = data[0]
        var value = data[1]
        switch (action) {
            case "concert-this":
                getBands(value)
                break;
            case "spotify-this-song":
                getSongs(value)
                break;
            case "movie-this":
                getMovies(value)
                break;
            default:
                break;
        }
    })
}
