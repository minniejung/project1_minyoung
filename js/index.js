// DECLARATIONS : TIME
let startingTime = 3000; // Change here ★★★★★★★★★★ （100 = 1s, 3000 = 30s）
let count = startingTime;
let counter;

// DECLARATIONS : BUTTON
const startButton = document.getElementById('btnStart');
const tryAgainButton = document.getElementById('btnTryAgain');

// DECLARATIONS : GAME 
const nameResult = document.getElementById('result');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const myScore = document.querySelectorAll('.score');

// DECLARATIONS : SCORE & ENDING
const ending = document.getElementById('ending');
let score = 0;
let nameForRanking;
let scoreForRanking;

// DECLARATIONS : RANKING
const scoreBoard = document.querySelector('.scoreBoard');
const newOl = document.querySelector("#scoreOl");

// DECLARATIONS : AUDIO
const bgMusic = new Audio("music/whack_a_mole.mp3");
const startSound = new Audio("music/start.mp3");
const tapSound = new Audio("music/tap.mp3");
const yaySound = new Audio("music/yay.mp3");
const wahwahwahSound = new Audio("music/wahwahwah.mp3");
bgMusic.volume = 0.3;

// ⬇️⬇️⬇️⬇️⬇️ TIME COUNT DOWN ⬇️⬇️⬇️⬇️⬇️　///////////////////////////////////////////

function displayCount(count) {
   let tictoc = count / 100;
   document.getElementById("timer").innerHTML = tictoc.toPrecision(count.toString().length);
   clearInterval(counter);
   //console.log("counter", counter)
   counter = setInterval(timer, 10);
};

function timer() {
  if (count <= 0) {
     clearInterval(counter);
     return;
  }
  count--;
  displayCount(count);
};

// ⬇️⬇️⬇️⬇️⬇️ INPUT NAME & START ⬇️⬇️⬇️⬇️⬇️ /////////////////////////////////////////
let startGameEngaged = false;

startButton.addEventListener('click', () => {
  const newName = document.getElementById('inputName').value;
  nameResult.textContent = newName;
  nameForRanking = newName;

  if (!newName) alert ("Put your name please :)");
  else if(!startGameEngaged){
    startSound.play();
    bgMusic.play();
    bgMusic.loop = true;
    startGame();
    startGameEngaged = true;
  } 
});

function startGame() {
    peepMole();
    displayCount(startingTime);
    myScore.forEach(el => el.textContent = 0);
    startButton.innerHTML = 'Playing now!';
}

function resetGame() {
  count = startingTime; // Reset counttime
  score = ''; // Reset score
}

tryAgainButton.addEventListener('click', () => {
  ending.style.display='none'; // Hide the ending, none<->block;
  startSound.play();
  resetGame();
  startGame();
});

// ⬇️⬇️⬇️⬇️⬇️ WHAC A MOLE ⬇️⬇️⬇️⬇️⬇️ ////////////////////////////////////////////////

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min));
}

function randomHole(holes) {
  const randomHoleIndex = Math.floor(Math.random() * holes.length);
  const currentHole = holes[randomHoleIndex]; // Hole div number
  let priviousHole;
  if (currentHole === priviousHole) { 
    console.log('Same mole from the same hole');
    return randomHole(holes); // Pick one another random hole index
  }
  priviousHole = currentHole; // Declare current one to previous, for the loop
  return currentHole;
}

function peepMole() {
  const time = randomTime(300, 1500); // Change here ★★★★★★★★★★
  const hole = randomHole(holes);
  // console.log(time, hole);
  // console.log("this is the count ", count);

  if(count){ // Peeping up only when counttime is working!
    hole.classList.add("up");
    setTimeout(() => { // This is timeout for each mole's peep up time
      hole.classList.remove("up");
      peepMole();
    }, time);
  } else {
    ending.style.display='block'; // Pop up the ending screen when time is over, none<->block
    addScore();
  }
} 

// ⬇️⬇️⬇️⬇️⬇️ CLICK & GET THE POINT ⬇️⬇️⬇️⬇️⬇️ //////////////////////////////////////

moles.forEach(el => el.addEventListener('click', clickMole));

function clickMole(mole) {
  tapSound.play();
  
  if(mole.target.parentElement.classList.contains('up')) score ++;// Classname 'up' is on its parent div
  mole.target.parentElement.classList.remove('up'); // Remove its class = unclickable, no point 
  myScore.forEach(el => el.textContent = score * 10); // 2 score-divs have same value
  scoreForRanking = myScore[0].textContent; // 0 or 1 doesn't matter, it's the same
}

// ⬇️⬇️⬇️⬇️⬇️ LOCAL STORAGE & RANKING   ⬇️⬇️⬇️⬇️⬇️ /////////////////////////////////////////////////////////////

let newArrForLocalStorage = JSON.parse(localStorage.getItem("Score")) || [];
 
function addLi(el) {
  const newLi = document.createElement('li')
  newLi.innerHTML  = `${el.name} : <span>${el.score}</span>`;
  newOl.appendChild(newLi);
}

function addScore() {
  newOl.innerHTML = '';
  let personalScore = {name : nameForRanking, score : scoreForRanking || 0}
  newArrForLocalStorage.push(personalScore);
  let rankingArr = newArrForLocalStorage.sort((a, b) => b.score - a.score).slice(0, 10);
  
  localStorage.setItem("Score", JSON.stringify(rankingArr));
  rankingArr.forEach(el =>{
    addLi(el);
  })

  scoreForRanking = Number(myScore[0].textContent);
  const highestScore = Number(newOl.children[0].getElementsByTagName("span")[0].innerHTML);
  // console.log(typeof scoreForRanking, typeof highestScore );
  const finalMsg = document.querySelector('.finalMsg')
  // console.log(scoreForRanking, highestScore);
  if (highestScore <= scoreForRanking) {
    finalMsg.innerHTML = `Congratulations !<br>You got the highest score !`;
    bgMusic.pause();
    yaySound.play();
    yaySound.currentTime = 1;
  } else {
    finalMsg.innerHTML = `Well done ! Try again ?`;
    bgMusic.pause();
    wahwahwahSound.play();
  }
 }

window.addEventListener('load', () => { // Storage will still stay after refreshing
  let newArr = newArrForLocalStorage.sort((a, b) => b.score - a.score).slice(0, 10);
  newArr.forEach((el) => {
    addLi(el);
  });
});