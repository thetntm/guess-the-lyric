//--DOM Elements
let startBtnElem = $("#startBtn");

//--Event Functions
function startButtonClicked()
{
    window.location.replace("./quiz.html");
}

//--Event Assignment
startBtnElem.click(startButtonClicked);