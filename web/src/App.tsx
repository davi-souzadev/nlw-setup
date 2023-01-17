import { useState } from "react"
import { Habit } from "./components/Habit"
import "./App.css"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <h1>Hello World</h1>
      <Habit completed={3} />
      <Habit completed={2} />
      <Habit completed={1} />
    </div>
  )
}

export default App
