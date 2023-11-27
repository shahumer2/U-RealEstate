import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { IoMdMail } from "react-icons/io";
import "swiper/css/bundle";
import ListingItem from "../Components/ListingItem.jsx";
import { FaWindows } from "react-icons/fa";
export default function Home() {
  SwiperCore.use([Navigation]);
  const [offerListing, setofferListing] = useState([]);
  const [rentListing, setrentListing] = useState([]);
  const [saleListing, setsaleListing] = useState([]);

  console.log(saleListing, "igot it buddy");
  console.log(offerListing, "i got it again buddy");
  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?offer=true&limit=5`);
        const data = await res.json();
        setofferListing(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=rent&limit=5`);

        const data = await res.json();
        setrentListing(data);
        fetchSaleListing();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`/api/listing/getListing?type=sale&limit=5`);
        const data = await res.json();
        setsaleListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListing();
  }, []);
  const handleCLick = () => {
    window.location.href = `mailto:${"shah.umer8493@gmail.com"}`;
  };
  return (
    <div>
      {/* top SIde */}
      <div className="p-7 pt-20">
        <h1 className="text-2xl font-semibold md:text-5xl">
          Find Your Next <span className="text-slate-500">Perfect</span>
          <br className="pt-3" />
          Place With Ease
        </h1>
        <div className="pt-5">
          <p className="text-slate-700 font-semibold text-sm md:text-xl">
            U-Estate helps you to find Your Dream House With The is the perfect
            Best Quality Of Houses In Minimum amount
            <br />
            You Can Sell Rent Or Take Rooms At Ease
          </p>
        </div>
        <div className="pt-5">
          <Link
            className="text-blue-700 font-semibold hover:underline text-lg md:text-2xl"
            to={`/search`}
          >
            Lets Start Finding.
          </Link>
        </div>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing.imageUrl}>
              <div
                className="h-[400px] "
                style={{
                  background: `url(${listing.imageUrl}) center no-repeat `,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listings */}
      <div className="max-w-6xl mx-auto flex flex-col gap-7 my-10">
        {offerListing && offerListing.length > 0 && (
          <div>
            <div className="p-2 pt-2 pb-5">
              <h2 className="text-2xl text-slate-600 font-semibold">
                Recent Offers
              </h2>
              <Link
                className="text-yellow-700 hover:underline"
                to={`/search?offer=true`}
              >
                Show More..
              </Link>
            </div>
            {/* flex-wrap if extra it go down in small */}
            <div className="flex flex-wrap gap-7 hover:scale-7">
              {offerListing.map((listing) => (
                <ListingItem listing={listing}></ListingItem>
              ))}
            </div>
          </div>
        )}
        {saleListing && saleListing.length > 0 && (
          <div>
            <div className="p-2 pt-2 pb-5">
              <h2 className="text-2xl text-slate-600 font-semibold">
                Recent Places For Sale
              </h2>
              <Link
                className="text-yellow-700 hover:underline"
                to={`/search?type=sales`}
              >
                Show More..
              </Link>
            </div>
            {/* flex-wrap if extra it go down in small */}
            <div className="flex flex-wrap gap-4">
              {saleListing.map((listing) => (
                <ListingItem listing={listing}></ListingItem>
              ))}
            </div>
          </div>
        )}
        {rentListing && rentListing.length > 0 && (
          <div>
            <div className="p-2 pt-2 pb-5 gap-4">
              <h2 className="text-2xl text-slate-600 font-semibold">
                Recent Places For Rent
              </h2>
              <Link
                className="text-yellow-700 hover:underline"
                to={`/search?type=rent`}
              >
                Show More..
              </Link>
            </div>
            {/* flex-wrap if extra it go down in small */}
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingItem listing={listing}></ListingItem>
              ))}
            </div>
          </div>
        )}
      </div>
      <footer className="flex flex-col items-center pt-3">
        <p className="text-sm text-slate-500">Developed By: Shah Umer</p>
        <p className="pt-3 pb-3">
          <IoMdMail
            className="text-2xl hover:cursor-pointer"
            onClick={handleCLick}
          />
        </p>
      </footer>
    </div>
  );
}
