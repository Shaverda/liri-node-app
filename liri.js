const keys = require("./keys.js");

const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');
const fs = require('fs');

var command = process.argv[2];
var parameter = process.argv[3];

var init = () =>{
	if (command === "my-tweets") { tweet_logger(); }
	else if (command === "spotify-this-song") { spotify_search(); }
	else if (command === "movie-this") { movie_search(); }
	else if (command === "do-what-it-says") { file_reader(); }
	else {
		console.log("Not a valid liri parameter");
	}
}
var tweet_logger = () => {
    const params = { screen_name: 'ShelbyHaverda' };
    var client = new twitter(keys.twitterKeys);
    var data = client.get('statuses/user_timeline', params, function(error, tweets) {
        for (var i = 20; i > 0; i--) {
            if (tweets[i] == undefined) {
                console.log(`Error at ${i}; no such tweet exists bro. Tweet more.`)
                continue;
            }
            console.log(`"${tweets[i].text}" on ${tweets[i].created_at.substr(0, 19)}`);
        }
    });
}
var spotify_search = () => {
    var query_track = parameter || "The Sign Ace of Base";

    spotify.search({ type: 'track', query: query_track }, function(error, data) {
        if (error) {
            console.log(`Error occurred: ${error}.`);
            return;
        }
        console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
        console.log(`Song Name: ${data.tracks.items[0].name}`);
        console.log(`Song Preview: ${data.tracks.items[0].preview_url}`);
        console.log(`Album: ${data.tracks.items[0].album.name}`);
    })
}
var movie_search = () => {
    var query_movie = parameter || "Mr. Nobody";
    var query_url = `http://www.omdbapi.com/?t=${query_movie}&y=&plot=short&r=json`;
    request(query_url, function(error, response, body) {
    	body = JSON.parse(body);
        console.log(`Movie Title: ${body.Title}`);
        console.log(`Movie Year: ${body.Year}`);
        console.log(`IMDB Rating: ${body.imdbRating}`);
        console.log(`Country: ${body.Country}`);
        console.log(`Language(s): ${body.Language}`);
        console.log(`Country: ${body.Country}`);
        console.log(`Movie Plot: ${body.Plot}`);
        console.log(`Actors: ${body.Actors}`);
    })
}

var file_reader = () => {
	fs.readFile("./random.txt", function(error, data){
		if (error){
			return console.log(error);
		}
		data = data.toString() .split(',');
		
		command = data[0];
		parameter = data[1];

		init();
		//SHELBY FIX THIS SO THAT IT GETS CALLED
	})
}

init();


