import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

function Tasks() {
  const [taske, setTask] = useState([]);

  const [newTasks, setNewTask] = useState('');

  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');

  const createTask = () => {
    Axios.post(
      'http://localhost:5000/tasks',
      {
        task: newTasks,
      },
      {
        headers: { authorization: token },
      },
    );
  };

  const updateTask = (id) => {
    Axios.put(
      `http://localhost:5000/tasks/${id}`,
      {
        task: newTasks,
      },
      {
        headers: { authorization: token },
      },
    );
  };

  const deleteTask = (_id) => {
    Axios.delete(`http://localhost:5000/tasks/${_id}`, {
      headers: { authorization: token },
    });
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    Axios.get('http://localhost:5000/tasks', {}).then((response) => {
      if (!response.data.tasks) {
        setTask();
      } else {
        const data = response.data.tasks.filter(
          (item) => item.userId === userId,
        );
        setTask(data);
      }
    });
  }, []);

  function refreshAndCreate() {
    createTask();
    window.location.href = 'http://localhost:3000/tasks';
  }

  function refreshAndUpdate(_id) {
    updateTask(_id);
    window.location.href = 'http://localhost:3000/tasks';
  }

  function refreshAndDelete(_id) {
    deleteTask(_id);
    window.location.href = 'http://localhost:3000/tasks';
  }
  return (
    <div>
      <form className="todo-form">
        <h1>{`What we have for today, ${name}?`}</h1>
        <input
          type="text"
          placeholder="Create Task"
          className="todo-input"
          onChange={(e) => {
            setNewTask(e.target.value);
          }}
        />

        <button type="button" className="todo-button" onClick={refreshAndCreate}>
          Create
        </button>
      </form>

      {taske.map(({ task, _id }) => (
        <div key={_id} className="todo-row">
          {task}
          <div className="icons">
            <RiCloseCircleLine type="button" className="delete-icon" onClick={() => refreshAndDelete(_id)} />
            <TiEdit type="button" className="edit-icon" onClick={() => refreshAndUpdate(_id)} />
            <select>
              <option value="pendente">pendente</option>
              <option value="em andamento">em andamento</option>
              <option value="pronto">pronto</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Tasks;
