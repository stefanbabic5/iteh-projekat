import {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import 'rsuite/dist/rsuite.min.css';
import { User } from './types';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import UserNavbar from './components/UserNavbar';
import ShopPage from './components/ShopPage';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
    const [user, setUser] = useState<User | undefined>(undefined);

    useEffect(() => {
      axios.get('/check').then(res => {
        setUser(res.data);
      })
    }, [])

    const onLogout = async () => {
      await axios.post('/logout');
      setUser(undefined);
    }

    if (!user) {
      return (
        <BrowserRouter>
          <div className='app-container'>
            <Routes>
              <Route path='*' element={<Login onSubmit={async val => {
                const res = await axios.post('/login', val);
                setUser(res.data);
              }}/>} />
              <Route path='/register' element={<Register onSubmit={async val => {
                const res = await axios.post('/register', val);
                setUser(res.data);
              }} />} />
            </Routes>
          </div>
        </BrowserRouter>
      )
    }

    if (!user.admin) {
      return (
        <UserApp user={user} onLogout={onLogout} />
      )
    }
  
    return null;
}

interface UserProps {
  user: User,
  onLogout: () => void
}

function UserApp(props: UserProps) {
  return (
    <BrowserRouter>
      <UserNavbar onLogout={props.onLogout} user={props.user} />
      <div className='app-container'>
        <Routes>
          <Route path='*' element={(<Home />)} />
          <Route path='/shop' element={(<ShopPage />)} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
