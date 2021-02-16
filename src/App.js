import "./App.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import EditContact from "./pages/EditContact";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/forgotpassword" component={ForgotPassword} />

          <Route exact path="/reset/:token" component={ResetPassword} />
          <Route exact path="/changepassword" component={ChangePassword} />
          <Route exact path="/dashboard" component={Dashboard} />

          <Route exact path="/editcontact/:id" component={EditContact} />

          <Route exact path="/contacts" component={Contact} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
