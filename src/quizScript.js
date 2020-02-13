//Global Variables
/* 
Put all variables that will be usedthroughout the js file Here.
If Variables are used only in one function, declare them within that function's scope.
*/

let songLoaded = false; // Used to check if the song is being loaded. Important for button click events

let currentSong = null; // currently loaded song

let currentLyrics = null; // currently loaded lyrics

let correctAnswer = 0; //Used to determine which answer is the correct answer, randomly set when the song is loaded.

let musicMatchToken = "c1f50a305f3f47234be0d4c3568ef5c9"
let musicMatchURL = `https://api.musixmatch.com/ws/1.1/?apikey=${musicMatchToken}&q_artist="Bieber"`

//DOM Elements and Jquery Wrappers
/*
If a DOM Element or Jquery Wrapper is important to the project, declare it as a variable here.
*/

let songTitleElem = $("#song-title");

let lyricsDisplayElem = $("#lyrics-display");

let btnElems = 
[
  $("#button-0"),
  $("#button-1"),
  $("#button-2"),
  $("#button-3")
];

let choiceSpanElems = 
[
  $("#choice-0"),
  $("#choice-1"),
  $("#choice-2"),
  $("#choice-3")
];

//Useful Functions
/*
This is where we will define functions that we may be calling often,
or that would be useful to have defined as functions instead of standard code.
*/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function updateSongTitle()
{
  songTitleElem.text(currentSong.track_name);
}

function loadSong()
{
  console.log(getRandomParagraph(currentLyrics));
}

//Break up the text into an array
function getRandomParagraph(lyrics)
{
  //cut off the commercial part
  console.log(lyrics.indexOf("..."))
  lyrics = lyrics.slice(0,lyrics.indexOf("...") - 1);
  lyricsArray = lyrics.split("\n\n");
  let paragraphIndex = getRandomInt(lyricsArray.length - 1);
  let paragraph = lyricsArray[paragraphIndex].split("\n");
  return paragraph;
}

//AJAX Functions

function musixmatchChartsSuccess(data) {

  let trackList = data.message.body.track_list
  currentSong = trackList[getRandomInt(trackList.length - 1)].track
  let trackId = currentSong.track_id

  updateSongTitle();

  console.log(currentSong);

  // fetch lyrics for trackId
  $.ajax({
    type: "GET",
    data: {
      apikey:"c1f50a305f3f47234be0d4c3568ef5c9",
      track_id: trackId,
      format:"jsonp",
      callback:"jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    success: musixmatchLyricsSuccess,
    error: musixmatchLyricsError
  })
}

function musixmatchChartsError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}


function musixmatchLyricsSuccess(data)
{
  currentLyrics = data.message.body.lyrics.lyrics_body;
  loadSong()
}

function musixmatchLyricsError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}

//Event Functions
/*
This is where we will define functions that are called by event handlers,
Such as click methods for buttons
*/

//Event Assignment
/*
This is where we will assign the events of various elements to their functions.
*/

//Code to run on Page load
/*
This is where we will put any code that needs to be run after the page has loaded.
*/

// fetch(musicMatchURL).then(res => console.log(res));

// get song list

$.ajax({
  type: "GET",
  data: {
    apikey:"c1f50a305f3f47234be0d4c3568ef5c9",
    country: "US",
    page_size: "50",
    format:"jsonp",
    callback:"jsonp_callback"
  },
  url: "https://api.musixmatch.com/ws/1.1/CHART.TRACKS.GET",
  dataType: "jsonp",
  jsonpCallback: 'jsonp_callback',
  contentType: 'application/json',
  success: musixmatchChartsSuccess,
  error: musixmatchChartsError
})