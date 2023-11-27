import React from "react";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useDispatch } from "react-redux";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInFailure,
  signOutFailure,
  signOutSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";
export default function Profile() {
  const fileRef = useRef();
  const [file, setfile] = useState(undefined);
  const [filePercentage, setfilePercentage] = useState(0);
  const [formData, setformData] = useState({});
  const [err, seterr] = useState(false);
  const [saveUser, setsaveUser] = useState(false);
  const [listingError, setlistingError] = useState(false);
  const [userListing, setuserListing] = useState([]);
  const dispatch = useDispatch();

  console.log(filePercentage, "rupa");
  console.log(formData, "nooooooooooooo");
  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    // we have to reate file name  by date so that if someone can upload it two time it gets different

    const fileName = new Date().getTime() + file.name;
    console.log(fileName, "proo");
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setfilePercentage(Math.round(progress));
        console.log("upload is" + progress + "% is done ");
      },
      (err) => {
        seterr(true);
      },
      () => {
        // Execute this block when the upload is 100% complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setformData({
            ...formData,
            avatar: downloadURL,
          })
        );
      }
    );
  };
  const handleChange = (e) => {
    setformData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/updateUser/${currentUser._id}`, {
        method: "POST",
        headers: {
          "content-Type": " application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if ((data.Success = false)) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setsaveUser(true);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/deleteUser/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.Success === false) {
        return dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };
  const handleSignout = async (req, res, next) => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "GET",
      });
      const data = await res.json();
      if (data.Success === false) {
        next(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
    } catch (error) {
      next(signOutFailure(error));
    }
  };
  const handleShowListing = async () => {
    try {
      setlistingError(false);
      const data = await fetch(`/api/user/listings/${currentUser._id}`);
      const res = await data.json();
      if (res.Success === false) {
        setlistingError(true);
      }
      setuserListing(res);
    } catch (error) {
      setlistingError(error.message);
    }
  };
  const handlelistingDelete = async (id) => {
    const res = await fetch(`/api/listing/delete/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (data.Success === false) {
      console.log(data.message);
      return;
    }
    // to sho the remaining listings we have to use filter method
    setuserListing((prev) => prev.filter((listin) => listin._id !== id));
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center p-4 font-semibold">PROFILE</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setfile(e.target.files[0])}
          className="hidden"
          type="file"
          accept="image/"
          ref={fileRef}
        ></input>
        <img
          onClick={() => fileRef.current.click()}
          className="self-center rounded-full h-24 w-24"
          src={formData.avatar || currentUser.avatar}
          alt="profile"
        ></img>
        <p className="self-center">
          {filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-red-700 text-center">
              {"uploading" + filePercentage}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700 text-center">
              {" "}
              File Uploaded Successfully
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="Username"
          className="rounded-lg p-3"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        ></input>
        <input
          type="email"
          placeholder="Email"
          className="rounded-lg p-3"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        ></input>
        <input
          type="text"
          placeholder="Password"
          className="rounded-lg p-3"
          id="password"
          onChange={handleChange}
        ></input>
        <button className="bg-slate-700 text-white rounded-lg p-3">
          {loading ? "loading..." : "Update User"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg text-center"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between p-3">
        <span onClick={handleDelete} className="text-red-800 cursor-pointer ">
          Delete Account
        </span>
        <span onClick={handleSignout} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-800 mt-5 text-center">
        {saveUser ? " Updated User Successfully" : ""}
      </p>
      <button
        onClick={handleShowListing}
        className=" w-full border border-lg p-2 justify-between border-green-700  hover:shadow-lg text-center"
      >
        {" "}
        Show listing
      </button>
      {userListing &&
        userListing.length > 0 &&
        userListing.map((list) => (
          <div
            key={list._id}
            className=" flex justify-between  gap-4 items-center p-3 border border-lg"
          >
            <Link to={`/listing/${list._id}`}>
              <img
                className="h-16 w-16 object-contain"
                src={list.imageUrl[0]}
                alt="image"
              />
            </Link>
            <Link className="flex-1 text-semiBold" to={`/listing/${list._id}`}>
              <p className="text-slate-700 font-semibold">{list.name}</p>
            </Link>
            <div className="flex flex-col">
              <button
                onClick={() => handlelistingDelete(list._id)}
                className="text-red-700 uppercase text-xl"
              >
                <MdDelete />
              </button>
              <Link to={`/update-listing/${list._id}`}>
                <button className="text-green-700 uppercase text-xl mt-2">
                  <MdModeEdit />
                </button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
}
