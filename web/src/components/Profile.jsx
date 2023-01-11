import { useState } from "react";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";
import BackendService from "../services/BackendService";
import { Table } from ".";
import { test } from "../constants";
import styles from "../style";
import { Grid } from "@mui/material";
import "./Profile.css";


const Profile = ({ user }) => {
  const [reactionTimeTestSummary, setReactionTimeTestSummary] = useState({
    empty: [],
  });
  const [aimTestSummary, setAimTestSummary] = useState({ empty: [] });
  const [typingTestSummary, setTypingTestSummary] = useState({ empty: [] });
  const [numberMemoryTestSummary, setNumberMemoryTestSummary] = useState({
    empty: [],
  });

  const [reactionTimeTests, setReactionTimeTests] = useState({ empty: [] });
  const [aimTests, setAimTests] = useState();
  const [typingTests, setTypingTests] = useState({ empty: [] });
  const [numberMemoryTests, setNumberMemoryTests] = useState({ empty: [] });

  const [isAimTestsVisible, setIsAimTestsVisible] = useState(false);
  const [isReactionTimeTestsVisible, setIsReactionTimeTestsVisible] =
    useState(false);
  const [isNumberMemoryTestsVisible, setIsNumberMemoryTestsVisible] =
    useState(false);
  const [isTypingTestsVisible, setIsTypingTestsVisible] = useState(false);

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  const aimTestImg = test.find((t) => t.name === "Aim Trainer").img;
  const reactionTestImg = test.find(
    (card) => card.name === "Reaction Time"
  ).img;
  const typingTestImg = test.find((card) => card.name === "Typing Speed").img;
  const numberMemoryTestImg = test.find(
    (card) => card.name === "Number Memory"
  ).img;

  function submitEmail() {
    BackendService.changeMyEmail(email)
      .then((res) => console.log("success?"))
      .catch((err) => console.log("error"));
  }
  function submitUsername() {
    BackendService.changeMyUsername(username)
      .then((res) => console.log("success?"))
      .catch((err) => console.log("error"));
  }
  function submitPassword() {
    BackendService.changeMyPassword(newPassword, oldPassword)
      .then((res) => console.log("success?"))
      .catch((err) => console.log("error"));
  }

  function update() {
    setStateForTest(
      "ReactionTimeTest",
      setReactionTimeTests,
      setReactionTimeTestSummary
    );
    setStateForTest("AimTest", setAimTests, setAimTestSummary);
    setStateForTest("TypingTest", setTypingTests, setTypingTestSummary);
    setStateForTest(
      "NumberMemoryTest",
      setNumberMemoryTests,
      setNumberMemoryTestSummary
    );
  }
  function setStateForTest(testName, setResult, setSummary) {
    BackendService.getMyTestResults(testName).then((result) => {
      if (result.length == 0) {
        setResult({ keys: ["Empty"], values: [[]] });
      } else {
        let keys = Object.keys(result[0]).map(
          (str) => str.charAt(0).toUpperCase() + str.slice(1)
        );
        let values = result.map((obj) => {
          let elements = Object.values(obj).map((v) => v.toString());
          elements.push(
            <button
              onClick={() => {
                BackendService.deleteTestResult(testName, obj.id).then(update);
              }}
            >
              Delete
            </button>
          );
          return elements;
        });
        setResult({ keys: keys, values: values });
      }
    });
    BackendService.getMyTestResultSummary(testName)
      .then((result) => setSummary(result))
      .catch((err) => setSummary({ empty: [] }));
  }

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setUsername(user.username);
    }
    update();
  }, [user]);

  function getKeys(object) {
    return Object.keys(object).map(
      (str) => str.charAt(0).toUpperCase() + str.slice(1)
    );
  }
  function getValues(object) {
    return Object.values(object).map((el) => el.toString());
  }

  // Visuals
  function render() {
    if (!AuthenticationService.isSignedIn()) {
      return <Navigate to="/" />;
    } else if (!user) {
      return null;
    } else {
      return (
        <div id="profile" style={{ backgroundColor: "#00040f" }}>
          <form
            className="form"
            style={{
              display: "flex",
              flexDirection: "column",
              background: "var(--black-gradient)",
              boxShadow: "var(--card-shadow)",
              alignItems: "center",
              borderRadius: "20px",
              width: "70%",
              marginTop: "40px",
              marginBottom: "10px",
              marginLeft: "auto",
              marginRight: "auto",
              minHeight: "480px",
            }}
          >
            <h1 className="text-2xl font-bold text-center text-white mb-4">
              Profile Settings
            </h1>
            <div className="flex flex-col">
              <div style={{ display: "flex" }}>
                <input
                  className="text-input"
                  style={{
                    boxShadow: "inset 0 1px 3px #ddd",
                    border: "1px solid #ccc",
                    padding: "5px",
                    display: "inline-block",
                    margin: "8px 4px",
                    width: "250px",
                    borderRadius: "5px",
                  }}
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                ></input>
                <button
                  style={{
                    border: "1px solid #81d2ff",
                    borderRadius: "5px",
                    padding: "5px",
                    display: "inline-block",
                    margin: "8px 4px",
                    color: "white",
                    whiteSpace: "nowrap",
                    width: "auto",
                    marginLeft: "auto",
                    backgroundColor: "#81d2ff",
                  }}
                  className="submit-input"
                  onClick={submitEmail}
                >
                  Save
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <div style={{ display: "flex" }}>
                <input
                  className="text-input"
                  style={{
                    boxShadow: "inset 0 1px 3px #ddd",
                    border: "1px solid #ccc",
                    padding: "5px",
                    display: "inline-block",
                    margin: "8px 4px",
                    width: "250px",
                    borderRadius: "5px",
                  }}
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                ></input>
                <button
                  style={{
                    border: "1px solid #81d2ff",
                    borderRadius: "5px",
                    padding: "5px",
                    display: "inline-block",
                    margin: "8px 4px",
                    color: "white",
                    whiteSpace: "nowrap",
                    width: "auto",
                    marginLeft: "auto",
                    backgroundColor: "#81d2ff",
                  }}
                  className="submit-input"
                  onClick={submitUsername}
                >
                  Save
                </button>
              </div>
            </div>
            <div>
            <button></button>
              <div>
                <input
                  className="text-input"
                  style={{
                    boxShadow: "inset 0 1px 3px #ddd",
                    border: "1px solid #ccc",
                    padding: "5px",
                    display: "inline-block",
                    margin: "8px 4px",
                    width: "300px",
                    borderRadius: "5px",
                  }}
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Old Password"
                />
                <div style={{ display: "flex" }}>
                  <input
                    className="text-input"
                    style={{
                      boxShadow: "inset 0 1px 3px #ddd",
                      border: "1px solid #ccc",
                      padding: "5px",
                      display: "inline-block",
                      margin: "8px 4px",
                      width: "300px",
                      borderRadius: "5px",
                    }}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                  />
                </div>
                <button
                    style={{
                      border: "1px solid #81d2ff",
                      borderRadius: "5px",
                      padding: "5px",
                      display: "inline-block",
                      margin: "8px 4px",
                      color: "white",
                      minWidth: "auto",
                      whiteSpace: "nowrap",
                      width: "300px",
                      backgroundColor: "#81d2ff",
                    }}
                    className="submit-input"
                    onClick={submitPassword}
                  >
                    Save
                  </button>
              </div>
              <button></button>
            </div>
            <div>
              <button
                style={{
                  border: "1px solid #fe636e",
                  borderRadius: "5px",
                  padding: "5px",
                  display: "inline-block",
                  margin: "8px 4px",
                  color: "white",
                  minWidth: "auto",
                  whiteSpace: "nowrap",
                  width: "300px",
                  backgroundColor: "#fe636e",
                }}
                className="submit-input"
                onClick={() =>
                  BackendService.deleteMyUser().then(window.location.reload())
                }
              >
                Delete Account
              </button>
            </div>
          </form>
          
          <div class="summary-section">
            <h1 className="aim-test-summary" id="aim-test-summary" onClick={() => {setIsAimTestsVisible(!isAimTestsVisible)}}>🎯 Aim test summary</h1>
                  { isAimTestsVisible && <div className="testResults">
                      <h2>Results</h2>
                      <Table theadData={aimTests.keys} tbodyData={aimTests.values} />
                      <h2>Summary</h2>
                      <Table theadData={getKeys(aimTestSummary)} tbodyData={[getValues(aimTestSummary)]} />
                      <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("AimTest").then(update);}}>Delete All</button>
                  </div> }
                  <h1 classname="reaction-time-test-summary" id="reaction-time-test-summary" onClick={() => {setIsReactionTimeTestsVisible(!isReactionTimeTestsVisible)}}>⚡Reaction time test summary</h1>
                  { isReactionTimeTestsVisible && <div className="testResults">
                      <h2>Results</h2>
                      <Table theadData={reactionTimeTests.keys} tbodyData={reactionTimeTests.values} />
                      <h2>Summary</h2>
                      <Table theadData={getKeys(reactionTimeTestSummary)} tbodyData={[getValues(reactionTimeTestSummary)]} />
                      <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("ReactionTimeTest").then(update);}}>Delete All</button>
                  </div> }
                  <h1 classname="number-memory-test-results" id="number-memory-test-results" onClick={() => {setIsNumberMemoryTestsVisible(!isNumberMemoryTestsVisible)}}>🔢 Number memory test results</h1>
                  { isNumberMemoryTestsVisible && <div className="testResults">
                      <h2>Results</h2>
                      <Table theadData={numberMemoryTests.keys} tbodyData={numberMemoryTests.values} />
                      <h2>Summary</h2>
                      <Table theadData={getKeys(numberMemoryTestSummary)} tbodyData={[getValues(numberMemoryTestSummary)]} />
                      <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("NumberMemoryTest").then(update);}}>Delete All</button>
                  </div> }
                  <h1 classname="typing-test-results" id="typing-test-results" onClick={() => {setIsTypingTestsVisible(!isTypingTestsVisible)}}>⌨️ Typing test results</h1>
                  { isTypingTestsVisible && <div className="testResults">
                      <h2>Results</h2>
                      <Table theadData={typingTests.keys} tbodyData={typingTests.values} />
                      <h2>Summary</h2>
                      <Table theadData={getKeys(typingTestSummary)} tbodyData={[getValues(typingTestSummary)]} />
                      <button className="submit-input" onClick={() => {BackendService.deleteAllMyResultsIn("TypingTest").then(update);}}>Delete All</button>
          </div> }
        </div>
      </div>
      );
    }
  }

  return <> {render()} </>;
};

export default Profile;
