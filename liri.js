require("dotenv").config();
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");

function getUserArguments() {
  return process.argv.slice(2);
}

function getSearchType() {
  return getUserArguments()[0];
}

searchTerm = getUserArguments()
  .slice(1)
  .join("+");

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

function displayMovie() {
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

function displayEvent() {
  axios.get(buildBandUrl(searchTerm)).then(function(response) {
    for (let index = 0; index < response.data.length; index++) {
      console.log("Name: " + response.data[index].venue.name);
      console.log("Location: " + response.data[index].venue.city);
      console.log("Date: " + response.data[index].datetime);
    }
  });
}

if (getSearchType() === "concert-this") {
  displayEvent();
}
if (getSearchType() === "movie-this" && searchTerm != "") {
  displayMovie();
} 
else {
  searchTerm = "Mr. Nobody";
  displayMovie();
}
