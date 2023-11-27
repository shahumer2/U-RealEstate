import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ Listing }) {
  const [landlord, setlandlord] = useState(null);
  const [message, setmessage] = useState("");
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${Listing.userRef}`);

        const data = await res.json();
        console.log(data);
        setlandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [Listing.userRef]);
  const handleChange = (e) => {
    setmessage(e.target.value);
  };

  return (
    <div>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact{" "}
            <span className="font-semibold">
              {landlord.username} For{" "}
              <span className="font-semibold">{Listing.name}</span>
            </span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="3"
            className="w-full max-w-[500px] border border-slate-700 rounded-lg p-2"
            placeholder="Enter Your Message"
            onChange={handleChange}
          ></textarea>
          <Link
            className=" w-full max-w-[150px] p-2 hover:opacity-90 my-2 border border-slate-600 text-white rounded-lg bg-green-700"
            to={`mailto:${landlord.email}?subject=Regarding ${Listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </div>
  );
}
