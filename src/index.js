import React from 'react';
import ReactDOM from 'react-dom/client';
import Todolist from './Todolist';

function App(){
  return(
    <>
      <Todolist />
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


