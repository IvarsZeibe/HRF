import "./NumberMemoryTest.css"
import { useEffect } from "react";

const NumberMemoryTest = () => {
    
    let numberArray = [];
    let time;
    let levelArray;
    let level;

    useEffect(() => {
        numberArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9));
        const header = document.querySelector(".header");
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
            startBtn.classList.remove("hide");
        };
      
        init();


        const startBtnClick = () => {
            header.classList.add("hide");
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
                    clearInterval(countdownTimer);
                } else {
                    time -= 1;
                }
            }, 1000)
        }

        inputField.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                compileArray();
                let inputText = inputField.value;
                userNumberDisplay.classList.remove("hide");
                arrayDisplay.classList.remove("hide");
                inputField.classList.add("hide");
                levelDisplay.classList.remove("hide")
                arrayDisplay.innerHTML = "Displayed numbers<br>" + levelArray;
                userNumberDisplay.innerHTML = "User input numbers<br>" + inputText;
                levelDisplay.innerHTML = "Level: " + level;
                if(JSON.stringify(inputText) == JSON.stringify(levelArray)) {
                    continueBtn.classList.remove("hide");
                } else {
                    resetBtn.classList.remove("hide");
                };
            }
        });

        const continueBtnClick = () => {
            level++;
            numberArray = Array.from({ length: 20 }, () => Math.floor(Math.random() * 9));
            header.classList.add("hide");
            startBtn.classList.add("hide");
            continueBtn.classList.add("hide");
            levelDisplay.classList.add("hide");
            userNumberDisplay.classList.add("hide");
            inputField.value = "";
            displayArray();

        }
        continueBtn.addEventListener("click", continueBtnClick)

    }, []);

    return (
        <div className="screen">
            <p className="header">Number Memory Test</p>
            <span className="arrayDisplay hide">{numberArray}</span>
            <span className="userNumberDisplay hide">Placeholder</span>
            <span className="levelDisplay hide">Level: {level}</span>
            <input type="text" className="inputField hide"></input>
            <button className="start">Start</button>
            <button className="continue hide">Continue</button>
            <button className="resetBtn hide" onClick={() => {window.location.reload()}}>Reset</button>
        </div>
    )

};

export default NumberMemoryTest;