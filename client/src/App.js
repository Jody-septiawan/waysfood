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
import Transaction from './pages/Transaction';

import { API, setAuthToken } from "./config/api";
import PrivateRoute from "./components/PrivateRoute";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [state, dispatch] = useContext(UserContext);
  // console.log("APP", state);
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
          <PrivateRoute exact path="/menus" component={Menus} />
          <PrivateRoute exact path="/profile" component={Profile} />
          <PrivateRoute exact path="/cart-order" component={CartOrder} />
          <PrivateRoute exact path="/add-product" component={AddProduct} />
          <PrivateRoute exact path="/edit-profile" component={EditProfile} />
          <PrivateRoute exact path="/Transaction/:id" component={Transaction} />
          <PrivateRoute exact path="/profile-partner" component={ProfilePartner} />
          <PrivateRoute exact path="/income-transaction" component={IncomeTransaction} />
          <PrivateRoute exact path="/edit-profile-partner" component={EditProfilePartner} />
          <Route exact path="/" component={Landing} />
        </Switch>
      </Router>
    </CartContextProvider>
  );
}

export default App;
