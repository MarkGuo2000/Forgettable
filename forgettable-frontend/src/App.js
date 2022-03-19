import React, {useState, useEffect} from 'react';
import './index.css';
import {
  BrowserRouter,
} from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import PageRouter from './hoc/PageRouter/PageRouter';
import {AuthContext} from './context/AuthContext';
import auth from './services/auth';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [user, setUserInfo] = useState({});

  useEffect(() => {
    const status = auth.loadLoginStatus();
    console.log('loaded login status:', status);
    if (status.isLoggedIn) {
      setLoggedIn(true);
      setUserInfo(status.userInfo);
    }
  }, []);

  const login = () => {
    setIsLoggingIn(true);

    auth.signIn((ok, user) => {
      if (ok) {
        setUserInfo(user);
        setIsLoggingIn(false);
        setLoggedIn(true);

        auth.persistLoginStatus(user);
      } else {
        setIsLoggingIn(false);
        console.log('error logging in');
      }
    });
  };

  const logout = () => {
    auth.signOut().then(() => {
      setLoggedIn(false);
      setIsLoggingIn(false);
      setUserInfo({});
      auth.clearPersistedLoginStatus();
    });
  };

  return (
    <BrowserRouter>
      <AuthContext.Provider
        value={{isLoggedIn, isLoggingIn, user, login, logout}}
      >
        {isLoggedIn ?? <NavBar />}
        <PageRouter/>

      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
