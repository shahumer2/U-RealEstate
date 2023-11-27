import React, { useState } from "react";
// import { useSelector } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth.jsx";

import {
  signInstart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice.js";

export default function Signin() {
  const [formData, setformData] = useState({});
  // const [error, seterror] = useState(null);
  // const [loading, setloading] = useState(false);
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInstart());

      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));

        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="p-3 max-w-lg m-auto">
      <h1 className="text-3xl text-center my-7 font-semibold my-7">Sign in</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          id="email"
          className="rounded-lg border p-3"
          onChange={handleChange}
        ></input>
        <input
          type="password"
          placeholder="Enter Password"
          id="password"
          className="rounded-lg border p-3"
          onChange={handleChange}
        ></input>
        <button
          disabled={loading}
          className="  bg-slate-700 text-white p-3 rounded-lg hover:opacity-95"
        >
          {loading ? "loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="my-4">
        <span className="text-slate-70"> Dont have an account? </span>
        <Link to="/signup">
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
