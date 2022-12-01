// import ReactionTest from "../ReactionTest.css";

const ReactionTest = () => {
    return (
        <>
            {/* <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Reaction Test</title>
                <link rel="stylesheet" href="style.css" />
            </head>
            <body>
                <div class="end-screen">
                <div class="container">
                    <h1>Reaction Time Test</h1>
                    <div class="reaction-time-text">234 ms</div>
                    <button class="play-again-btn">Play Again</button>
                </div>
                </div>
    
                <div class="main-menu active">
                <div class="container">
                    <h1>Reaction Time Test</h1>
                    <p>Click as soon as you see the green color on the screen.</p>
                    <p>Click anywhere to start.</p>
                </div>
                </div>
    
                <div class="clickable-area">
                <div class="message">Click Now!</div>
                </div>
            </body>
            </html> */}
        </>
    )
};
/*
const mainMenu = document.querySelector(".main-menu");
const clickableArea = document.querySelector(".clickable-area");
const message = document.querySelector(".clickable-area .message");
const endScreen = document.querySelector(".end-screen");
const reactionTimeText = document.querySelector(
  ".end-screen .reaction-time-text"
);
const playAgainBtn = document.querySelector(".end-screen .play-again-btn");

let timer;
let greenDisplayed;
let timeNow;
let waitingForStart;
let waitingForGreen;
let scores;

const init = () => {
  greenDisplayed = false;
  waitingForStart = false;
  waitingForGreen = false;
  scores = [];
};

init();

const setGreenColor = () => {
  clickableArea.style.backgroundColor = "#32cd32";
  message.innerHTML = "Click Now!";
  message.style.color = "#111";
  greenDisplayed = true;
  timeNow = Date.now();
};

const startGame = () => {
  clickableArea.style.backgroundColor = "#c1121f";
  message.innerHTML = "Wait for the Green Color.";
  message.style.color = "#fff";

  let randomNumber = Math.floor(Math.random() * 4000 + 3000);
  timer = setTimeout(setGreenColor, randomNumber);

  waitingForStart = false;
  waitingForGreen = true;
};

mainMenu.addEventListener("click", () => {
  mainMenu.classList.remove("active");
  startGame();
});

const endGame = () => {
  endScreen.classList.add("active");
  clearTimeout(timer);

  let total = 0;

  scores.forEach((s) => {
    total += s;
  });

  let averageScore = Math.round(total / scores.length);

  reactionTimeText.innerHTML = `${averageScore} ms`;
};

const displayReactionTime = (rt) => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = `<div class='reaction-time-text'>${rt} ms</div>Click to continue.`;
  greenDisplayed = false;
  waitingForStart = true;
  scores.push(rt);

  if (scores.length >= 3) {
    endGame();
  }
};

const displayTooSoon = () => {
  clickableArea.style.backgroundColor = "#faf0ca";
  message.innerHTML = "Too Soon. Click to continue";
  message.style.color = "#111";
  waitingForStart = true;
  clearTimeout(timer);
};

clickableArea.addEventListener("click", () => {
  if (greenDisplayed) {
    let clickTime = Date.now();
    let reactionTime = clickTime - timeNow;
    displayReactionTime(reactionTime);
    return;
  }

  if (waitingForStart) {
    startGame();
    return;
  }

  if (waitingForGreen) {
    displayTooSoon();
  }
});

playAgainBtn.addEventListener("click", () => {
  endScreen.classList.remove("active");
  init();
  startGame();
});
*/
export default ReactionTest;