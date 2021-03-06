import React,{useState} from 'react';
import './App.css';
import {BrowserRouter,Route,Redirect,Switch} from "react-router-dom";
import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventsPage from "./pages/Events";
import Navigation from "./components/Navigation";
import AuthContext from "./context/auth-context"
function App() {
    const [token,setToken] = useState(null);
    const [userId,setUserId] = useState(null);
    const login = (token,userId,tokenExpiration) =>{
        setToken(token);
        setUserId(userId);
    }
    const logout = () =>{

    }
  return (<BrowserRouter>
          <>
              <AuthContext.Provider value={{
                  token,
                  userId,
                  login,
                  logout
              }}>
              <Navigation/>
              <main className={"main-content"}>
                  <Switch>
                      {!token && <Redirect from="/" to="/auth" exact/>}
                      {token && <Redirect from="/" to="/events" exact/>}
                      {token && <Redirect from="/auth" to="/events" exact/>}
                      {!token && <Route path="/auth" component={AuthPage} />}
                      <Route path="/events" component={EventsPage} />
                      {token && <Route path="/bookings" component={BookingPage} />}
                  </Switch>
              </main>
              </AuthContext.Provider>
                  </>
              </BrowserRouter>
  );
}

export default App;
