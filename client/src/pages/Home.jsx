import React from 'react';

function Home() {
  return (
    <>
      <container className="home-page">
        <h1 className="title">EBYTR Todo Task</h1>
        <div className="btn-home">
          <button
            type="button"
            onClick={() => {
              window.location = 'http://localhost:3000/register';
            }}
            className="todo-button"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={() => {
              window.location = 'http://localhost:3000/login';
            }}
            className="todo-button"
          >
            User account
          </button>
        </div>
      </container>
    </>
  );
}

export default Home;
