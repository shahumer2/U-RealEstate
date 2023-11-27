import React, { useState } from "react";
import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import ListingItem from "../Components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const [sidebarData, setsidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_At",
    order: "desc",
  });
  const [Loading, setLoading] = useState(false);
  const [Listing, setListing] = useState([]);
  const [showmore, setshowmore] = useState(false);
  useEffect(() => {
    const urlParam = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParam.get("searchTerm");
    const TypeFormUrl = urlParam.get("type");
    const parkingFormUrl = urlParam.get("parking");
    const furnishedFormUrl = urlParam.get("furnished");
    const offerFormUrl = urlParam.get("offer");
    const sortFormUrl = urlParam.get("sort");
    const orderFormUrl = urlParam.get("order");
    if (
      searchTermFormUrl ||
      TypeFormUrl ||
      parkingFormUrl ||
      furnishedFormUrl ||
      offerFormUrl ||
      sortFormUrl ||
      orderFormUrl
    ) {
      setsidebarData({
        searchTerm: searchTermFormUrl,
        type: TypeFormUrl || "all",
        parking: parkingFormUrl === "true" ? true : false,
        furnished: furnishedFormUrl === "true" ? true : false,
        offer: offerFormUrl === "true" ? true : false,
        sort: sortFormUrl || "created_at",
        order: orderFormUrl || "desc",
      });
    }
    const listingItems = async () => {
      setLoading(true);
      setshowmore(false);
      const searchQuery = urlParam.toString();
      const res = await fetch(`/api/listing/getListing?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setshowmore(true);
      } else {
        setshowmore(false);
      }
      setListing(data);
      setLoading(false);
      console.log(data, "yuhu");
    };
    listingItems();
  }, [location.search]);

  console.log(sidebarData, "nope");
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setsidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setsidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setsidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_At";
      const order = e.target.value.split("_")[1] || "desc";
      setsidebarData({ ...sidebarData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);

    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async () => {
    const numberOfListing = Listing.length;
    console.log(Listing.length, "Lisiljlcn");
    const startIndex = numberOfListing;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    console.log(searchQuery, "query");
    const res = await fetch(`/api/listing/getListing?${searchQuery}`);
    const data = await res.json();
    console.log(data, "show data");
    if (data.length < 9) {
      setshowmore(false);
    }
    setListing([...Listing, ...data]);
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-2  border-r-2 md:border-b-3 md:min-h-screen">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 p-5 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term :
            </label>
            <input
              className="p-1.5 rounded-lg border border-slate-600 w-full"
              type="text "
              id="searchTerm"
              placeholder="search..."
              value={sidebarData.searchTerm}
              onChange={handleChange}
            ></input>
          </div>
          <div className="flex gap-3 p-2">
            <label className="font-semibold">Type :</label>
            <div className="flex gap-2 word-wrap">
              <input
                type="checkbox"
                id="all"
                onChange={handleChange}
                checked={sidebarData.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2 word-wrap">
              <input
                type="checkbox"
                id="rent"
                onChange={handleChange}
                checked={sidebarData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 word-wrap">
              <input
                type="checkbox"
                id="sale"
                onChange={handleChange}
                checked={sidebarData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 word-wrap">
              <input
                type="checkbox"
                id="offer"
                onChange={handleChange}
                checked={sidebarData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-3 p-2">
            <label className="font-semibold">Amenties :</label>
            <div className="flex gap-2 word-wrap">
              <input
                type="checkbox"
                id="parking"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 word-wrap">
              <input
                type="checkbox"
                id="furnished"
                onChange={handleChange}
                checked={sidebarData.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center py-4">
            <label className="mx-2 font-semibold"> Sort: </label>
            <select
              id="sort_order"
              className="border border-slate-500 p-1 rounded-lg"
              defaultChecked={"created_At_desc"}
              onChange={handleChange}
            >
              <option value="regularPrice_desc">Price High To Low</option>
              <option value="regularPrice_asc">Price Low to High</option>
              <option value="createdAt_desc">Newest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 w-full p-2 rounded-lg text-white">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1 flex-row gap-4 items-center">
        <div className=" text-3xl font-semibold text-slate-700 uppercase gap-3 border-green-700 p-3">
          <h1>Listing Results</h1>
          <div className="  text-lg  ">
            {!Loading && Listing.length === 0 && (
              <p className="text-xl p-3 text-red-700">"No Listing Found !!"</p>
            )}
            {Loading && (
              <p className="text-center mx-8 w-full text-xl">Loading...</p>
            )}
            <div className="p-7 flex flex-wrap gap-3">
              {!Loading &&
                Listing &&
                Listing.map((list) => (
                  <ListingItem key={list._id} listing={list} />
                ))}
            </div>
            {showmore && (
              <button
                onClick={onShowMoreClick}
                className="text-green-700 hover:underline"
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
