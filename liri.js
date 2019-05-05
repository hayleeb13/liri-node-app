require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var moment = require("moment");

function getUserArguments() {
  return process.argv.slice(2);
}

var command = getUserArguments()[0];

searchTerm = getUserArguments()
  .slice(1)
  .join("+");

function errorFunction(respError) {
  if (respError) {
    return console.log("An error occured: ", respError);
  }
}

function buildMovieUrl(searchTerm) {
  return "http://www.omdbapi.com/?t=" + searchTerm + "&apikey=trilogy";
}

function buildBandUrl(searchTerm) {
  return (
    "https://rest.bandsintown.com/artists/" +
    searchTerm +
    "/events?app_id=codingbootcamp"
  );
}

function displayMovie(searchTerm) {
  if (searchTerm === "") {
    searchTerm = "Mr. Nobody";
  }

  axios.get(buildMovieUrl(searchTerm)).then(function(response) {
    console.log("Title: " + response.data.Title);
    console.log("Year: " + response.data.Year);
    console.log("IMDB Rating: " + response.data.imdbRating);
    console.log("Rotten Tomatoes: " + response.data.Ratings[1].value);
    console.log("Country: " + response.data.Country);
    console.log("Language: " + response.data.Language);
    console.log("Plot: " + response.data.Plot);
    console.log("Actors: " + response.data.Actors);
  });
}

function searchSong(searchTerm) {
  if (searchTerm === "") {
    searchTerm = "The Sign Ace of Base";
  }

  searchLimit = 5;

  var spotify = new Spotify(keys.spotify);
  spotify.search(
    { type: "track", query: searchTerm, limit: searchLimit },
    function(respError, response) {
      errorFunction(respError);

      var songResponse = response.tracks.items;

      for (let index = 0; index < songResponse.length; index++) {
        console.log("\n==== Spotify Search Result " + (index + 1) + " ====\n");
        console.log("Artist: " + songResponse[index].artists[0].name);
        console.log("Song title: " + songResponse[index].name);
        console.log("Album name: " + songResponse[index].album.name);
        console.log("URL Preview: " + songResponse[index].preview_url);
        console.log("\n========\n");
      }
    }
  );
}

function displayEvent() {
  if (searchTerm === "") {
    searchTerm = "Taylor Swift";
  }

  axios.get(buildBandUrl(searchTerm)).then(function(response) {
    var time = response.data[0].datetime;
    time = moment(time).format("MM/DD/YYYY");
    console.log("Name: " + response.data[0].venue.name);
    console.log("Location: " + response.data[0].venue.city);
    console.log("Date: " + time);
  });
}

function randomSearch() {
  fs.readFile("random.txt", "utf8", function(respError, data) {
    errorFunction(respError);
    var array = data.split(",");

    if (array[0] == "movie-this") {
      displayMovie(array[1]);
    } else if (array[0] == "spotify-this-song") {
      searchSong(array[1]);
    } else {
      displayEvent();
    }
  });
}

switch (command) {
  case "movie-this":
    displayMovie(searchTerm);
    break;
  case "spotify-this-song":
    searchSong(searchTerm);
    break;
  case "event-this":
    displayEvent(searchTerm);
    break;
  case "do-what-it-says":
    randomSearch();
    break;
}