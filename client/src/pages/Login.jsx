import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  const login = () => {
    Axios.post('http://localhost:5000/login', {
      email,
      password,
    }).then((response) => {
      localStorage.setItem('token', response.data.token);
      // eslint-disable-next-line no-underscore-dangle
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('name', response.data.name);
      history.push('/tasks');
    });
  };

  return (
    <>
      <form className="todo-form form-logReg">
        <h1 className="title">Log in to your Ebyrt account</h1>
        <input
          type="text"
          className="todo-input"
          placeholder="Email address"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          type="password"
          className="todo-input"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button type="button" className="todo-button" onClick={login}>
          Log In
        </button>
      </form>
    </>
  );
}

export default Login;
