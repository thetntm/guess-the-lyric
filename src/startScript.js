//--DOM Elements
let startBtnElem = $("#startBtn");

//--Event Functions
function startButtonClicked()
{
    window.location.href = "./quiz.html";
}

//--Event Assignment
startBtnElem.click(startButtonClicked);