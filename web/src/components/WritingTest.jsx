import "./WritingTest.css"
import { useEffect, useState } from "react";
import faker from "faker"
import useKeyPress from '../hooks/useKeyPress';

const WritingTest = () => {

    var currentTime = new Date().getTime();
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
    const durationInMinutes = 0;

    useKeyPress(key => {
        let updatedOutgoingChars = outgoingChars;
        let updatedIncomingChars = incomingChars;

        const updatedTypedChars = typedChars + key;
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

        setAccuracy(
            ((updatedOutgoingChars.length * 100) / updatedTypedChars.length).toFixed(2),
        );

        if (durationInMinutes >= 30) {
        } else {
            currentTime = new Date().getTime();

        }
    });

    return(
        <>
            <div className="screen">
                <h1>Test will start when You start writing</h1>
                <p className="character">
                    <span className="outgoingChar">
                        {(leftPadding + outgoingChars).slice(-20)}
                    </span>
                    <span className="currentChar">{currentChar}</span>
                    <span>{incomingChars.substr(0, 20)}</span>
                </p>
                <h3>WPM: {wpm} | Elapsed Time: {durationInMinutes} | Accuracy: {accuracy}%</h3>
                <button className="resetBtn" onClick={() => {window.location.reload()}}>Restart</button>
            </div>
        </>
    );
}

export default WritingTest;