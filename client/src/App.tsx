import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import 'rsuite/dist/rsuite.min.css';
import { CartItems, Item, TargetLocation, User } from './types';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Register from './components/Register';
import UserNavbar from './components/UserNavbar';
import ShopPage from './components/ShopPage';
import ItemShowPage from './components/ItemShowPage';
import CartPage from './components/CartPage';
import { check, login, logout, register } from './servis/loginServis';
import { Loader } from 'rsuite';
import AdminApp from './components/admin/AdminApp';

axios.defaults.baseURL = 'http://localhost:8000';

export default function App() {
    //const navigate = useNavigate();
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    //const navigation = useNavigate();

    useEffect(() => {
      check().then(res => {
        setUser(res);
      }).catch((err) => {
       // navigation('/')
      }).finally(() => {
        setLoading(false)
      });
    }, []);

    useEffect(() => {
      if (!user && !loading) {
        //navigation('/');
      }
    }, [user, loading])
    if (loading) {
      return (
        <Loader />
      )
    }
  // useEffect(() => {
  //   check().then(res=>{
  //     setUser(res.data);
  //   }).catch((err)=> {
  //     console.log(err)
  //   })
  // })

  if (user === undefined) {
    return (
      <BrowserRouter>
        <Routes>          
          <Route path='*' element={<Login onSubmit={async data => {
            const res = await login(data);
            setUser(res);
          }} />} />
          <Route path='/register' element={<Register onSubmit={async (data) => {
            const user1 = await register(data);
            setUser(user1);
          }} />} />
          <Route path='/*' element={<Navigate to='/'/>}/>
        </Routes>
      </BrowserRouter>
    )
  }


    if (!user.admin) {
      return (
        <UserApp user={user} onLogout={async () => {
          await logout();
          setUser(undefined);
        }} />
      )
    }
  
    return (
      <AdminApp user={user} onLogout={async () => {
        await logout();
        setUser(undefined);
      }} />
    )
}

interface UserProps {
  user: User,
  onLogout: () => void
}

function UserApp(props: UserProps) {
  const [cartItems, setCartItems] = useState<CartItems>({})


  const changeItem = (item: Item, val: number, merge = true) => {
    setCartItems(prev => {
      return {
        ...prev,
        [item.id!]: {
          count: (merge && prev[item.id!]?.count || 0) + val,
          item
        }
      }
    })
  }

  const orderUp = async (tl: Partial<TargetLocation>) => {
    await axios.post('/order', {
      targetLocation: tl,
      orderItems: Object.keys(cartItems).map((key: string) => {
        return {
          itemId: Number(key),
          count: cartItems[key as any].count
        }
      })
    });
    setCartItems({});
  }

  return (
    <BrowserRouter>
      <UserNavbar onLogout={props.onLogout} user={props.user} />
      <Routes>
        <Route path='/' element={(
          <div className='app-container'>
            <Home />
          </div>
        )} />
        <Route path='/shop' element={(<ShopPage />)} />
        <Route path='/cart' element={(
          <div className='app-container'>
            <CartPage 
              onSubmit={orderUp}
              cartItems={cartItems}
              onItemChange={(item, val) => {
                changeItem(item, val, false);
              }}
            />
          </div>
        )} />
        <Route path='/item/:id' element={(
          <div className='app-container' >
            <ItemShowPage addToCart={id => {
              changeItem(id, 1);
            }} />
          </div>
        )} />
      </Routes>
    </BrowserRouter>
  )
}

//export default App;
