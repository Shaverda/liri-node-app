const keys = require("./keys.js");

const twitter = require('twitter');
const spotify = require('spotify');
const request = require('request');
const fs = require('fs');

var command = process.argv[2];
var parameter = process.argv[3];

var init = () => {
	if (parameter != undefined){ command_log("\n" + command + " "+ parameter);}
	else {command_log("\n\n" + command);}
	
	switch(command){
		case "my-tweets": 
			tweet_logger(); break;
		case "spotify-this-song": 
			spotify_search(); break;
		case "movie-this":
			movie_search(); break;
		case "do-what-it-says":
			file_reader(); break;
		default:
			console.log("Not a valid liri command");
	}
}
var tweet_logger = () => {
    const params = { screen_name: 'ShelbyHaverda' };
    var client = new twitter(keys.twitterKeys);
    var data = client.get('statuses/user_timeline', params, function(error, tweets) {
    	var tweets_array = [];
        for (var i = 20; i > 0; i--) {
            if (tweets[i] == undefined) {
                console.log(`Error at ${i}; no such tweet exists bro. Tweet more.`)
                continue;
            }
            var data = `"${tweets[i].text}" on ${tweets[i].created_at.substr(0, 19)}`;
            console.log(data);
            tweets_array.push(data);
        }
        command_log("\n" + tweets_array.toString());
    });
}
var spotify_search = () => {
    var query_track = parameter || "The Sign Ace of Base";

    spotify.search({ type: 'track', query: query_track }, function(error, data) {
        if (error) {
            console.log(`Error occurred: ${error}.`);
            return;
        }

        var data = `Artist: ${data.tracks.items[0].artists[0].name}\nSong Name: ${data.tracks.items[0].name} \nSong Preview: ${data.tracks.items[0].preview_url} \nAlbum: ${data.tracks.items[0].album.name}`
        console.log(data);
        command_log(`\n${data}`);
    })
}
var movie_search = () => {
    var query_movie = parameter || "Mr. Nobody";
    var query_url = `http://www.omdbapi.com/?t=${query_movie}&y=&plot=short&tomatoes=true&r=json`;
    request(query_url, function(error, response, body) {
    	body = JSON.parse(body);
    	var data = `Movie Title: ${body.Title} \nMovie Year: ${body.Year} \nIMDB Rating: ${body.imdbRating} \nCountry: ${body.Country} \nLanguage(s): ${body.Language} \nMovie Plot: ${body.Plot} \nActors: ${body.Actors} \nRotten Tomatoes: ${body.tomatoRating} \nRotten Tomatoes url: ${body.tomatoURL}`
    	console.log(data);
    	command_log(`\n${data}`);
    })
}

var command_log = (data) => {
	fs.appendFile('log.txt', data, (err) => {
		if (err) throw err;
	});
}

var file_reader = () => {
	fs.readFile("./random.txt", (error, data) => {
		if (error){
			return console.log(error);
		}
		data = data.toString().split(',');
		command = data[0];
		parameter = data[1];
		init();
	})
}

init();


