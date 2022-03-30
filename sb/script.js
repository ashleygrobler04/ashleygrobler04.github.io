'use strict';
let words = ["test", "hide", "laugh", "run", "drink", "difficult", "person", "spelling", "story", "screen"];
let chosenWord = "";

function speak(text) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}

//A function to generate random numbers between a given range in js.
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getWord() {
    return words[random(0, words.length - 1)];
}

function checkWord(input, word) {
    if (input == word) {
        alert("Great spelling!");
        document.getElementById("input").value = "";
        chosenWord = getWord();
    }
    else {
        alert("Please try again.");
        document.getElementById("input").value = "";
    }
}

function spellWord() {
    for (let i = 0; i < chosenWord.length; i++) {
        speak(chosenWord[i]);
    }
}
chosenWord = getWord();