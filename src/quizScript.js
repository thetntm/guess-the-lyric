//Global Variables
/* 
Put all variables that will be usedthroughout the js file Here.
If Variables are used only in one function, declare them within that function's scope.
*/

//Values that will be commented out in the final product

let sampleLastFMRequestURL = "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=fb824c5191bba5f0fb691292f3402986&artist=cher&track=believe&format=json"

//Values that aren't reset when rebootData() is called:

let currentScore = 0;

let currentQuizIndex = 0; //index for number of questions the user has answered so far.

let maxQuizIndex = 9; //Max amount quizIndex can get to before going on to results;

let pastSongTitles = [];

let lastFMKey = "fb824c5191bba5f0fb691292f3402986";

let musicMatchToken = "c1f50a305f3f47234be0d4c3568ef5c9"

let musicMatchURL = `https://api.musixmatch.com/ws/1.1/?apikey=${musicMatchToken}&q_artist="Bieber"`

//Values that ARE reset when rebootData() is called:

let songLyricsAJAXFinished = false; //for checking if the Lyrics call has finished.

let lastFMAJAXFinished = false; //for checking if the lastFM call has finished.

let songLoaded = false; // Used to check if the song is being loaded. Important for button click events

let currentSong = null; // currently loaded song

let currentMusixmatchTrackID = null; // current musixmatch track id

let currentSongTitle = null; // current song title

let currentArtist = null; // current artist name

let currentLyrics = null; // currently loaded lyrics

let currentImageSrc = "";

let currentLastFMLink = "";

let correctAnswerIndex = null; //Used to determine which answer is the correct answer, randomly set when the song is loaded.

let correctAnswerText = ""; // text representing correct answer

//DOM Elements and Jquery Wrappers
/*
If a DOM Element or Jquery Wrapper is important to the project, declare it as a variable here.
*/

let quizContainerElem = $("#quiz-container");

let resultsContainerElem = $("#results-container");

let finalScoreElem = $("#final-score");

let songTitleElem = $("#song-title");

let lyricsDisplayElem = $("#lyrics-display");

let scoreDisplayElem = $("#score-display");

let songArtistElem = $("#song-artist");

let songAlbumCoverElem = $("#song-album-cover");

let lastFMDiv = $("#last-fm-div");

let songLastFMLink = $("#last-fm-link");

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

let backBtnElem = $("#go-back");

//Useful Functions
/*
This is where we will define functions that we may be calling often,
or that would be useful to have defined as functions instead of standard code.
*/

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function tryToLoadSong()
{
  if (songLyricsAJAXFinished && lastFMAJAXFinished)
  {
    loadSong();
  }
}

//Main function for updating what is shown on screen based on data from all the ajax calls. is run after the final ajax call returns.
function loadSong()
{
  // Get and Set lastfm data

  let currentParagraph = getRandomParagraph(currentLyrics);

  if (currentParagraph.length <= 1)
  {
    rebootData();
    return false;
  }

  let snippetPrompt = ""

  let finalIndex = 0;

  //Generate preview Snippet
  for (let i = 0; ((i < currentParagraph.length - 1) && (i < 3)); i++) {
    finalIndex++;
    snippetPrompt += "<p>"
    snippetPrompt += currentParagraph[i];
    snippetPrompt += "</p>";
  }

  // currentParagraph.forEach((el, ind, arr  => {
  //   //break
  // }))
  snippetPrompt += "<p>____________________?</p>"

  //Get correct answer
  correctAnswerIndex = getRandomInt(3);

  correctAnswerText = currentParagraph[finalIndex];

  //Get fake answers
  for (let i = 0; i < 4; i++) {
    if (i==correctAnswerIndex)
    {
      continue;
    }
    let newFakeAnswer = getRandomLine(currentLyrics);
    while (newFakeAnswer == correctAnswerText)
    {
      newFakeAnswer = getRandomLine(currentLyrics);
    }
    choiceSpanElems[i].text(newFakeAnswer);

  }

  //set JQ wrapper content
  lyricsDisplayElem.empty();
  lyricsDisplayElem.append(snippetPrompt);
  choiceSpanElems[correctAnswerIndex].text(correctAnswerText);
  songTitleElem.text(currentSongTitle);
  songArtistElem.text(currentArtist);

  songAlbumCoverElem.attr("src",currentImageSrc);
  songLastFMLink.attr("href",currentLastFMLink);

  songLoaded = true;
}

//Break up the text into an array
function getRandomParagraph(lyrics)
{
  let lyricsArray = lyrics.split("\n\n");
  let paragraphIndex = getRandomInt(lyricsArray.length - 1);
  let paragraph = lyricsArray[paragraphIndex].split("\n");
  return paragraph;
}

//Get a random line from the whole song
function getRandomLine(lyrics)
{
  //Format the string to remove double whitespace characters and replace them with single whitespace.
  while (lyrics.indexOf("\n\n") != -1)
  {
    lyrics = lyrics.replace("\n\n","\n");
  }
  let lyricsArray = lyrics.split("\n");
  let lyricIndex = getRandomInt(lyricsArray.length - 1);
  return lyricsArray[lyricIndex];
}

