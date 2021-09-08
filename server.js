const express = require('express');
const path = require('path');
const socket = require('socket.io');
var cors = require('cors');

const app = express();
let tasks = [{ id: 'dfsadf324s', name: 'Shopping'}, { id: 'dfs2ad6724s', name: 'Go out with a dog'}];

app.use(cors());
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', (req, res) => {
  res.sendFile(tasks);
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
   socket.emit('updateData', tasks);
   socket.on('removeTask', (id) => {
     tasks = tasks.filter(task => task.id != id);
     socket.broadcast.emit('removeTask', id);
   });
   socket.on('addTask', (taskToAdd) => {
     tasks.push(taskToAdd);
     socket.broadcast.emit('addTask', taskToAdd);
   });
   socket.on('editTask', (id, newName) => {
     tasks = tasks.map(task => {
       if (task.id === id) {
         task.name = newName;
       }
       return task;
     });
     socket.broadcast.emit('editTask', id, newName);
   });
});
