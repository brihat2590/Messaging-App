import React, { useEffect, useMemo, useState } from 'react'
import {io} from "socket.io-client"
import { Button, Container, TextField, Typography } from '@mui/material'

function App() {
  const socket=useMemo(()=>io("http://localhost:3000"),[]) 
  const [message,setMessage]=useState('')
  const [room,setRoom]=useState('')
  const[socketId,setSocketId]=useState('')
  const[messages,setMessages]=useState([])
  const[roomName,setRoomName]=useState('')
  const handleSubmit=(e)=>{
    e.preventDefault(); 
    socket.emit('message',{message,room})
    setMessage('')


  }
  const joinRoomHandler=(e)=>{
    e.preventDefault();
    socket.emit("join-room",roomName)
    setRoomName('')
  }
  
  useEffect(()=>{
    socket.on("connect",()=>{
      console.log("connected")
      setSocketId(socket.id)
    });
    
    socket.on("receive-message",(data)=>{
      console.log(data)
      setMessages((messages)=>[...messages, data])
    })
    socket.on("welcome", (s) => {
      console.log(s);
    });

    return () => {
      socket.disconnect();
    };
    },[])
  
  return (
    
      <Container maxWidth="sm">
        <Typography variant='h1' component='div' gutterBottom>
          <span className='bg-gradient-to-r from-red-500 to-red-800 text-transparent bg-clip-text'>Welcome to</span> <span className='bg-gradient-to-r from-orange-500 to-orange-800 bg-clip-text text-transparent'>Chat App</span>
        </Typography>
        <Typography variant='h6' component='div' gutterBottom>{socketId}</Typography>
        <form className='m-5' onClick={joinRoomHandler}>
          <h6>JOIN ROOM</h6>
          <TextField id='outlined-basic' label='Room' variant='outlined' value={roomName} onChange={(e)=>setRoomName(e.target.value)}></TextField>
          <Button variant='contained' color='primary' type='submit' className='h-12'>Submit</Button>
        </form>
        <form onSubmit={handleSubmit}>
          <TextField id='outlined-basic' label='Message' variant='outlined' value={message} onChange={(e)=>setMessage(e.target.value)}></TextField>
          
          <TextField id='outlined-basic' label='Id' variant='outlined' value={room} onChange={(e)=>setRoom(e.target.value)}></TextField>
          <Button variant='contained' color='primary' type='submit' className='h-12'>Submit</Button>
        </form>
        <Typography>{messages.map((m,i)=>(
          <Typography key={i} variant='h7' component='div' gutterBottom>{m}</Typography>

          
        ))}</Typography>
        
      </Container>
      
    
  )
}

export default App