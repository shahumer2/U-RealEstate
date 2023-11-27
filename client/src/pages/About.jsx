import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function About() {
  const [message, setmessage] = useState("");
  const handleChange = (e) => {
    setmessage(e.target.value);
  };
  return (
    <div className="p-9">
      <h1 className="text-center text-3xl font-semibold text-slate-600 pb-7">
        U-
        <span className="text-slate-600">Real Estate</span>
      </h1>
      <div className="text-lg text-slate-700">
        <p>
          Welcome to U-Real Estate. We have been serving the needs of the real
          estate industry in India since 2007. Our single platform is designed
          to meet the needs of buyers, sellers and brokers of India properties.
          Our success is attributed to our understanding of the needs of our
          customers and consistently working to meet those needs utilizing
          innovative e-commerce solutions.
        </p>
        <br />
        <p>
          If you are interested in purchasing a home or locate a rental
          property, you can search India properties using our portal to find the
          right residential property or commercial property to fit your needs.
          Search India properties in our enormous database by the type of
          property, the location and other attributes to quickly locate
          properties that meet your exact specifications
        </p>
        <br />
        <p>
          Do you have a commercial property or residential property to sell or
          rent? You can list your rental property or real estate on our website.
          Our real estate portal is structured to provide wider exposure, so
          your property will be seen by as many buyers as possible for a fast
          response to your listing. There is no charge for listing your
          property, just register with us and enter details and images of your
          property to get started.
        </p>
      </div>
      <div>
        <h1 className="text-center text-5xl font-semibold text-slate-600 pt-7 pb-5">
          Contact Us
        </h1>
        <div className="flex flex-col gap-3 items-center">
          <textarea
            name="message"
            id="message"
            rows="3"
            className="w-full max-w-[500px] border border-slate-700 rounded-lg p-2 pt-3 mt-3"
            placeholder="Enter Your Message"
            onChange={handleChange}
          ></textarea>
          <p className="text-sm text-slate-500 font-semibold pt-5">
            Please Wait For Our Reply We Will Reply Back Soon{" "}
          </p>
          <Link
            className=" w-full text-center max-w-[150px] p-2 hover:opacity-90 my-2 border border-slate-600 text-white rounded-lg bg-green-700"
            to={`mailto:${"shah.umer8493@gmail.com"}?subject=Regarding ${"U-Real Estate"}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      </div>
    </div>
  );
}
