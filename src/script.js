
let musicMatchToken = "c1f50a305f3f47234be0d4c3568ef5c9"
let musicMatchURL = `https://api.musixmatch.com/ws/1.1/?apikey=${musicMatchToken}&q_artist="Bieber"`
let trackList
let trackId

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
  success: function(data) {
    console.log(data);
    console.log(data.message.body.track_list)
    trackList = data.message.body.track_list
    trackId = trackList[getRandomInt(trackList.length - 1)].track.track_id
    debugger
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  }
})

console.log(`trackId=${trackId}`)
// get lyrics
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
  success: function(data) {
    console.log(data);
    console.log(data.message.body.lyrics.lyrics_body)
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
    console.log(textStatus);
    console.log(errorThrown);
  }
})

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


//Global Variables
/* 
Put all variables that will be usedthroughout the js file Here.
If Variables are used only in one function, declare them within that function's scope.
*/

//DOM Elements and Jquery Wrappers
/*
If a DOM Element or Jquery Wrapper is important to the project, declare it as a variable here.
*/

//Useful Functions
/*
This is where we will define functions that we may be calling often,
or that would be useful to have defined as functions instead of standard code.
*/

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