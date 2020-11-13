import { createContext, useContext, useEffect, useReducer } from "react";

function appReducer(state, action) {
  switch (action.type) {
    case 'initdata':
      console.log(action)
      return action.payload
    case 'add':
      return [
      ...state,  
      {
        id: Date.now(),
        text: '',
        completed: false
        }]
    case "delete":
      return state.filter(item => (
        item.id !== action.payload
      ))
    case "check":
      return state.map(item => {
        if (item.id === action.payload) {
          return {
            ...item,
            completed: !item.completed
          }
        }
        return item
      })
    case 'write': 
      return state.map(item => {
        console.log(item)
        if (item.id === action.payload.id) {
          return {
            ...item,
            text: action.payload.text
          }
        }
        return item
      })
    default:
      return state;
  }
}
const Context = createContext(); 

export default function App() {
  const initState = localStorage.getItem('stringList')
  let list;
  if (!initState) {
    list = []
  } else {
    list = JSON.parse(initState)
  }
  console.log(initState)
  const [state, dispatch] = useReducer(appReducer, [])
  useEffect(() => {
    dispatch({ type: 'initdata', payload: list})
  }, []);

  useEffect(() => {
    localStorage.setItem('stringList',JSON.stringify(state))
  },[state])
  return (
    <Context.Provider value={dispatch}>
      <h1>ToDoList</h1>
      <button onClick={() => dispatch({type:"add"})}>Add</button>
      <ToDoList items={state} />
    </Context.Provider>
  );
}

function ToDoList({ items }) {
  console.log(items)
  return (
    <>
      {items ? items.map(item => (
        <ListItem key={item.id} {...item} />
      )) : null}
    </>
  )
}

function ListItem({ id, completed, text }) {
  const dispatch = useContext(Context)
  return (
    <div>
      <span key={id}>
        {id}
      </span>
      <input type="checkbox" checked={completed} onChange={() => dispatch({ type: "check", payload: id })} />
      <input type="text" onChange={(e) => dispatch({ type: 'write', payload: { id, text: e.target.value }})} value={text} />
      <button onClick={() => dispatch({ type: 'delete', payload: id })}>Delete</button>
    </div>
  )
}