//AJAX Functions

// AJAX CALLS FOR LASTFM

function lastFMSuccess(data)
{
  lastFMAJAXFinished = true;
  if (data.error)
  {
    // give up onthe lastFM data and load the song as is
    console.log("an error occured with loading lastfm data!")
    lastFMDiv.css("display","none")
    tryToLoadSong();
    return;
  }
  lastFMDiv.css("display","block");

  let lastFMTrackData = data.track;

  currentLastFMLink = lastFMTrackData.url;

  if (lastFMTrackData.album)
  {
    currentImageSrc = lastFMTrackData.album.image[3]["#text"]
  }

  tryToLoadSong();
}

function lastFMError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}

function makeLastFMRequest()
{
  $.ajax({
    type: "GET",
    data: {
      api_key:lastFMKey,
      method:"track.getInfo",
      artist:currentArtist,
      track:currentSongTitle,
      format:"json"
    },
    url: "https://ws.audioscrobbler.com/2.0/",
    success: lastFMSuccess,
    error: lastFMError
  })
}


/// AJAX CALLS FOR MUSIXMATCH CHART DATA

function musixmatchChartsSuccess(data) {

  let trackList = data.message.body.track_list;
  currentSong = trackList[getRandomInt(trackList.length - 1)].track;
  currentMusixmatchTrackID = currentSong.track_id;
  currentSongTitle = currentSong.track_name;
  currentArtist = currentSong.artist_name;

  //Check to make sure this isn't a song the user has already been quized on
  if (pastSongTitles.includes(currentSongTitle))
  {
    rebootData()
    return;
  }
  // fetch lyrics for trackId
  makeMusixmatchLyricsRequest();

  // get lastFM data
  makeLastFMRequest();
}

function musixmatchChartsError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}

function makeMusixmatchChartsRequest()
{
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
}


// AJAX CALLS FOR MUSIXMATCH LYRICS DATA

function musixmatchLyricsSuccess(data)
{
  //get the lyrics and cut off the commercial part
  currentLyrics = data.message.body.lyrics.lyrics_body
  currentLyrics = currentLyrics.slice(0,currentLyrics.indexOf("...") - 1);
  songLyricsAJAXFinished = true;
  tryToLoadSong();
}

function musixmatchLyricsError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}

function makeMusixmatchLyricsRequest()
{
  $.ajax({
    type: "GET",
    data: {
      apikey:"c1f50a305f3f47234be0d4c3568ef5c9",
      track_id: currentMusixmatchTrackID,
      format:"jsonp",
      callback:"jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get",
    dataType: "jsonp",
    jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    success: musixmatchLyricsSuccess,
    error: musixmatchLyricsError})
}

function rebootData()
{

  songLyricsAJAXFinished = false;

  lastFMAJAXFinished = false;   

  songLoaded = false; // Used to check if the song is being loaded. Important for button click events

  currentSong = null; // currently loaded song

  currentMusixmatchTrackID = null; // current musixmatch track id

  currentSongTitle = null; // current song title
  
  currentArtist = null; // current artist name

  currentLyrics = null; // currently loaded lyrics

  correctAnswer = null; //Used to determine which answer is the correct answer, randomly set when the song is loaded.

  correctAnswerText = "";

  currentImageSrc = "";

  currentLastFMLink = "";

  makeMusixmatchChartsRequest();
}

//Code to run on correct answer selected.
function correctAnswerPicked()
{
  currentScore += 1;
  scoreDisplayElem.text(currentScore);
}

//Code to run on incorrect answer selected.
function incorrectAnswerPicked()
{

}

function endQuiz()
{
  finalScoreElem.text(currentScore * 10);
  quizContainerElem.css("display","none");
  resultsContainerElem.css("display","block");
}

//Event Functions
/*
This is where we will define functions that are called by event handlers,
Such as click methods for buttons
*/

function backButtonClicked()
{
    window.location.href = "./index.html";
}

function answerBtnClicked(event)
{
  if (!songLoaded)
  {
    return false;
  }
  const buttonClickedIndex = parseInt(event.target.id.slice(-1));
  if (choiceSpanElems[buttonClickedIndex].text() == correctAnswerText)
  {
    correctAnswerPicked();
  } else
  {
    incorrectAnswerPicked();
  }
  currentQuizIndex += 1;

  pastSongTitles.push(currentSongTitle);

  if (currentQuizIndex <= maxQuizIndex)
  {
    rebootData();
  } else
  {
    endQuiz()
  }
}

//Event Assignment
/*
This is where we will assign the events of various elements to their functions.
*/

for (let i = 0; i < btnElems.length; i++) {
  btnElems[i].click(answerBtnClicked);
}

backBtnElem.click(backButtonClicked);

//Code to run on Page load
/*
This is where we will put any code that needs to be run after the page has loaded.
*/

// fetch(musicMatchURL).then(res => console.log(res));

// get song list

rebootData();