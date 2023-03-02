import "./AimTest.css";
import { useEffect, useState } from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import BackendService from "../services/BackendService";

const AimTest = () => {
    const navigate = useNavigate();
    const [isTestDone, setIsTestDone] = useState(false);
    const [isScoreSavend, setIsScoreSavend] = useState(false);
    const [tens, setTens] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [accuracy, setAccuracy] = useState(0);

    useEffect(() => {
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
        board.parentNode.classList.add('up');


        function startBtnClick(event) {
            screens[0].classList.add('up');
            screens[1].classList.remove('up');
            startGame();
            targetsClicked = 0;
            missedTargets = 0;
            clearInterval(Interval);
            Interval = setInterval(startTimer, 10);
            tens = "00";
            seconds = "00";
            appendTens.innerHTML = tens;
            appendSeconds.innerHTML = seconds;
        };
        startBtn.addEventListener("click", startBtnClick);

        function boardClick (event) {
            if (event.target.classList.contains('circle')) {
                targetsClicked++;
                setTargets();
                createRandomCircles();
                event.target.remove();
            } 
            else if (event.target.classList.contains('board')) {
                missedTargets++;
            }
        };
        board.addEventListener("mousedown", boardClick);
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
            setTens(tens);
            setSeconds(seconds);
            setAccuracy(accuracy);
            setIsTestDone(true);
            board.innerHTML = '';
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

        return () => {
            startBtn.removeEventListener("click", startBtnClick);
            board.removeEventListener("mousedown", boardClick);
        };

    }, []);

    return (
        <>
            <div className="screen">
                <p className="header">Aim Training</p>
                <button id="start">Start the game</button>
                <div id="tutorial">
                    <div style={{fontSize: "30px"}}>How to use</div>
                    Test has a total of 10 targets. Click the circles on the screen. You can view your current time during the test.  After completion you will see your accuracy and speed. Good luck!
                </div>
            </div>

            <div className="screen">
                <p className="ongoingTestData"><span id="targets">10</span> targets left</p>
                <p className="ongoingTestData"><span id="seconds">00</span>:<span id="tens">00</span></p>
                <div className="board" id="board">
                    {isTestDone && 
                    <>
                        <p className="testData">Time: 
                        <span className="primary"> {seconds}.{tens}s</span><br/>
                        Accuracy: 
                        <span className="primary"> {accuracy}%</span>
                        </p>
                        <button className="time-btn" onClick={() => {window.location.reload()}}>Restart</button>
                        {AuthenticationService.isSignedIn() && !isScoreSavend &&
                        <button onClick={() => {
                            BackendService.addMyTestResult("aimTest", {Accuracy: accuracy / 100, AverageTimePerTarget: (seconds * 1000 + tens * 10)/10})
                            .then(_ => setIsScoreSavend(true))
                        }} className="time-btn">Save</button>}
                        {!AuthenticationService.isSignedIn() &&
                        <button onClick={() => {navigate("/signin")}} className="time-btn">Sign In</button>}
                    </>}
                </div>
            </div>
        </>
    );
};

export default AimTest;