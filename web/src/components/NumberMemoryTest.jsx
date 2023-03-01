import "./NumberMemoryTest.css"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import BackendService from "../services/BackendService";

const NumberMemoryTest = () => {
    const navigate = useNavigate();
    const [digitCount, setDigitCount] = useState(1);
    const [scoreIsSaved, setScoreIsSaved] = useState(false);
    let numberArray = [];
    let time;
    let levelArray;
    let level;

    useEffect(() => {
        numberArray = Array.from({ length: 20 }, () => Math.floor((Math.random() * 100) % 10));
        const header = document.querySelector(".header");
        const tutorial = document.getElementById("tutorial");
        const arrayDisplay = document.querySelector(".arrayDisplay");
        const startBtn = document.querySelector(".start");
        const inputField = document.querySelector(".inputField");
        const continueBtn = document.querySelector(".continue");
        const resetBtn = document.querySelector(".resetBtn");
        const userNumberDisplay = document.querySelector(".userNumberDisplay");
        const levelDisplay = document.querySelector(".levelDisplay");
        let level = 1;

        const init = () => {
            header.classList.remove("hide")
            tutorial.classList.remove("hide")
            startBtn.classList.remove("hide");
        };
      
        init();


        const startBtnClick = () => {
            header.classList.add("hide");
            tutorial.classList.add("hide")
            startBtn.classList.add("hide");
            displayArray();
        }
        startBtn.addEventListener("click", startBtnClick)

        const compileArray = () => {
            levelArray = [];
            for (let i = 0; i < level; i++) {
                levelArray.push(numberArray[i])
            }
            levelArray = levelArray.join("");
        }

        const displayArray = () => {
            time = 4;
            arrayDisplay.classList.remove("hide");
            compileArray();
            arrayDisplay.innerHTML = levelArray;
            let countdownTimer = setInterval(function() {
                if (time <= 0) {
                    arrayDisplay.classList.add("hide");
                    inputField.classList.remove("hide");
                    inputField.focus();
                    clearInterval(countdownTimer);
                } else {
                    time -= 1;
                }
            }, 1000)
        }

        function onKeyUp(event) {
            if (event.keyCode === 13) {
                compileArray();
                let inputText = inputField.value;
                userNumberDisplay.classList.remove("hide");
                arrayDisplay.classList.remove("hide");
                inputField.classList.add("hide");
                levelDisplay.classList.remove("hide")
                arrayDisplay.innerHTML = "Displayed<br>" + levelArray;
                userNumberDisplay.innerHTML = "User input<br>" + inputText;
                levelDisplay.innerHTML = "Level: " + level;
                if(JSON.stringify(inputText) == JSON.stringify(levelArray)) {
                    continueBtn.classList.remove("hide");
                    setDigitCount(level);
                } else {
                    resetBtn.parentElement.classList.remove("hide");
                    setDigitCount(level - 1);
                };
            }
        }
        inputField.addEventListener("keyup", onKeyUp);

        const continueBtnClick = () => {
            level++;
            numberArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9));
            header.classList.add("hide");
            tutorial.classList.add("hide");
            startBtn.classList.add("hide");
            continueBtn.classList.add("hide");
            levelDisplay.classList.add("hide");
            userNumberDisplay.classList.add("hide");
            inputField.value = "";
            displayArray();

        }
        continueBtn.addEventListener("click", continueBtnClick)

        return () => {
            startBtn.removeEventListener("click", startBtnClick)
            inputField.removeEventListener("keyup", onKeyUp)
            continueBtn.removeEventListener("click", continueBtnClick)
        }
    }, []);

    function save() {
        BackendService.addMyTestResult("NumberMemoryTest", { DigitCount: digitCount })
        .then(res => setScoreIsSaved(true))
        .catch(err => console.log(err));
    }

    return (
        <div className="screen">
            <p className="header">Number Memory Test</p>
            <span className="arrayDisplay hide">{numberArray}</span>
            <span className="userNumberDisplay hide">Placeholder</span>
            <span className="levelDisplay hide">Level: {level}</span>
            <input type="text" className="inputField hide"></input>
            <button className="start">Start</button>
            <div id="tutorial">
                Remember the number on screen. After it disappears input the number. You get to the next level if the number is correct. Good luck!
            </div>
            <button className="continue hide">Continue</button>
            <div className="hide">
                <button className="resetBtn" onClick={() => {window.location.reload()}}>Reset</button>
                {!AuthenticationService.isSignedIn() && <button onClick={() => navigate("/signin")} className="play-again-btn">Sign in</button>}
                {AuthenticationService.isSignedIn() && !scoreIsSaved && <button onClick={save} className="play-again-btn">Save</button>}
            </div>
        </div>
    )

};

export default NumberMemoryTest;