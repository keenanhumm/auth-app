import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { HomePage } from "./pages/Home";
import { RegisterPage } from "./pages/Register";
import { LoginPage } from "./pages/Login";
import { Nav } from "./components/Nav";

const App: React.FC = () => {
  return (
    <Router>
      <header>
        <Nav />
      </header>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/login" component={LoginPage} />
      </Switch>
    </Router>
  );
};

export default App;
