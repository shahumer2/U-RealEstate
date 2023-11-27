import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
} from "react-icons/fa";

import { useSelector } from "react-redux";
import Contact from "../Components/Contact";

export default function ShowListing() {
  SwiperCore.use([Navigation]);
  const [Listing, setListing] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [error, seterror] = useState(false);
  const [contact, setcontact] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser._id, "uuuuuu");
  const params = useParams();
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          seterror(true);
          return;
        }
        setListing(data);
        setLoading(false);
        seterror(false);
      } catch (error) {
        seterror(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {Loading && <p className="text-3xl text-center my-4">Loading...</p>}
      {error && (
        <p className="text-3xl text-red-700 text-center my-4">
          Something Went Wrong..
        </p>
      )}
      {Listing && !error && !Loading && (
        <div>
          <Swiper navigation>
            {Listing.imageUrl.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[400px] "
                  style={{
                    background: `url(${url}) center no-repeat `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="items-center mx-20">
            <p className=" flex flex-col text-3xl font-semibold p-3 uppercase">
              {Listing.name}
              <span className="text-xl my-2">
                Price: {Listing.regularPrice + " $"}
                {Listing.type === "rent" && " /Month"}
              </span>
            </p>
            <p className=" flex gap-3 items-center text-slate-700 my-2 mx-3">
              <FaMapMarkerAlt className="text-green-700" />
              {Listing.adress}
            </p>
            <div className="flex p-2">
              <p className=" mx-2 p-1 bg-red-800 w-full max-w-[150px] text-center rounded-lg text-white">
                {Listing.type === "rent" ? "For Rent" : "For Sale"}
              </p>
              {Listing.offer && (
                <p className=" mx-2 p-1 bg-green-800 w-full max-w-[150px] text-center rounded-lg text-white">
                  {Listing.regularPrice - Listing.discountPrice + "  $Discount"}
                </p>
              )}
            </div>
            <div className="mx-2 p-2">
              <p className="text-slate-700 text-xl">
                <span className="text-3xl text-semibold text-black-700">
                  Description:-
                </span>

                {Listing.description}
              </p>
              <ul className="flex p-3 gap-8 text-xl font-semibold flex-wrap">
                <li className="flex gap-3 text-green-800 items-center">
                  <FaBed className="text-lg" />
                  {Listing.bedrooms > 1
                    ? `${Listing.bedrooms}` + "  beds"
                    : `${Listing.bedrooms}` + "  bed"}
                </li>
                <li className="flex gap-3 text-red-800 items-center">
                  <FaBath className="text-lg" />
                  {Listing.bathrooms > 1
                    ? `${Listing.bathrooms}` + "  bathrooms"
                    : `${Listing.bathrooms}` + "  bathroom"}
                </li>
                <li className="flex gap-3 text-green-800 items-center">
                  <FaParking className="text-lg" />
                  {Listing.parking ? "  Parking" : "  No Parking"}
                </li>
                <li className="flex gap-3 text-red-800 items-center">
                  <FaChair className="text-lg" />
                  {Listing.furnished ? "  Furnished" : "  Not Furnished"}
                </li>
              </ul>

              {currentUser &&
                Listing.userRef !== currentUser._id &&
                !contact && (
                  <button
                    onClick={() => setcontact(true)}
                    className="p-2 my-2 bg-slate-700 mx-20 text-white w-full  max-w-[600px]"
                  >
                    Contact Landlord
                  </button>
                )}
              {contact && <Contact Listing={Listing} />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
