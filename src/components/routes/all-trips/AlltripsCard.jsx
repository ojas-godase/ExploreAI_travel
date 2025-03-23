import { getCityDetails } from "@/Service/GlobalApi";
import React, { useEffect, useState } from "react";

const DEFAULT_IMAGE = "/logo.png"; // Default fallback image

const AlltripsCard = ({ trip }) => {
  const [cityDets, setCityDets] = useState(null);
  const [imageUrl, setImageUrl] = useState(DEFAULT_IMAGE);
  const city = trip?.tripData?.location;

  useEffect(() => {
    if (!city) return;

    const fetchCityInfo = async () => {
      try {
        const res = await getCityDetails(city);
        if (res.length > 0) {
          setCityDets(res[0]);
          setImageUrl(res[0].imageUrl);
        } else {
          console.warn("No city details found.");
          setImageUrl(DEFAULT_IMAGE);
        }
      } catch (err) {
        console.error("Error fetching city details:", err);
        setImageUrl(DEFAULT_IMAGE);
      }
    };

    fetchCityInfo();
  }, [city]);

  const noOfDaysText = trip?.userSelection?.noOfDays > 1 ? "Days" : "Day";

  return (
    <div className="card-card border-foreground/20 p-1 h-full flex flex-col gap-3">
      <div className="img relative h-full rounded-lg overflow-hidden duration-500 group">
        <img
          src={imageUrl}
          className="h-56 w-full object-cover group-hover:scale-110 duration-500 transition-all"
          alt={trip?.userSelection?.location || "Trip Image"}
        />
        <div className="absolute inset-0 bg-background/90 flex flex-col items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-gradient-to-b text-lg from-primary/90 to-primary/60 bg-clip-text text-transparent font-bold">
            {trip?.userSelection?.location}
          </span>
          <span className="bg-gradient-to-b text-lg from-primary/90 to-primary/60 bg-clip-text text-transparent font-bold">
            {trip?.userSelection?.noOfDays} {noOfDaysText}
          </span>
          <span className="bg-gradient-to-b text-lg from-primary/90 to-primary/60 bg-clip-text text-transparent font-bold">
            {trip?.userSelection?.Budget} Budget
          </span>
        </div>
      </div>
    </div>
  );
};

export default AlltripsCard;
