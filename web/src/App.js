import React, { useState, useEffect } from 'react'
import io from 'socket.io-client'
import './App.css'
export default function App() {

  const [socket, setSocket] = useState()
  const [todos, setTodos] = useState([])
  const [todo, setTodo] = useState('')

  useEffect(() => {
    const socketVar = io('http://localhost:3001')
    setSocket(socketVar)
    socketVar.on('getInitialTodos', (todos) => {
      setTodos(todos)
    })


  }, [])

  useEffect(() => {
    if (!socket) {
      return
    }
    socket.on('changed_data', data => {
      setTodos(data)
    })
  }, [socket])


  const addTodo = (e) => {
    e.preventDefault()
    socket.emit('add_todo', {
      id: todos.length + 1,
      todo: todo,
      completed: false
    })
    setTodo('')
  }






  return <div className="page-container"> <div className="container">

    <h1 className="header">To do list using Sockets</h1>
    <div className="status-description">
      <div className="completed-status">
        <div className="block-icon-complete"></div>
        <span className="status-text">complete</span>
      </div>
      <br />
      <div className="incompleted-status">
        <div className="block-icon-incomplete"></div>
        <span className="status-text">Incomplete</span>
      </div>
    </div>
    <ol>
      {todos.map((todo, index) => {
        const deleteTodo = () => {
          socket.emit('delete_todo', todo.id)
        }
        const completeTodo = () => {
          socket.emit('complete_todo', todo.id)
        }
        return <li key={index} className={todo.completed ? 'border-green' : "border-red"}><div className="todoContainer"> {todo.id}. {todo.todo}</div>
          <div className="icons-section">
            <div className="correct-icon" onClick={completeTodo}><i style={{ color: "yellowgreen" }} class="fas fa-check-circle"></i></div>
            <div className="remove-icon" onClick={deleteTodo}><i style={{ color: "red" }} class="fas fa-trash"></i></div>
          </div>
        </li>
      })}
    </ol>
    <form onSubmit={addTodo}>
      <input placeholder="Enter a todo item" className="inputField" value={todo} onChange={(e) => setTodo(e.target.value)} required />
      <br />
      <button>Add Todo</button>
    </form>
  </div>
  </div>
}