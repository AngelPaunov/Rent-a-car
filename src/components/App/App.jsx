import React from "react";
import Header from "../../layout/Header/Header";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "../Home/Home";
import Footer from "../../layout/Footer/Footer";
import Users from "../Users/Users";
import UserDetails from "../Users/UserDetails/UserDetails";
import UserForm from "../Users/UserForm/UserForm";
import Register from "../Auth/Register/Register";
import Login from "../Auth/Login/Login";
import AuthGuard from "../Auth/AuthGuard";
import UnauthGuard from "../Auth/UnauthGuard";
import Cars from "../Cars/Cars";
import CarDetails from "../Cars/CarDetails/CarDetails";
import CarForm from "../Cars/CarForm/CarForm";
import AdminGuard from "../Auth/AdminGuard";
import Bookings from "../Bookings/Bookings";

function App() {
  return (
    <div className="App">
      <Header />
      <section className="content">
        <Routes>
          <Route path="/login" element={<UnauthGuard><Login /></UnauthGuard>} />
          <Route path="/register" element={<UnauthGuard><Register /></UnauthGuard>} />
          <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />

          <Route path="/users" element={<AdminGuard><Users /></AdminGuard>} />
          <Route path="/users/:id" element={<AdminGuard><UserDetails /></AdminGuard>} />
          <Route path="/user/create" element={<AdminGuard><UserForm /></AdminGuard>} />
          <Route path="/user/edit/:id" element={<AdminGuard><UserForm /></AdminGuard>} />
          
          <Route path="/bookings/:userId" element={<AuthGuard><Bookings /></AuthGuard>} />

          <Route path="/cars" element={<AuthGuard><Cars /></AuthGuard>} />
          <Route path="/cars/:id" element={<AuthGuard><CarDetails /></AuthGuard>} />

          <Route path="/car/create" element={<AdminGuard><CarForm /></AdminGuard>} />
          <Route path="/car/edit/:id" element={<AdminGuard><CarForm /></AdminGuard>} />
        </Routes>
      </section>
      <Footer />
    </div>
  );
}

export default App;
