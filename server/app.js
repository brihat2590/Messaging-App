import express from "express"
import { Server } from "socket.io"
import {createServer} from "http"
const app=express()
const server=createServer(app)
const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"],
        credentials:true,
    }
})

app.get("/",(req,res)=>{
    res.send("hello world")
})
io.on("connection",(socket)=>{
    console.log(`${socket.id.substring(0,5)} connected to the server`)
    socket.emit("welcome",`welcome to the server `)
    socket.broadcast.emit("welcome",`${socket.id.substring(0,5)} joined the room`)
    socket.on("disconnect",()=>{
        console.log(`${socket.id.substring(0,5)} disconnected from the server`)
    })
    socket.on("message",({room,message})=>{
        console.log({room,message})
        io.to(room).emit("receive-message", message)
    })
    socket.on("join-room",(room)=>{
        socket.join(room)
    })
    
})




server.listen(3000,()=>{
    console.log("listening on port 3000")
})