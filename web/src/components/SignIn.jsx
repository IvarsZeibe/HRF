import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../services/AuthenticationService";

const SignIn = () => {
  const navigate = useNavigate();
  const [signInFormData, setSignInFormData] = useState({});
  const [registerFormData, setRegisterFormData] = useState({});
  const [isSigningIn, setIsSigningIn] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  const handleInputChange = (event, formData, setFormData) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((formData) => ({ ...formData, [name]: value }));
  };

  const handleSubmit = (event, formData, setFormData, action) => {
    event.preventDefault();
    action(formData.Username, formData.Email, formData.Password)
      .then(() => AuthenticationService.getUser())
      .then((u) => {
        setUser(u);
        navigate("/");
      })
      .catch((error) => console.error(error));
    setFormData({});
  };

  return (
    <div
      className="flex justify-center items-center h-full"
      style={{ margin: "110px" }}
    >
      {isSigningIn ? (
        <form
          className="flex flex-col items-center px-10 py-12 rounded-20px max-w-370px test-card justify-center items-center"
          style={{
            background: "var(--black-gradient)",
            boxShadow: "var(--card-shadow)",
            borderRadius: "20px",
            width: "400px",
            minHeight: "400px",
          }}
          onSubmit={(event) =>
            handleSubmit(
              event,
              signInFormData,
              setSignInFormData,
              AuthenticationService.signIn
            )
          }
        >
          <h1 className="text-2xl font-bold text-center text-white mb-8">
            Log In Your Account
          </h1>
          <div className="flex flex-col">
            <input
              className="text-input mt-2 rounded 20px"
              type="email"
              name="Email"
              value={signInFormData.Email || ""}
              onChange={(event) =>
                handleInputChange(event, signInFormData, setSignInFormData)
              }
              placeholder="Email"
              style={{ width: "250px" }}
            ></input>
            <input
              className="text-input mt-2 rounded 20px"
              type="password"
              name="Password"
              value={signInFormData.Password || ""}
              onChange={(event) =>
                handleInputChange(event, signInFormData, setSignInFormData)
              }
              placeholder="Password"
              style={{ width: "250px" }}
            ></input>
          </div>
          <button
            style={{ width: "250px", color: "white" }}
            className="submit-input mt-8"
            type="submit"
            value="Sign Up"
          >
            Log In
          </button>
          <p style={{ textAlign: "center" }} className="text-white mt-4">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-white font-bold"
              onClick={() => setIsSigningIn(false)}
            >
              Sign Up!
            </a>
          </p>
        </form>
      ) : (
        <form
          className="flex flex-col items-center px-10 py-12 rounded-20px max-w-370px test-card justify-center items-center"
          style={{
            background: "var(--black-gradient)",
            boxShadow: "var(--card-shadow)",
            borderRadius: "20px",
            width: "400px",
            minHeight: "400px",
          }}
          onSubmit={(event) =>
            handleSubmit(
              event,
              registerFormData,
              setRegisterFormData,
              AuthenticationService.signUp
            )
          }
        >
          <h1 className="text-2xl font-bold text-center text-white mb-8">
            Create Your Account
          </h1>
          <div className="flex flex-col">'
            <input
              className="text-input mt-2 rounded 20px"
              type="text"
              name="Username"
              value={registerFormData.Username || ""}
              onChange={(event) =>
                handleInputChange(event, registerFormData, setRegisterFormData)
              }
              placeholder="Username"
              style={{ width: "250px" }}
            ></input>
            <input
              className="text-input mt-2 rounded 20px"
              type="email"
              name="Email"
              value={registerFormData.Email || ""}
              onChange={(event) =>
                handleInputChange(event, registerFormData, setRegisterFormData)
              }
              placeholder="Email"
              style={{ width: "250px" }}
            ></input>
            <input
              className="text-input mt-2 rounded 20px"
              type="password"
              name="Password"
              value={registerFormData.Password || ""}
              onChange={(event) =>
                handleInputChange(event, registerFormData, setRegisterFormData)
              }
              placeholder="Password"
              style={{ width: "250px" }}
            ></input>
          </div>
          <button
            style={{ width: "250px", color: "white" }}
            className="submit-input mt-8"
            type="submit"
            value="Sign Up"
          >
            Sign Up
          </button>
          <p style={{ textAlign: "center" }} className="text-white mt-4">
            Already have an account?{" "}
            <a
              href="#"
              className="text-white font-bold"
              onClick={() => setIsSigningIn(true)}
            >
              Log In!
            </a>
          </p>
        </form>
      )}
    </div>
  );
};

export default SignIn;