import "./WritingTest.css"
import { useEffect, useState, useRef } from "react";
import faker from "faker"
import useKeyPress from '../hooks/useKeyPress';
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";
import BackendService from "../services/BackendService";

const WritingTest = () => {
    const testLengthInSeconds = 30;
    const averageWordLength = 5;
    let timeLeft = useRef(testLengthInSeconds);
    const navigate = useNavigate();
    let currentTime = new Date().getTime();
    const wordArray = new Array(120).fill().map(_ => faker.random.word()).join(' ');
    const [leftPadding, setLeftPadding] = useState(new Array(20).fill(' ').join(''));
    const [outgoingChars, setOutgoingChars] = useState('');
    const [currentChar, setCurrentChar] = useState(wordArray.charAt(0));
    const [incomingChars, setIncomingChars] = useState(wordArray.substr(1));
    const [startTime, setStartTime] = useState();
    const [wpm, setWpm] = useState(0);
    const [typedChars, setTypedChars] = useState('');
    const [accuracy, setAccuracy] = useState((100).toFixed(2));    
    const [scoreIsSaved, setScoreIsSaved] = useState(false);
    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    let updatedTypedChars = 0;
    const countdownTimer = useRef(null);
    const needsUpdatedResults = useRef(false);
    const isTestActive = useRef(false);
    const [update, setUpdate] = useState(-10);
    
    useKeyPress(key => {
        const character = document.querySelector('.character');
        const resetBtn = document.querySelector('.resetBtn');
        if (timeLeft.current >= 0) {
            updatedTypedChars = typedChars + key;
            setTypedChars(updatedTypedChars);
    
            if (!startTime) {
                setStartTime(currentTime);
            }
    
            if (!countdownTimer.current) {
                isTestActive.current = true;
                countdownTimer.current = setInterval(function(){
                    setUpdate(timeLeft.current);
                    if (timeLeft.current <= 1){
                        character.classList.add('hide');
                        document.getElementById('timeLeft').style.display = 'none';
                        document.getElementById('testHeader').style.display = 'none';
                        document.getElementById('tutorial').style.display = 'none';
                        resetBtn.parentElement.classList.remove('hide');
                        clearInterval(countdownTimer.current);
                        needsUpdatedResults.current = true;
                        isTestActive.current = false;
                        timeLeft.current -= 1;
                    } else {
                        timeLeft.current -= 1;
                    }
                }, 1000);
            }
            if (key === currentChar && isTestActive.current) {
                if (leftPadding.length > 0) {
                    setLeftPadding(leftPadding.substring(1));
                }
                updatedOutgoingChars += currentChar;
    
                setOutgoingChars(updatedOutgoingChars);     
                setCurrentChar(incomingChars.charAt(0));
    
                updatedIncomingChars = incomingChars.substring(1);
                if (updatedIncomingChars.split(' ').length < 10) {
                    updatedIncomingChars +=' ' + generate();
                }
                setIncomingChars(updatedIncomingChars);
            }
            // Force update result
            if (isTestActive.current) {
                setUpdate(update + 1);
            }
        }
    });
    useEffect(() => {
        setWpm((outgoingChars.length / averageWordLength * (60 / Math.min(testLengthInSeconds - timeLeft.current + 1, testLengthInSeconds))).toFixed(2));
        if (typedChars.length != 0) {
            setAccuracy(((outgoingChars.length * 100) / typedChars.length).toFixed(2));
        }
    }, [update]);

    useEffect(() => {
        return () => {
            clearInterval(countdownTimer.current);
            countdownTimer.current = null;
        }
    }, []);
    
    function save() {
        BackendService.addMyTestResult("TypingTest", { WordsPerMinute: parseInt(wpm), Accuracy: accuracy / 100 })
        .then(res => setScoreIsSaved(true))
        .catch(err => console.log(err));
    }

    return(
        <>
            <div className="screen">
                <div className="instruction-box">
                    <p>HOW TO:</p>
                    Test length is 30 seconds. You can view your current speed (words per minute), time left (seconds) and accuracy below the words you need to type. Good luck!
                </div>
                <h1 id="testHeader">Test will start when You start writing</h1>
                <p className="character">
                    <span className="outgoingChar">
                        {(leftPadding + outgoingChars).slice(-20)}
                    </span>
                    <span className="currentChar">{currentChar}</span>
                    <span>{incomingChars.substr(0, 20)}</span>
                </p>
                <h3><span className="wpm">WPM: {wpm} |</span><span id="timeLeft"> Time left: {timeLeft.current}</span><span id="accuracyDisplay"> Accuracy: {accuracy}</span>%</h3>
                <div className="hide">
                    <button className="resetBtn" onClick={() => {window.location.reload()}}>Restart</button>
                    {!AuthenticationService.isSignedIn() && <button onClick={() => navigate("/signin")} className="play-again-btn">Sign in</button>}
                    {AuthenticationService.isSignedIn() && !scoreIsSaved && <button onClick={save} className="play-again-btn">Save</button>}
                </div>
            </div>
        </>
    );
}

export default WritingTest;