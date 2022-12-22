import { useNavigate, Navigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import BackendService from "../services/BackendService";
import { useState, useEffect, useRef, useReducer } from "react";
import { Table } from ".";
import './ControlPanel.css';

const ControlPanel = ({user}) => {
    const [users, setUsers] = useState({keys: ["empty"], values: []});
    const [aimTests, setAimTests] = useState({keys: ["empty"], values: []});
    const [reactionTimeTests, setReactionTimeTests] = useState({keys: ["empty"], values: []});
    const [numberMemoryTests, setNumberMemoryTests] = useState({keys: ["empty"], values: []});
    const [typingTests, setTypingTests] = useState({keys: ["empty"], values: []});

    const [isUsersVisible, setIsUsersVisible] = useState(false);
    const [isAimTestsVisible, setIsAimTestsVisible] = useState(false);
    const [isReactionTimeTestsVisible, setIsReactionTimeTestsVisible] = useState(false);
    const [isNumberMemoryTestsVisible, setIsNumberMemoryTestsVisible] = useState(false);
    const [isTypingTestsVisible, setIsTypingTestsVisible] = useState(false);
    
    const [aimTestsSummary, setAimTestsSummary] = useState({keys: ["no summary"], values: []});
    const [reactionTimeTestsSummary, setReactionTimeTestsSummary] = useState({keys: ["no summary"], values: []});
    const [numberMemoryTestsSummary, setNumberMemoryTestsSummary] = useState({keys: ["no summary"], values: []});
    const [typingTestsSummary, setTypingTestsSummary] = useState({keys: ["no summary"], values: []});

    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [uneditables, setUneditables] = useState([]);
    const [sendKeys, setSendKeys] = useState([]);
    const [hiddenIndices, setHiddenIndices] = useState();
    const [sendData, setSendData] = useState([]);
    const [sendTypes, setSendTypes] = useState([]);

    const [shouldUpdate, setShouldUpdate] = useState();

    // custom hook for lambdas from https://stackoverflow.com/questions/59040989/usestate-with-a-lambda-invokes-the-lambda-when-set
    const useState2 = initVal => {
        const setter = useRef((__, next) => ({ val: next })).current
        const [wrapper, dispatch] = useReducer(setter, { val: initVal })
        const state = wrapper.val
        const setState = dispatch
        return [state, setState]
      }
    const [saveHandler, setSaveHandler] = useState2(() => {});

    useEffect(() => {
        update();
    }, [user, shouldUpdate]);

    function update() {
        BackendService.getUsers()
        .then(u => { 
            if (u.length > 0) {
                setUsers(createEditableTable(u.map(el => {return {...el, password: ""}}), [0], [0],
                    (data, keys) => BackendService.changeUserData(...data).then(update),
                    (el) => BackendService.deleteUser(el.id).then(update),
                    Object.keys(u[0]).concat("password (leave empty to not change)")))
            }
        });
        addTestTable("ReactionTimeTest", setReactionTimeTests, setReactionTimeTestsSummary);
        addTestTable("TypingTest", setTypingTests, setTypingTestsSummary);
        addTestTable("NumberMemoryTest", setNumberMemoryTests, setNumberMemoryTestsSummary);
        addTestTable("AimTest", setAimTests, setAimTestsSummary);
    }

    function createEditableTable(objectList, uneditablesIndices, hiddenIndicies, onSave, onDelete, titles) {
        if (objectList.length > 0) {
            let keys = []
            if (titles === undefined) {
                keys = Object.keys(objectList[0]).map(str => str.charAt(0).toUpperCase() + str.slice(1));
            } else {
                keys = titles;
            }
            let values = objectList.map(el => {
                let handler = (data) => {
                    onSave(data, keys);
                    setIsOverlayVisible(false);
                }
                let elements = Object.values(el).map(e => e.toString());
                let x = [...elements];
                elements.push(<button onClick={() => {
                    openOverlay(keys, x, uneditablesIndices, Object.values(el).map(e => typeof(e)), hiddenIndices);
                    setSaveHandler(handler);
                }}>Edit</button>)
                elements.push((<button onClick={() => {
                    onDelete(el);
                }}>Delete</button>));
                return elements;
            });
            return {keys: keys, values: values, hiddenIndices: hiddenIndicies}
        }
        return {keys: ["empty"], values: []}
    }
    function openOverlay(keys, data, uneditables, types, hiddenIndices) {
        setSendKeys(keys);
        setSendData(data);
        setUneditables(uneditables);
        setIsOverlayVisible(true);
        setSendTypes(types);
        setHiddenIndices(hiddenIndices);
    }
    function addTestTable(testName, resultSetter, summarySetter) {
        BackendService.getAllTestResultsFor(testName)
        .then(tests => {
            resultSetter(createEditableTable(tests, [0, 1], [0],
                (data, keys) => {BackendService.changeTestResult(testName, Object.fromEntries(data.map((d, i) => [keys[i], d]))).then(update)},
                (el) => {BackendService.deleteTestResult(testName, el.id).then(update)}));
        });
        BackendService.getTestResultSummary(testName)
        .then(result => {
            summarySetter({keys: Object.keys(result), values: [Object.values(result)]});
        })
    }

    async function AddTestData() {
        await Promise.all([
            BackendService.addMyTestResult("ReactionTimeTest", {ReactionTime: 200}),
            BackendService.addMyTestResult("AimTest", {AverageTimePerTarget: 500, Accuracy: 1}),
            BackendService.addMyTestResult("TypingTest", {WordsPerMinute: 70, Accuracy: 1}),
            BackendService.addMyTestResult("NumberMemoryTest", {DigitCount: 6})]);
        update();
        
    }

    function getOverlayData() {
        return [sendData.map((val, i) => {
            if (uneditables.includes(i)) {
                return val.toString();
            } else {
                if (sendTypes[i] == "boolean") {
                    return <input type="checkbox" checked={val == 'true'} onChange={(e) => {setSendData(sendData.slice(0, i).concat(e.target.checked.toString(), ...sendData.slice(i + 1)))}} value={val} />
                } else {
                    return <input onChange={(e) => {setSendData(sendData.slice(0, i).concat(e.target.value, ...sendData.slice(i + 1)))}} value={val} />
                }
            }
        })];
    }

    function parse(value, type) {
        switch (type) {
            case "number":
                if (parseInt(value) === parseFloat(value)) {
                    return parseInt(value);
                } else {
                    return parseFloat(value);
                }
            case "boolean":
                return value == "true";
            default: 
                return value.toString();
        }
    }
    
    function render() {
        if (!AuthenticationService.isSignedIn()) {
            return <Navigate to="/" />;
        } else if (!user) {
            return null;
        } else if (!user.isAdmin) {
            return <Navigate to="/" />;
        } else {
            return <div className="controlPanel" style={{background: 'white'}}>
                <button onClick={AddTestData}>Add test data (1 test result from current user in each test)</button>

                <h1 onClick={() => {setIsUsersVisible(!isUsersVisible)}}>Users</h1>
                { isUsersVisible && <div className="testResults">
                    <Table theadData={users.keys} tbodyData={users.values} />
                </div> }

                <h1 onClick={() => {setIsReactionTimeTestsVisible(!isReactionTimeTestsVisible)}}>Reaction time test results</h1>
                { isReactionTimeTestsVisible && <div className="testResults">
                    <Table theadData={reactionTimeTests.keys} tbodyData={reactionTimeTests.values} hiddenIndices={reactionTimeTests.hiddenIndices} />
                    <div className="break" />
                    <Table theadData={reactionTimeTestsSummary.keys} tbodyData={reactionTimeTestsSummary.values} />
                </div> }

                <h1 onClick={() => {setIsAimTestsVisible(!isAimTestsVisible)}}>Aim test results</h1>
                { isAimTestsVisible && <div className="testResults">
                    <Table theadData={aimTests.keys} tbodyData={aimTests.values} hiddenIndices={aimTests.hiddenIndices} />
                    <div className="break" />
                    <Table theadData={aimTestsSummary.keys} tbodyData={aimTestsSummary.values} />
                </div> }

                <h1 onClick={() => {setIsTypingTestsVisible(!isTypingTestsVisible)}}>Typing test results</h1>
                { isTypingTestsVisible && <div className="testResults">
                    <Table theadData={typingTests.keys} tbodyData={typingTests.values} hiddenIndices={typingTests.hiddenIndices} />
                    <div className="break" />
                    <Table theadData={typingTestsSummary.keys} tbodyData={typingTestsSummary.values} />
                </div> }

                <h1 onClick={() => {setIsNumberMemoryTestsVisible(!isNumberMemoryTestsVisible)}}>Number memory test results</h1>
                { isNumberMemoryTestsVisible && <div className="testResults">
                    <Table theadData={numberMemoryTests.keys} tbodyData={numberMemoryTests.values} hiddenIndices={numberMemoryTests.hiddenIndices} />
                    <div className="break" />
                    <Table theadData={numberMemoryTestsSummary.keys} tbodyData={numberMemoryTestsSummary.values} />
                </div> }

                {isOverlayVisible && 
                <div id="overlay">
                    <div>
                        <Table theadData={sendKeys} tbodyData={getOverlayData()} hiddenIndices={numberMemoryTests.hiddenIndices} />
                        <br />
                        <button onClick={() => {setIsOverlayVisible(false)}} style={{float: "left"}}>Cancel</button>
                        <button onClick={() => {saveHandler(sendData.map((el, i) => parse(el, sendTypes[i])))}} style={{float: "right"}}>Save</button>
                    </div>
                </div>}
            </div>;
        }
    }

    return <>{ render() }</>;
};

export default ControlPanel;