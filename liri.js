//global variables
var twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var fs = require('fs');
var keys = require('./keys.js');
var commands = process.argv[2];
var value = process.argv;
var songTitle = "";
var songStuff;
var songInfo;
var movieTitle = "";
var movieInfo;
var dataArray = [];

//different commands
switch(commands){
    case 'my-tweets':
        tweets();
        break;

    case 'spotify-this-song':
        song();
        break;

    case 'movie-this':
        movie();
        break;

    case 'do-what-it-says':
        doSomething();
        break;
}

//twitter function
function tweets() {
    var client = new twitter(keys.twitterKeys);
    var params = {screen_name: 'kimchi_libra'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            fs.appendFile('log.txt', commands + "\n");
            for (var i = 0; i<20; i++) {
                console.log(tweets[i].created_at + ": " + tweets[i].text);
                console.log("------------------------------");
                // fs.appendFile('log.txt', commands + "\n" + tweets[i].created_at + ": " + tweets[i].text + "\n");
                //appending to log.txt
                fs.appendFile('log.txt', tweets[i].created_at + ": " + tweets[i].text + "\n");
            }
        console.log("Tweets have been added to log.txt");
        }
    });
};

//spotify function
function song() {
	//getting user input
    for (var i=3; i<value.length; i++){
        if (i>3 && i< value.length){
            songTitle = songTitle + "+" + value[i];
        }
        else {
            songTitle = songTitle + value[i];
        }
    }
    //default if no song is listed by user
    if (!songTitle) {
        // songTitle = "The Sign by Ace of Base";
        songTitle = "The Sign";
        spotify.search({ type: 'track', query: songTitle }, function(err, data) {
            songStuff = data.tracks.items[6];
            songInfo = "Artist: " + songStuff.artists[0].name + "\n" + "Song: " + songStuff.name + "\n" + "Album: " + songStuff.album.name + "\n" + "Preview link: " + songStuff.preview_url + "\n";
            console.log(songInfo);
            //appending to log.txt
            fs.appendFile('log.txt', commands + "\n" + songInfo + "\n");
            console.log("'The Sign' by Ace of Base song information has been added to log.txt");
        });
        return;
    }
    // console.log(songTitle);
        spotify.search({ type: 'track', query: songTitle }, function(err, data) {
            if ( err ) {
                console.log('Error occurred: ' + err);
                return;
            } 
            fs.appendFile('log.txt', commands + "\n");
            // for (var i=0; i<data.tracks.items.length; i++) {
            songStuff = data.tracks.items[0];
            // songStuff = data.tracks.items[i];
            songInfo = "Artist: " + songStuff.artists[0].name + "\n" + "Song: " + songStuff.name + "\n" + "Album: " + songStuff.album.name + "\n" + "Preview link: " + songStuff.preview_url + "\n";
            console.log(songInfo);
            //appending to log.txt
            fs.appendFile('log.txt', songInfo + "\n");
            // }
            console.log("Song information has been added to log.txt");
        });
};

//omdb function
function movie() {
	//getting user input
    for (var i=3; i<value.length; i++){
        if (i>3 && i< value.length){
            movieTitle = movieTitle + "+" + value[i];
        }
        else {
            movieTitle = movieTitle + value[i];
        }
    }
    //default if no user input
    if (!movieTitle) {
    movieTitle = "Mr. Nobody";
    }
    var url = 'http://www.omdbapi.com/?t=' + movieTitle +'&y=&plot=short&tomatoes=true&r=json';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        // console.log(JSON.parse(body));
        movieInfo = "Title: " + JSON.parse(body).Title + "\n" +
                    "Year: " + JSON.parse(body).Year + "\n" +
                    "IMDB Rating: " + JSON.parse(body).imdbRating + "\n" +
                    "Country: " + JSON.parse(body).Country + "\n" +
                    "Language: " + JSON.parse(body).Language + "\n" +
                    "Plot: " + JSON.parse(body).Plot + "\n" +
                    "Actors: " + JSON.parse(body).Actors + "\n" +
                    "Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating + "\n" +
                    "Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL + "\n";
        console.log(movieInfo);
        //appending to log.txt
        fs.appendFile('log.txt', commands + "\n" + movieInfo + "\n");
        console.log("Movie information has been added to log.txt");
    }
});
}

//do what it says function
function doSomething() {
    fs.readFile("random.txt", "utf8", function(error, data){
        console.log(data);
        dataArray = data.split(',');
        songTitle = dataArray[1];
        song(songTitle);
    });
}
