import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Container from './components/layout/Container';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import PostsList from './components/pages/Post/PostsList';
import CreatePost from './components/pages/Post/CreatePost';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Ranking from './components/pages/Post/Ranking';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <div className="app">
      <Router>
        <UserProvider>
          <Navbar />
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/CreatePost" element={<CreatePost />} />
              <Route path="/PostsList" element={<PostsList />} />
              <Route path="/user/ranking" element={<Ranking />} />
            </Routes>
          </Container>
          <Footer />
        </UserProvider>
      </Router>
    </div>
  );
}

export default App;
