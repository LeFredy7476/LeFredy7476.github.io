
const wordList = [];
const tempWordList = [];
const usedWord = [];
const fileloaderInput = document.querySelector("#fileloader");
const timerInput = document.querySelector("#timer");
const startbtn = document.querySelector("#start");
const stopbtn = document.querySelector("#stop");
const wordDisplay = document.querySelector("#word");
const clockDisplay = document.querySelector("#clock");
const winbtn = document.querySelector("#win");
const losebtn = document.querySelector("#lose");

var inGame = false;
var currentWord = "";
var remainingTime = 0;
var interval = null;
var wordWin = 0;
var wordLost = 0;



function getRandomWord() {
    if (tempWordList.length == 0) {
        endResult();
        return;
    }
    const randomIndex = Math.floor(Math.random() * tempWordList.length);
    const word = tempWordList.splice(randomIndex, 1)[0];
    currentWord = word;
    wordDisplay.innerHTML = word;
}

fileloaderInput.addEventListener("change", function(){
    const file = fileloaderInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        wordList.length = 0;
        const words = reader.result.split("\n");
        for (let i = 0; i < words.length; i++) {
            let w = words[i];
            w = w.trim();
            if (w != "") {
                wordList.push(w);
            }
        }
        console.log(wordList);
    });

    if (file) {
        reader.readAsText(file);
    }
})

function tickdown() {
    if (remainingTime == 0) {
        endResult();
    } else {
        remainingTime--;
        clockDisplay.innerHTML = `${remainingTime}`;
    }
}

startbtn.addEventListener("click", function(){
    tempWordList.length = 0;
    for (let i = 0; i < wordList.length; i++) {
        tempWordList.push(wordList[i]);
    }
    inGame = true;
    remainingTime = parseInt(timerInput.value);
    interval = window.setInterval(tickdown, 1000);
    clockDisplay.innerHTML = `${remainingTime}`;
    getRandomWord();
})
stopbtn.addEventListener("click", function(){
    endResult();
})

winbtn.addEventListener("click", function(){
    if (inGame) {
        wordWin += 1;
        getRandomWord();
    }
})
losebtn.addEventListener("click", function(){
    if (inGame) {
        wordLost += 1;
        getRandomWord();
    }
})

function endResult() {
    window.clearInterval(interval);
    inGame = false;
    clockDisplay.innerHTML = "Finished";
    wordDisplay.innerHTML = `Win: ${wordWin}, Lost: ${wordLost}`
}