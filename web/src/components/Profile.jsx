import { useState } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import BackendService from "../services/BackendService";
import { Table } from ".";
import "./Profile.css";

const Profile = ({user}) => {
    const [reactionTimeTestSummary, setReactionTimeTestSummary] = useState({empty: []})
    const [aimTestSummary, setAimTestSummary] = useState({empty: []})
    const [typingTestSummary, setTypingTestSummary] = useState({empty: []})
    const [numberMemoryTestSummary, setNumberMemoryTestSummary] = useState({empty: []})

    const [reactionTimeTests, setReactionTimeTests] = useState({empty: []})
    const [aimTests, setAimTests] = useState()
    const [typingTests, setTypingTests] = useState({empty: []})
    const [numberMemoryTests, setNumberMemoryTests] = useState({empty: []})
    
    const [isAimTestsVisible, setIsAimTestsVisible] = useState(false);
    const [isReactionTimeTestsVisible, setIsReactionTimeTestsVisible] = useState(false);
    const [isNumberMemoryTestsVisible, setIsNumberMemoryTestsVisible] = useState(false);
    const [isTypingTestsVisible, setIsTypingTestsVisible] = useState(false);

    const [isEditingPassword, setIsEditingPassword] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

    function submitEmail() {
        BackendService.changeMyEmail(email)
        .then(res => console.log("success?"))
        .catch(err => console.log("error"));
    }
    function submitUsername() {
        BackendService.changeMyUsername(username)
        .then(res => console.log("success?"))
        .catch(err => console.log("error"));
    }
    function submitPassword() {
        BackendService.changeMyPassword(newPassword, oldPassword)
        .then(res => console.log("success?"))
        .catch(err => console.log("error"));
    }


    function update() {
        setStateForTest("ReactionTimeTest", setReactionTimeTests, setReactionTimeTestSummary);
        setStateForTest("AimTest", setAimTests, setAimTestSummary);
        setStateForTest("TypingTest", setTypingTests, setTypingTestSummary);
        setStateForTest("NumberMemoryTest", setNumberMemoryTests, setNumberMemoryTestSummary);
    }
    function setStateForTest(testName, setResult, setSummary) {
        BackendService.getMyTestResults(testName)
        .then(result => {
            if (result.length == 0) {
                setResult({keys: ["Empty"], values: [[]]});
            } else {
                let keys = Object.keys(result[0]).map(str => str.charAt(0).toUpperCase() + str.slice(1));
                let values = result.map(obj => {
                    let elements = Object.values(obj).map(v => v.toString());
                    elements.push((<button onClick={() => {
                        BackendService.deleteTestResult(testName, obj.id).then(update);
                    }}>Delete</button>));
                    return elements;
                });
                setResult({keys: keys, values: values})
            }
        })
        BackendService.getMyTestResultSummary(testName)
        .then(result => setSummary(result))
        .catch(err => setSummary({empty: []}));
    }

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setUsername(user.username);
        }
        update();
    }, [user]);

    function getKeys(object) {
        return Object.keys(object).map(str => str.charAt(0).toUpperCase() + str.slice(1));
    }
    function getValues(object) {
        return Object.values(object).map(el => el.toString());
    }

    function render() {
        if (!AuthenticationService.isSignedIn()) {
            return <Navigate to="/" />;
        } else if (!user) {
            return null;
        } else {
            return <div id="profile" style={{"background": "white"}}>

                <div>
                    <label>Email:</label>
                    <input className="text-input" type="text" value={email} onChange={(e) => {setEmail(e.target.value)}} />
                    <button className="submit-input" onClick={submitEmail}>Save</button>
                </div>
                <div>
                    <label>Username:</label>
                    <input className="text-input" type="text" value={username} onChange={(e) => {setUsername(e.target.value)}} />
                    <button className="submit-input" onClick={submitUsername}>Save</button>
                </div>
                <div>
                    {!isEditingPassword && <button className="submit-input" onClick={() => setIsEditingPassword(true)}>Edit Password</button>}
                    {isEditingPassword && <div>
                        <label>Old password</label>
                        <input className="text-input" type="password" value={oldPassword} onChange={(e) => {setOldPassword(e.target.value)}} />
                        <label>New password</label>
                        <input className="text-input" type="password" value={newPassword} onChange={(e) => {setNewPassword(e.target.value)}} />
                        <button className="submit-input" onClick={submitPassword}>Save</button>
                        <button className="submit-input" onClick={() => setIsEditingPassword(false)}>Cancel</button>
                    </div>}
                </div>

                <h1 onClick={() => {setIsAimTestsVisible(!isAimTestsVisible)}}>Aim test summary</h1>
                { isAimTestsVisible && <div className="testResults">
                    <h2>Results</h2>
                    <Table theadData={aimTests.keys} tbodyData={aimTests.values} />
                    <h2>Summary</h2>
                    <Table theadData={getKeys(aimTestSummary)} tbodyData={[getValues(aimTestSummary)]} />
                    <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("AimTest").then(update);}}>Delete All</button>
                </div> }
                <h1 onClick={() => {setIsReactionTimeTestsVisible(!isReactionTimeTestsVisible)}}>Reaction time test summary</h1>
                { isReactionTimeTestsVisible && <div className="testResults">
                    <h2>Results</h2>
                    <Table theadData={reactionTimeTests.keys} tbodyData={reactionTimeTests.values} />
                    <h2>Summary</h2>
                    <Table theadData={getKeys(reactionTimeTestSummary)} tbodyData={[getValues(reactionTimeTestSummary)]} />
                    <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("ReactionTimeTest").then(update);}}>Delete All</button>
                </div> }
                <h1 onClick={() => {setIsNumberMemoryTestsVisible(!isNumberMemoryTestsVisible)}}>Number memory test results</h1>
                { isNumberMemoryTestsVisible && <div className="testResults">
                    <h2>Results</h2>
                    <Table theadData={numberMemoryTests.keys} tbodyData={numberMemoryTests.values} />
                    <h2>Summary</h2>
                    <Table theadData={getKeys(numberMemoryTestSummary)} tbodyData={[getValues(numberMemoryTestSummary)]} />
                    <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("NumberMemoryTest").then(update);}}>Delete All</button>
                </div> }
                <h1 onClick={() => {setIsTypingTestsVisible(!isTypingTestsVisible)}}>Typing test results</h1>
                { isTypingTestsVisible && <div className="testResults">
                    <h2>Results</h2>
                    <Table theadData={typingTests.keys} tbodyData={typingTests.values} />
                    <h2>Summary</h2>
                    <Table theadData={getKeys(typingTestSummary)} tbodyData={[getValues(typingTestSummary)]} />
                    <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("TypingTest").then(update);}}>Delete All</button>
                </div> }
                
                <div>
                    <button className="submit-input" onClick={() => BackendService.deleteMyUser().then(window.location.reload())}>Delete Account</button>
                </div>
            </div>
        }
    }

    return <> { render() } </>;
};

export default Profile;