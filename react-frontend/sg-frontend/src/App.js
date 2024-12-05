import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Container } from "reactstrap";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateGroup from "./components/CreateGroup";
import GroupDetails from "./components/GroupDetails";
import PrivateChat from "./components/PrivateChat";
import ChatList from "./components/ChatList";
import GroupList from "./components/GroupList";
import PeopleList from "./components/PeopleList";
import ProfilePage from "./components/ProfilePage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createGroup" element={<CreateGroup />} />
        <Route path="/groupDetails" element={<GroupDetails />} />
        <Route path="/privateChat" element={<PrivateChat />} />
        <Route path="/conversations" element={<ChatList />} />
        <Route path="/joinGroup" element={<GroupList />} />
        <Route path="/connectionSearch" element={<PeopleList />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
