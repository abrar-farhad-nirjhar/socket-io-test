const io = require('socket.io')(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    },
})

let todos = []

io.on("connection", (socket) => {
    socket.emit('getInitialTodos', todos)
    socket.on('add_todo', (data) => {
        todos.push(data)
        io.emit('changed_data', todos)
    })
    socket.on('delete_todo', (id) => {
        todos = todos.filter((todo) => todo.id !== id)
        socket.emit('changed_data', todos)
    }
    )

    socket.on('complete_todo', (id) => {
        todos.forEach((element) => {
            if (element.id === id) {
                element.completed = true
            }
        })
        socket.broadcast.emit('changed_data', todos)
    })

})