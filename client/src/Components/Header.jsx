import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setsearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const urlparams = new URLSearchParams(window.location.search);
      urlparams.set("searchTerm", searchTerm);
      const searchQuery = urlparams.toString();
      navigate(`/search?${searchQuery}`);
      console.log(searchQuery);
    } catch (error) {}
  };
  useEffect(() => {
    const urlparams = new URLSearchParams(window.location.search);
    const searchUrlForm = urlparams.get("searchTerm");
    setsearchTerm(searchUrlForm);
  }, [window.location.search]);

  return (
    <header className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
          <span className="text-slate-500">U-</span>
          <span className="text-slate-800">Real</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex item-center"
        >
          <input
            className="bg-transparent focus:outline-none"
            type="text"
            placeholder="search..."
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex gap-5">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                className="rounded-full w-7 h-7"
                src={currentUser.avatar}
                alt="profile"
              ></img>
            ) : (
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Sign In
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
