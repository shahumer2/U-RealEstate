import { current } from "@reduxjs/toolkit";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Listing() {
  const [files, setfiles] = useState([]);
  const [imageUploadError, setimageUploadError] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    imageUrl: [],
    name: "",
    description: "",
    adress: "",
    type: "rent",
    bathrooms: 1,
    bedrooms: 1,
    regularPrice: 0,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  console.log(files);
  console.log(formData, "yes form");
  console.log(JSON.stringify(formData), "noooooookjsxj");
  const handleUpload = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrl.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setformData({ ...formData, imageUrl: formData.imageUrl.concat(url) });
          setimageUploadError(false);
        })
        .catch((error) => {
          setimageUploadError(true);
        });
    } else {
      setimageUploadError("you can only upload 6 images");
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("image is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };
  const handleDelete = (index) => {
    setformData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };
  const handleChange = (e) => {
    if (e.target.id === "rent" || e.target.id === "sale") {
      setformData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setformData({
        ...formData,
        //e.target.check can be true of false
        // by array bracked we get the variable not the value
        [e.target.id]: e.target.checked,
      });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setformData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrl.length < 1)
        return seterror("you have to select atleast one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return seterror("regular price cannot be less then discount price");
      setloading(true);
      seterror(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      console.log(data, "dataaaaaaaaaaa");
      setloading(false);
      if (data.success === false) {
        seterror(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      seterror(error.message);
      setloading(false);
    }
  };
  return (
    <main className="mx-auto max-w-4xl p-3">
      <h1 className="text-3xl font-semiBold text-center p-3">Create Lisitng</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-3 flex-1 ">
          <input
            className="rounded-lg p-3 border"
            type="text"
            placeholder=" Name"
            id="name"
            required
            onChange={handleChange}
            value={formData.name}
          ></input>
          <textarea
            className="rounded-lg p-3 border"
            type="text"
            placeholder="Description"
            id="description"
            onChange={handleChange}
            value={formData.description}
          ></textarea>
          <input
            className="rounded-lg p-3 border"
            type="text"
            placeholder="Adress"
            id="adress"
            onChange={handleChange}
            value={formData.adress}
          ></input>
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="sale"
                className="w-5 "
                onChange={handleChange}
                checked={formData.type === "sale"}
              ></input>
              <span>sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              ></input>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              ></input>
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              ></input>
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              ></input>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <input
                className="p-3 border border-gray-300 rounded-lg w-20 h-10"
                min="1"
                type="number"
                id="bedrooms"
                onChange={handleChange}
                value={formData.bedrooms}
                required
              ></input>
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-3">
              <input
                className="p-3 border border-gray-300 rounded-lg w-20 h-10"
                min="1"
                type="number"
                id="bathrooms"
                onChange={handleChange}
                value={formData.bathrooms}
                required
              ></input>
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                className="p-3 border border-gray-300 rounded-lg w-20 h-10"
                min="0"
                type="number"
                id="regularPrice"
                onChange={handleChange}
                value={formData.regularPrice}
                required
              ></input>
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-3">
                <input
                  className="p-3 border border-gray-300 rounded-lg w-20 h-10"
                  min="0"
                  type="number"
                  id="discountPrice"
                  onChange={handleChange}
                  value={formData.discountPrice}
                ></input>
                <div className="flex flex-col items-center">
                  <p>Discounted Price</p>
                  <span className="text-xs">($/month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-4 mx-10">
          <div className=" flex flex-row p-3">
            <p className=" font-semibold">Images:</p>
            <span className="font-normal text-gray-700">
              The First Image Will Be The Cover(Max-6){" "}
            </span>
          </div>
          <div>
            <input
              onChange={(e) => setfiles(e.target.files)}
              type="file"
              id="images"
              multiple
              accept="images/*"
            />
            <button
              onClick={handleUpload}
              className="border border-green-700 text-green-600 hover:shadow-lg rounded-lg p-3"
            >
              {" "}
              Upload
            </button>
            {formData.imageUrl.length > 0 &&
              formData.imageUrl.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 items-center"
                >
                  <img
                    className="w-40 h-40 rounded-lg object-contain"
                    src={url}
                    alt="image"
                  ></img>
                  <button
                    onClick={() => handleDelete(index)}
                    className=" p-2 border border-red-600 rounded-lg text-red-700 uppercase hover:opacity-60"
                  >
                    delete
                  </button>
                </div>
              ))}
            <span className="text-red-700 text-center">
              {imageUploadError && imageUploadError}
            </span>
          </div>
          <button className="p-3 bg-slate-700 m-3 text-white rounded-lg uppercase hover:opacity-80">
            {loading ? "creating..." : "create Listing"}
          </button>
          {error ? <p className="text-red-700">{error}</p> : ""}
        </div>
      </form>
    </main>
  );
}
