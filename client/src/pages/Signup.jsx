import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth.jsx";

export default function Signup() {
  const [formData, setformData] = useState({});
  const [error, seterror] = useState(null);
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if (data.success === false) {
      setLoading(false);
      seterror(data.message);
      return;
    }
    setLoading(false);
    seterror("");
    navigate("/signin");
    console.log(data);
  };
  console.log(formData);
  return (
    <div className="p-3 max-w-lg m-auto">
      <h1 className="text-3xl text-center my-7 font-semibold my-7">Sign UP</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="rounded-lg border p-3"
          onChange={handleChange}
        ></input>
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
          disabled={Loading}
          className="  bg-slate-700 text-white p-3 rounded-lg hover:opacity-95"
        >
          {Loading ? "Loading..." : "Signup"}
        </button>
        <OAuth />
      </form>
      <div className="my-4">
        <span className="text-slate-70">have an account? </span>
        <Link to="/signin">
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
