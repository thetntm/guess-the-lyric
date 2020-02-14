//Global Variables
/* 
Put all variables that will be usedthroughout the js file Here.
If Variables are used only in one function, declare them within that function's scope.
*/

//Values that aren't reset when rebootData() is called:

let currentScore = 0;

let currentQuizIndex = 0; //index for number of questions the user has answered so far.

let maxQuizIndex = 9; //Max amount quizIndex can get to before going on to results;

let pastSongTitles = [];

let musicMatchToken = "c1f50a305f3f47234be0d4c3568ef5c9"

let musicMatchURL = `https://api.musixmatch.com/ws/1.1/?apikey=${musicMatchToken}&q_artist="Bieber"`

//Values that ARE reset when rebootData() is called:

let songLoaded = false; // Used to check if the song is being loaded. Important for button click events

let currentSong = null; // currently loaded song

let currentSongTitle = null; // current song title

let currentLyrics = null; // currently loaded lyrics

let correctAnswerIndex = null; //Used to determine which answer is the correct answer, randomly set when the song is loaded.

let correctAnswerText = "";

//DOM Elements and Jquery Wrappers
/*
If a DOM Element or Jquery Wrapper is important to the project, declare it as a variable here.
*/

let songTitleElem = $("#song-title");

let lyricsDisplayElem = $("#lyrics-display");

let scoreDisplayElem = $("#score-display");

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

function loadSong()
{

  let currentParagraph = getRandomParagraph(currentLyrics);

  if (currentParagraph.length <= 1)
  {
    rebootData();
    return false;
  }

  console.log(currentParagraph);

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
  snippetPrompt += "<p>_____</p>"

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
    console.log(newFakeAnswer);
    while (newFakeAnswer == correctAnswerText)
    {
      newFakeAnswer = getRandomLine(currentLyrics);
    }
    console.log(choiceSpanElems[i].text());
    choiceSpanElems[i].text(newFakeAnswer);

  }

  //set JQ wrapper content
  lyricsDisplayElem.append(snippetPrompt);
  choiceSpanElems[correctAnswerIndex].text(correctAnswerText);
  songTitleElem.text(currentSongTitle);

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

function musixmatchChartsSuccess(data) {

  let trackList = data.message.body.track_list;
  currentSong = trackList[getRandomInt(trackList.length - 1)].track;
  let trackId = currentSong.track_id;
  currentSongTitle = currentSong.track_name;

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
  //get the lyrics and cut off the commercial part
  currentLyrics = data.message.body.lyrics.lyrics_body
  currentLyrics = currentLyrics.slice(0,currentLyrics.indexOf("...") - 1);
  loadSong();
}

function musixmatchLyricsError(jqXHR, textStatus, errorThrown) {
  console.log(jqXHR);
  console.log(textStatus);
  console.log(errorThrown);
}

function rebootData()
{
  lyricsDisplayElem.empty();

  songLoaded = false; // Used to check if the song is being loaded. Important for button click events

  currentSong = null; // currently loaded song

  currentSongTitle = null; // current song title

  currentLyrics = null; // currently loaded lyrics

  correctAnswer = null; //Used to determine which answer is the correct answer, randomly set when the song is loaded.

  correctAnswerText = "";

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

//Event Functions
/*
This is where we will define functions that are called by event handlers,
Such as click methods for buttons
*/

function answerBtnClicked(event)
{
  if (!songLoaded)
  {
    return false;
  }
  const buttonClickedIndex = parseInt(event.target.id.slice(-1));
  console.log(buttonClickedIndex);
  if (choiceSpanElems[buttonClickedIndex].text() == correctAnswerText)
  {
    correctAnswerPicked();
  } else
  {
    incorrectAnswerPicked();
  }
  currentQuizIndex += 1;

  rebootData();
}

//Event Assignment
/*
This is where we will assign the events of various elements to their functions.
*/

for (let i = 0; i < btnElems.length; i++) {
  btnElems[i].click(answerBtnClicked);
}

//Code to run on Page load
/*
This is where we will put any code that needs to be run after the page has loaded.
*/

// fetch(musicMatchURL).then(res => console.log(res));

// get song list

rebootData();