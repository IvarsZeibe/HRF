import "./AimTest.css";
import { useEffect, useState, useRef } from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import BackendService from "../services/BackendService";

const AimTest = () => {

    const dataFetchedRef = useRef(false);

    useEffect(() => {

        // Prevents the JS running twice
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        const startBtn = document.querySelector('#start')
        const screens = document.querySelectorAll('.screen')
        const targetsEl = document.querySelector('#targets')
        const secondsEl = document.querySelector('#seconds')
        const board = document.querySelector('#board')

        const colors = ['#1abc9c', '#4efc53', '#3498db', '#9b59b6', '#ff3f34', '#f1c40f', '#f57e33', '#48dbfb']

        var seconds = '00'; 
        var tens = '00';
        var appendTens = document.getElementById("tens")
        var appendSeconds = document.getElementById("seconds")
        var targetCount = 10;
        let accuracy;
        var missedTargets = 0;
        var targetsClicked = 0;
        var Interval;

        startBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            screens[0].classList.add('up')
            startGame();
            targetsClicked = 0;
            missedTargets = 0;
            clearInterval(Interval);
            Interval = setInterval(startTimer, 10);
            tens = "00";
            seconds = "00";
            appendTens.innerHTML = tens;
            appendSeconds.innerHTML = seconds;
        })

        board.addEventListener('click', (event) => {
            event.stopPropagation();
            if (event.target.classList.contains('circle')) {
                targetsClicked++;
                setTargets();
                createRandomCircles();
                event.target.remove();
            } 
            else if (event.target.classList.contains('board')) {
                missedTargets++;
            }
        })

        function startTimer () {
            tens++; 
            
            if(tens <= 9){
                appendTens.innerHTML = "0" + tens;
            }
            
            if (tens > 9){
                appendTens.innerHTML = tens;
                
            } 
            
            if (tens > 99) {
                seconds++;
                appendSeconds.innerHTML = "0" + seconds;
                tens = 0;
                appendTens.innerHTML = "0" + 0;
            }
            
            if (seconds > 9){
                appendSeconds.innerHTML = seconds;
            }

            increaseTime();

        }

        function startGame() {
            createRandomCircles();
        }

        function increaseTime() {
            if (targetsClicked >= targetCount) {
                finishGame();
                clearInterval(Interval);
            }
        }

        function setTargets(value) {
            targetsEl.innerHTML = targetCount - targetsClicked;
        }

        function finishGame() {
            accuracy = Math.round((targetCount / (targetCount + missedTargets)) * 100, 2);
            targetsEl.parentNode.classList.add('hide');
            secondsEl.parentNode.classList.add('hide');
            board.innerHTML = `
            <h1>Time: 
            <span class="primary">${seconds}.${tens}s</span>
            Accuracy: 
            <span class="primary">${accuracy}%</span>
            </h1>
            <button class="time-btn" onclick="window.location.reload()">Restart</button>
            <button class = "time-btn">Sign In</button>
            `
        }

        function createRandomCircles() {
            const circle = document.createElement('div')
            let size
            if (document.body.clientWidth <= 516) {
                size = getRandomNumber(15, 30)
            } 
            else if (document.body.clientWidth <= 320) {
               size = getRandomNumber(20, 40)
            } 
            else {
                size = getRandomNumber(20, 60)
            }

            const { width, height } = board.getBoundingClientRect()
            const x = getRandomNumber(0, width - size)
            const y = getRandomNumber(0, height - size)

            circle.style.top = `${x}px`
            circle.style.left = `${y}px`
            circle.style.width = `${size}px`
            circle.style.height = `${size}px`

            circle.classList.add('circle')
            board.append(circle)
            //console.log(circle)

            //? colors
            const color = getRandomColor()
            circle.style.backgroundColor = color
        }

        function getRandomNumber(min, max) {
            return Math.round(Math.random() * (max - min) + min)
        }

        //? colors
        function getRandomColor() {
            return colors[Math.floor(Math.random() * colors.length)]
        }

        // kkas te neiet
        // return () => {
        //     startBtn.removeEventListener("click", startBtnClick);
        //     board.removeEventListener("click", boardClick);
        // };

    }, []);

    return (
        <>
            <div class="screen">
                <h1>Aim Training</h1>
                <a href="#" id="start">Start the game</a>
            </div>

            <div class="screen">
                <h3><span id="targets">10</span> targets left</h3>
                <h3><span id="seconds">00</span>:<span id="tens">00</span></h3>
                <div class="board" id="board"></div>
            </div>
        </>
    );
};

export default AimTest;