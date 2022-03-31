'use strict';
let words = ["test", "hide", "laugh", "run", "drink", "difficult", "person", "spelling", "story", "screen"];
let chosenWord = "";

function speak(text) {
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
}
function getWord() {
    const url = "http://ashleygrobler04.pythonanywhere.com/";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            chosenWord = data.word;
        })
        .catch(function () {

        });
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