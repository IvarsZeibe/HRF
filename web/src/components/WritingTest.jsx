import "./WritingTest.css"
import { useEffect, useState } from "react";
import faker from "faker"
import useKeyPress from '../hooks/useKeyPress';

let pressed = 0;
var timeLeft = 5;

const WritingTest = () => {

    let currentTime = new Date().getTime();
    const wordArray = new Array(120).fill().map(_ => faker.random.word()).join(' ');
    const [leftPadding, setLeftPadding] = useState(new Array(20).fill(' ').join(''));
    const [outgoingChars, setOutgoingChars] = useState('');
    const [currentChar, setCurrentChar] = useState(wordArray.charAt(0));
    const [incomingChars, setIncomingChars] = useState(wordArray.substr(1));
    const [startTime, setStartTime] = useState();
    const [wordCount, setWordCount] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [typedChars, setTypedChars] = useState('');
    const [accuracy, setAccuracy] = useState(0);
    const character = document.querySelector('.character');
    const resetBtn = document.querySelector('.resetBtn');
    let updatedOutgoingChars = outgoingChars;
    let updatedIncomingChars = incomingChars;
    let updatedTypedChars = 0;

    
        useKeyPress(key => {
            if (timeLeft >= 0) {
                updatedTypedChars = typedChars + key;
                setTypedChars(updatedTypedChars);
        
                if (!startTime) {
                    setStartTime(currentTime);
                }
                
                if (key === currentChar) {
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
        
                    if (incomingChars.charAt(0) === ' ') {
                        setWordCount(wordCount + 1);
                        const durationInMinutes = (currentTime - startTime) / 60000.0;
                        setWpm(((wordCount + 1) / durationInMinutes).toFixed(2));
                    }
                }
        
                if (pressed === 0) {
                    pressed = 1;
                    var countdownTimer = setInterval(function(){
                        if (timeLeft <= 0){
                            character.classList.add('hide');
                            document.getElementById('timeLeft').style.display = 'none';
                            document.getElementById('testHeader').style.display = 'none';
                            resetBtn.classList.remove('hide');
                            clearInterval(countdownTimer);
                            timeLeft -= 1;
                        } else {
                            timeLeft -= 1;
                            document.getElementById("timeLeft").innerHTML = ' Time left: ' + timeLeft + ' |';
                        }
                    }, 1000);
                }
        
                setAccuracy(
                        ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(2),
                );
            
            } else if (timeLeft === 0) {
                character.classList.add('hide');
                document.getElementById('timeLeft').style.display = 'none';
                document.getElementById('testHeader').style.display = 'none';
                resetBtn.classList.remove('hide');
                clearInterval(countdownTimer);
                timeLeft -= 1;
                setAccuracy(((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(2),);
                document.getElementById('accuracyDisplay').innerHTML = ' Accuracy: ' + accuracy;
                timeLeft = -1;
            } else {

            }
        });
    



    return(
        <>
            <div className="screen">
                <h1 id="testHeader">Test will start when You start writing</h1>
                <p className="character">
                    <span className="outgoingChar">
                        {(leftPadding + outgoingChars).slice(-20)}
                    </span>
                    <span className="currentChar">{currentChar}</span>
                    <span>{incomingChars.substr(0, 20)}</span>
                </p>
                <h3><span className="wpm">WPM: {wpm} |</span><span id="timeLeft"> Time left: {timeLeft}</span><span id="accuracyDisplay"> Accuracy: {accuracy}</span>%</h3>
                <button className="resetBtn hide" onClick={() => {window.location.reload()}}>Restart</button>
            </div>
        </>
    );
}

export default WritingTest;