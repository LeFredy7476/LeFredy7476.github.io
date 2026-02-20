const wordList = [];
const tempWordList = [];
const usedWords = [];
const fileloaderInput = document.querySelector("#fileloader");
const timerInput = document.querySelector("#timer");
const startbtn = document.querySelector("#start");
const wordDisplay = document.querySelector("#word");
const wordCountDisplay = document.querySelector("#wordcount");
const clockDisplay = document.querySelector("#clock");
const winbtn = document.querySelector("#win");
const losebtn = document.querySelector("#lose");

var inGame = false;
var currentWord = "";
var remainingTime = 0;
var interval = null;
var winCount = 0;
var lostCount = 0;

const winAudio = new Audio("maximize_006.ogg");
const loseAudio = new Audio("minimize_006.ogg");
const endAudio = new Audio("scroll_003.ogg");

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

function readWords() {
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
        // console.log(wordList);
        wordCountDisplay.innerHTML = `${wordList.length} words`
    });

    if (file) {
        reader.readAsText(file);
    }
}

fileloaderInput.addEventListener("change", readWords);

function tickdown() {
    if (remainingTime == 0) {
        endAudio.play();
        endResult();
    } else {
        remainingTime--;
        clockDisplay.innerHTML = `${remainingTime}`;
    }
}

startbtn.addEventListener("click", function(){
    if (!inGame) {
        if (wordList.length == 0) {
            return readWords();
        }
        tempWordList.length = 0;
        usedWords.length = 0;
        for (let i = 0; i < wordList.length; i++) {
            tempWordList.push(wordList[i]);
        }
        inGame = true;
        winCount = 0;
        lostCount = 0;
        remainingTime = parseInt(timerInput.value);
        if (isNaN(remainingTime)) {
            remainingTime = 60;
            timerInput.value = 60;
        }
        interval = window.setInterval(tickdown, 1000);
        clockDisplay.innerHTML = `${remainingTime}`;
        getRandomWord();
    } else {
        endResult();
    }
});

winbtn.addEventListener("mousedown", function(){
    if (inGame) {
        winAudio.pause();
        winAudio.currentTime = 0;
        winAudio.play();
        usedWords.push({
            win: true,
            word: currentWord
        });
        winCount += 1;
        getRandomWord();
    }
});

losebtn.addEventListener("mousedown", function(){
    if (inGame) {
        loseAudio.pause();
        loseAudio.currentTime = 0;
        loseAudio.play();
        usedWords.push({
            win: false,
            word: currentWord
        });
        lostCount += 1;
        getRandomWord();
    }
});

function endResult() {
    window.clearInterval(interval);
    inGame = false;
    clockDisplay.innerHTML = "Finished";
    const score = `Win: ${winCount}, Lost: ${lostCount}`;
    var list = '<div id="list">';
    for (let i = 0; i < usedWords.length; i++) {
        const entry = usedWords[i];
        list += `<span win="${entry.win}">${entry.word}</span>`;
    }
    list += `<span>${currentWord}</span>`
    list += "</div>";
    wordDisplay.innerHTML = score + list;
}


var fullscreen = Document.fullscreenElement ? true : false;
function toggleFullscreen() {
    if (fullscreen) {
        document.exitFullscreen();
        fullscreen = false;
        return;
    }
    document.body.parentElement.requestFullscreen();
    fullscreen = true;
}