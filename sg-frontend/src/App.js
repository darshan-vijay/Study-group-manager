import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import CreateGroup from "./components/CreateGroup";
import GroupDetails from "./components/GroupDetails";
import PrivateChat from "./components/PrivateChat";
import ChatList from "./components/ChatList";
import GroupList from "./components/GroupList";
import PeopleList from "./components/PeopleList";
import ProfilePage from "./components/ProfilePage";
import { SocketProvider } from "./components/SocketContext";

function App() {
  return (
    <SocketProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/createGroup" element={<CreateGroup />} />
          <Route path="/groupDetails/:groupId" element={<GroupDetails />} />
          <Route path="/privateChat/:recipientId" element={<PrivateChat />} />
          <Route path="/conversations" element={<ChatList />} />
          <Route path="/joinGroup" element={<GroupList />} />
          <Route path="/connectionSearch" element={<PeopleList />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </SocketProvider>
  );
}

export default App;
