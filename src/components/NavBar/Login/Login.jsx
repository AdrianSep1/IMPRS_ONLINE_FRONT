import React, {
  useEffect,
  useState,
} from 'react';

import {
  FaLock,
  FaUser,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [role, setRole] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [alert, setAlert] = useState('hide'); // controls the visibility of the pop-up
    const [alertMsg, setAlertMsg] = useState(''); // stores the message to be displayed
    const navigate = useNavigate();

    // Info pop-up message display function
    const infoPop = (message) => {
        setAlert('show');
        setAlertMsg(message);
    };

    // Closes the info pop-up
    const closeInfoPop = () => {
      setAlert('hide');
      console.log(role);
      if(role === 'admin'){
        navigate('/admin');
      } else if(role === 'head'){
        navigate('/head');
      } else if(role === 'staff'){
        navigate('/staff')
      } else if(role === 'Administrative' || role == "Academic"){
        navigate('/home')
      } else{
        navigate('/');
      }
    };

    // Handles the login process
    const handleLogin = () => {
      const requestOptions = {
          method: 'GET',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
          },
      };

      fetch("http://localhost:8080/services/userLogin?email=" + email + "&password=" + password, requestOptions)
          .then((response) => response.json())
          .then((data) => {
              if (data.status === true) {
                  localStorage.setItem("email", email);

                  const isAdmin = data['role'] === 'admin';
                  const isHead = data['role'] === 'head';
                  const isStaff = data['role'] === 'staff';

                  localStorage.setItem("isAdmin", isAdmin);
                  localStorage.setItem("isHead", isHead);
                  localStorage.setItem("isStaff", isStaff);

                  fetch("http://localhost:8080/services/getname?email=" + email, requestOptions)
                      .then((response) => response.json())
                      .then((data) => {
                          localStorage.setItem("firstName", data['firstName']);
                          localStorage.setItem("lastName", data['lastName']);
                          localStorage.setItem("schoolId", data['schoolId']);
                          localStorage.setItem("role", data['role']);
                          localStorage.setItem("college", data['college']);
                          localStorage.setItem("accType", data['accType']);

                          fetch("http://localhost:8080/services/getid?email=" + email, requestOptions)
                              .then((response) => response.json())
                              .then((data) => {
                                  localStorage.setItem("userID", data['userID']);
                                  
                                  if (data['adminVerified'] === false) {
                                      infoPop('Your account is not yet accepted by the admin');
                                  } else {
                                    localStorage.setItem("isLoggedIn", true);
                                    if (data['role'] === 'admin') {
                                      setRole(data['role']);
                                      infoPop('Successfully Login!');
                                    } else if (data['role'] === 'head') {
                                      setRole(data['role']);
                                      infoPop('Successfully Login!');
                                    } else if (data['role'] === 'staff') {
                                      setRole(data['role']);
                                      infoPop('Successfully Login!');
                                    } else if (data['role'] === 'Academic' || data['role'] === 'Administrative') {
                                        localStorage.setItem("department", data['department']);
                                        localStorage.setItem("schoolId", data['schoolId']);
                                        localStorage.setItem("college", data['college']);
                                        localStorage.setItem("office", data['office']);
                                        setRole(data['role']);
                                        infoPop('Successfully Login!');
                                    }
                                  }
                              })
                              .catch(error => {
                                  console.log(error);
                              });
                      })
                      .catch(error => {
                          console.log(error);
                      });
              } else {
                  infoPop('There is no account that matches those credentials. Please register.');
              }
              console.log(data);
          })
          .catch(error => {
              console.log(error);
          });
  };

  const handleClear = () => {
    setEmail('');
    setPassword('');
  };

  const handleRegister = () => {
    navigate("/register");
  }

  useEffect(() => {
    if(localStorage.getItem("isLoggedIn") === "true"){
        navigate("/home");
    }
  }, [navigate]);

  return (
    <div className='main section'>
      <div id="infoPopOverlay" className={alert}></div>
      <div id="infoPop" className={alert}>
          <p>{alertMsg}</p>
          <button id='infoChangeBtn' onClick={closeInfoPop}>Close</button>
      </div>
      <div className='title'>
        <h1 style={{color: '#8f271a'}}>INSTRUCTIONAL MATERIAL PRINTING REQUEST</h1>
      </div>
      <div className='login-container'>
        <h2 style={{color: '#8f271a', fontWeight: 'bold'}}>Login</h2>
        {isLoggedIn ? (
          <p>You are logged in!</p>
        ) : (
          <form id="loginForm">
            <label>
              <FaUser />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              />
            </label>
            <label>
              <FaLock />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </label>

            <div className="buttons">
                <button className='login-btn' type="button" onClick={handleLogin}>
                Login
                </button>
                <button className='clear-btn' type="button" onClick={handleClear}>
                Clear Entities
                </button>
                <button className='register-btn' type="button" onClick={handleRegister}>Register</button>
            </div>
            
            <div className='fpass'>
              <p>Forgot Password? <a href="/forgotpassword"> Click Here</a></p>
            </div>
          </form>
        )}
        
      </div>
      <div className='cit-bglogo'></div>
    </div>
  );
};

export default Login;
