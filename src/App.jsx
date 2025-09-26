import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import ExerciseDetail from './pages/ExerciseDetail'
import Plans from './pages/Plans'
import { Container, Navbar, Nav } from 'react-bootstrap'

export default function App(){
  return (
    <BrowserRouter basename="/my-gym-buddy">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img src="/logo.png" alt="MyGymBuddy" height="48" className="me-2" />
            <span className="fw-bold">MyGymBuddy</span>
          </Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/plans" className="fw-medium">My Plan</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/exercise/:id" element={<ExerciseDetail/>} />
          <Route path="/plans" element={<Plans/>} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
