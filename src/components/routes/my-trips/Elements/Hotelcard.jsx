import React from "react";
import { useMediaQuery } from "react-responsive";
import HotelCards from "../Cards/HotelCards";
import { useRefContext } from "@/Context/RefContext/RefContext";

function Hotelcard({ hotels, city }) {
  const isMobile = useMediaQuery({ query: "(max-width: 445px)" });
  const isSmall = useMediaQuery({ query: "(max-width: 640px)" });

  const { holetsRef } = useRefContext();

  return (
    <div ref={holetsRef} className="flex flex-col md:flex-row flex-wrap gap-5">
      {hotels?.map((hotel, idx) => (
        <div key={idx} className="md:w-[48%]">
          <HotelCards className="hotel-card" hotel={hotel} />
        </div>
      ))}
    </div>
  );
}

export default Hotelcard;
