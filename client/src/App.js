import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
    state = {
      tasks: ['Shopping', 'Go out with a dog'],
      taskName: '',
    }

  componentDidMount(){
    this.socket = io('localhost:8000');
    this.socket.on('addTask', (taskToAdd) => {
      this.addTask(taskToAdd);
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id);
    });
    this.socket.on('updateData', (tasks) => {
      this.updateTasks(tasks);
    });
    this.socket.on('editTask', (id, newName) => {
      this.editTask(id, newName);
    });
  }

  updateTasks(givenTasks) {
    this.setState({tasks: givenTasks});
  }

  submitRemoval(index) {
    const id = this.state.tasks[index].id;
    this.removeTask(id);
    this.socket.emit('removeTask', id);
  }

  removeTask(id) {
    this.setState(state => {
      const tasks = state.tasks.filter(task => task.id !== id)

      return {
        tasks,
      };
    });
  }

  handleChange(event, state) {
    this.setState({taskName: event.target.value})
  }

  submitForm(event) {
    if (this.state.taskName !== '') {
      event.preventDefault();
      const task = {id: uuidv4(), name: this.state.taskName}
      this.addTask(task);
      this.socket.emit('addTask', task);
      this.setState({taskName: ''})
    } else {
      alert('The task name is empty!')
    }

  }

  addTask(task) {
    this.setState(state => {
      const tasks = state.tasks.concat(task);

      return {
        tasks,
      };
    });
  }

  submitEdit(index) {
    const id = this.state.tasks[index].id;
    const newName = prompt("What should this task be named?");
    this.socket.emit('editTask', id, newName);
    this.editTask(id, newName);
    }

  editTask(id, newName) {
    this.setState(state => {
      const tasks = state.tasks.map(task => {
        if (task.id === id) {
          task.name = newName;
        }
        return task;
      })

      return {
        tasks,
      };
    });
  }


  render() {
    return (
      <div className="App">

        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>

          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task =>
              <li key={this.state.tasks.indexOf(task)} className="task">{task.name}
                <button className="btn btn--red" onClick={() =>this.submitRemoval(this.state.tasks.indexOf(task))}>REMOVE</button>
                <button className="btn btn--green" onClick={() =>this.submitEdit(this.state.tasks.indexOf(task))}>EDIT</button>
              </li>
            )}
          </ul>

          <form id="add-task-form" onSubmit={(e) => this.submitForm(e, this)}>
            <input className="text-input" autoComplete="off" type="text" value={this.state.taskName} placeholder="Type your description"
                   id="task-name" onChange={(e) => this.handleChange(e, this.state)} />
            <button className="btn" type="submit">Add</button>
          </form>

        </section>
      </div>
    );
  };
};


export default App;
