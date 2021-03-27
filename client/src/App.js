import { useEffect, useContext, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useParams } from 'react-router-dom';

import { CartContextProvider } from "./contexts/cartContext";
import { UserContext } from "./contexts/userContext";

import 'bootstrap/dist/css/bootstrap.min.css';

import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Menus from './pages/Menus';
import CartOrder from './pages/CartOrder';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import IncomeTransaction from './pages/IncomeTransaction';
import ProfilePartner from './pages/ProfilePartner';
import EditProfilePartner from './pages/EditProfilePartner';
import AddProduct from './pages/AddProduct';

import { API, setAuthToken } from "./config/api";
import { useQuery } from "react-query";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(UserContext);
  console.log("APP", state);
  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 401) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data;
      payload.token = localStorage.token;

      dispatch({
        type: "LOGIN_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);


  return (
    <CartContextProvider>
      <Router>
        <div className="bg-yellow">
          <Navbar />
        </div>
        <Switch>
          <Route path="/menus/:id">
            <Menus />
          </Route>
          <Route path="/cart-order">
            <CartOrder />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/edit-profile">
            <EditProfile />
          </Route>
          <Route path="/income-transaction">
            <IncomeTransaction />
          </Route>
          <Route path="/profile-partner">
            <ProfilePartner />
          </Route>
          <Route path="/edit-profile-partner">
            <EditProfilePartner />
          </Route>
          <Route path="/add-product">
            <AddProduct />
          </Route>
          <Route path="/">
            <Landing />
          </Route>
        </Switch>
      </Router>
    </CartContextProvider>
  );
}

export default App;
