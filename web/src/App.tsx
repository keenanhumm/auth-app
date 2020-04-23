import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import { Nav } from "./components/Nav";
import { UserDetailsPage } from "./pages/UserDetails";
import { getAccessToken, setAccessToken } from "./accessToken";

const App: React.FC = () => {
  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:4000/refresh", {
      method: "POST",
      credentials: "include",
    }).then(async (res) => {
      const { accessToken } = await res.json();
      setAccessToken(accessToken);
      setIsLoading(false);
    });
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <div>Loading...</div>;
  return (
    <Router>
      <header>
        <Nav />
        <p>Access token: {getAccessToken()}</p>
      </header>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/user/:id" component={UserDetailsPage} />
      </Switch>
    </Router>
  );
};

export default App;
