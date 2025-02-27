import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <>
    <Toaster position='bottom-right' toastOptions={{duration:2000}}/>
    </>  
  )
}

export default App
