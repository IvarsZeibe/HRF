import "./ReactionTest.css";
import { useEffect, useState } from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import BackendService from "../services/BackendService";

const ReactionTest = () => {
  const navigate = useNavigate();
  const [scoreIsSaved, setScoreIsSaved] = useState(false);
  const [reactionTime, setReactionTime] = useState();
  function save() {
    BackendService.addMyTestResult("ReactionTimeTest", {ReactionTime: reactionTime})
    .then(res => setScoreIsSaved(true))
    .catch(err => console.log(err));
  }

  useEffect(() => {
    const mainMenu = document.querySelector(".main-menu");
    const clickableArea = document.querySelector(".clickable-area");
    const message = document.querySelector(".clickable-area .message");
    const endScreen = document.querySelector(".end-screen");
    const reactionTimeText = document.querySelector(".end-screen .reaction-time-text");
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
      clickableArea.style.backgroundColor = "limegreen";
      message.innerHTML = "Click Now!";
      message.style.color = "#fff";
      greenDisplayed = true;
      timeNow = Date.now();
    };

    const startGame = () => {
      mainMenu.classList.remove("active");
      endScreen.classList.remove("active");
      clickableArea.classList.add("active");

      message.innerHTML = "Wait for the Green Color.";
      message.style.color = "#fff";
      clickableArea.style.backgroundColor = "#020c29";

      let randomNumber = Math.floor(Math.random() * 4000 + 3000);
      timer = setTimeout(setGreenColor, randomNumber);

      waitingForStart = false;
      waitingForGreen = true;
    };

    function mainMenuClick() {
      startGame();
    }
    mainMenu.addEventListener("click", mainMenuClick);

    const endGame = () => {
      endScreen.classList.add("active");
      clickableArea.classList.remove("active");
      clearTimeout(timer);

      let total = 0;

      scores.forEach((s) => {
        total += s;
      });

      let averageScore = Math.round(total / scores.length);
      console.log(averageScore);
      console.log(scores);
      setReactionTime(averageScore);
      setScoreIsSaved(false);

      reactionTimeText.innerHTML = `${averageScore} ms`;
    };
    
    const displayReactionTime = (rt) => {
      clickableArea.style.backgroundColor = "#020c29";
      message.innerHTML = `<div class='reaction-time-text'>${rt} ms</div>Click to continue.`;
      greenDisplayed = false;
      waitingForStart = true;
      scores.push(rt);

      if (scores.length >= 3) {
        endGame();
      }
    };

    const displayTooSoon = () => {
      clickableArea.style.backgroundColor = "#020c29";
      message.innerHTML = "Too Soon. Click to continue";
      message.style.color = "#fff";
      waitingForStart = true;
      clearTimeout(timer);
    };

    function clickableAreaClick() {
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
    }
    clickableArea.addEventListener("mousedown", clickableAreaClick);
    function playAgainBtnClick() {
      endScreen.classList.remove("active");
      init();
      startGame();
    }
    playAgainBtn.addEventListener("click", playAgainBtnClick);
    return () => {
      mainMenu.removeEventListener("click", mainMenuClick);
      clickableArea.removeEventListener("mousedown", clickableAreaClick);
      playAgainBtn.removeEventListener("click", playAgainBtnClick);
    };
  }, []);
    return (
      <>
        <div className="end-screen">
          <div className="container">
            <h1>Reaction Time Test</h1>
            <div className="reaction-time-text">234 ms</div>
            <button className="play-again-btn">Play Again</button>
            {!AuthenticationService.isSignedIn() && <button onClick={() => navigate("/signin")} className="play-again-btn">Sign in</button>}
            {AuthenticationService.isSignedIn() && !scoreIsSaved && <button onClick={save} className="play-again-btn">Save</button>}
          </div>
        </div>

        <div className="main-menu active">
          <div className="container">
            <h1>Reaction Time Test</h1>
            <p>Test measures an averge of three tries. Click as soon as you see the green color on the screen. Good luck!</p>
            <p>Click anywhere to start.</p>
          </div>
        </div>

        <div className="clickable-area bg-primary">
          <div className="message">Click Now!</div>
        </div>
      </>
    )
};
export default ReactionTest;