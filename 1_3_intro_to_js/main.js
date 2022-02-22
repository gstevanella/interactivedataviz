console.log('hello world');


var counterVal = 0;

function incrementClick() {
    updateDisplay(++counterVal);
}

function resetCounter() {
    counterVal = 0;
    updateDisplay(counterVal);
}

function updateDisplay(val) {
    document.getElementById("counter-label").innerHTML = val;
}

const label = document.getElementById("new-label")
const input = document.getElementById ("new-input")
const button = document.getElementById ("new-submit")

let UserName;

function UserNameInput (){
UserName = input.value
label.innerText = "We know what your future holds " + UserName 
input.value = ""
}
