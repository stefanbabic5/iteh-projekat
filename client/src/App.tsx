import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
      axios.get('http://localhost:8000')
        .then(response => {
          setMessage(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
  
    return (
      <div className="App">
        <h1>{message}</h1>
      </div>
    );
}

export default App;
