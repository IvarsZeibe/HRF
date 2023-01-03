import { useState, useEffect } from "react";
import AuthenticationService from "../services/AuthenticationService";
import { useNavigate } from "react-router-dom";

const SignIn = ({user, setUser}) => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({});
    const [registerData, setRegisterData] = useState({});
    const [isSigningIn, setIsSigningIn] = useState(true);

    const handleRegisterChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setRegisterData(values => ({...values, [name]: value}))
    }
    const handleLoginChange = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setLoginData(values => ({...values, [name]: value}))
    }
    const login = (e) => {
      e.preventDefault();
      AuthenticationService.signIn(loginData.Email, loginData.Password)
      .then(() => {
        AuthenticationService.getUser()
        .then(u => {
          setUser(u);
          navigate('/');
        });
      });    
    }
    const register = (e) => {
      e.preventDefault();
      AuthenticationService.signUp(registerData.Email, registerData.Username, registerData.Password)
      .then(() => {
        AuthenticationService.getUser()
        .then(u => {
          navigate('/');
        });
      });
    }

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, []);

    useEffect(() => {
      console.log(isSigningIn);
    }, [isSigningIn]);

    return <>
    { isSigningIn &&
    <div style={{background: "white"}}>
      <form onSubmit={login}>
        <label htmlFor="email">
          Email: 
          <input className="text-input" type="email" name="Email" value={loginData.Email || ""} onChange={handleLoginChange}></input>
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input className="text-input" type="password" name="Password" value={loginData.Password || ""} onChange={handleLoginChange}></input>
        </label>
        <br />
        <input className="submit-input" type="submit" value="Login" />
      </form>
      <br />
      <button onClick={() => setIsSigningIn(false)}>Don't have an account? Sign up!</button>
    </div> }
    
    { !isSigningIn &&
    <div style={{background: "white"}}>
      <form onSubmit={register}>
        <label htmlFor="username">
          Username:
          <input className="text-input" type="text" name="Username" value={registerData.Username || ""} onChange={handleRegisterChange}></input>
        </label>
        <br />
        <label htmlFor="email">
          Email:
          <input className="text-input" type="email" name="Email" value={registerData.Email || ""} onChange={handleRegisterChange}></input>
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input className="text-input" type="password" name="Password" value={registerData.Password || ""} onChange={handleRegisterChange}></input>
        </label>
        <br />
        <input className="submit-input" type="submit" value="Register" />
      </form>
    <button onClick={() => setIsSigningIn(true)}>Already have an account? Sign In!</button>
  </div> }
  </>
};

export default SignIn;