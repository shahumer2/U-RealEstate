import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import ProtectedRoute from "./Components/ProtectedRoute";
import About from "./pages/About";
import Home from "./pages/Home";
import Listing from "./pages/Listing";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import ShowListing from "./pages/ShowListing";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import UpdateListing from "./pages/UpdateListing";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/search" element={<Search />} />
        <Route path="/listing/:listingId" element={<ShowListing />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<Listing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
