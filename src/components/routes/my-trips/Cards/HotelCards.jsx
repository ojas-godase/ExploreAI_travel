import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlaceDetails, PHOTO_URL } from "@/Service/GlobalApi";

function HotelCards({ hotel, city }) {
  const [placeDetails, setPlaceDetails] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchPlaceInfo = async () => {
      try {
        const { data } = await getPlaceDetails({ textQuery: `${hotel.name} ${city}` });
        if (data.places.length > 0) {
          const place = data.places[0];
          setPlaceDetails(place);
          setPhotoUrl(PHOTO_URL.replace("{replace}", place.photos?.[0]?.name || ""));
          setAddress(place.formattedAddress);
          setLocation(place.googleMapsUri);
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlaceInfo();
  }, [hotel.name, city]);

  return (
    <Link
      className="w-full"
      target="_blank"
      to={location || `https://www.google.com/maps/search/${hotel.name},${city}`}
    >
      <Card className="border-foreground/20 p-1 h-full flex flex-col gap-3 hover:scale-105 duration-300">
        <div className="img h-full rounded-lg">
          <img src={photoUrl || "/logo.png"} className="h-80 w-full object-cover" alt={hotel.name} />
        </div>
        <div className="text-content w-full flex items-center gap-3 justify-between flex-col h-full">
          <CardHeader className="w-full">
            <CardTitle className="opacity-90 w-full text-center text-xl font-black text-primary/80 md:text-3xl">
              {hotel.name}
            </CardTitle>
            <CardDescription className="line-clamp-2 tracking-wide opacity-90 w-full text-center text-sm text-primary/80 md:text-md">
              {hotel.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full">
            <div className="hotel-details">
              <span className="font-medium text-primary/80 opacity-90 text-sm md:text-base tracking-wide">
                ⭐ Rating: {hotel.rating}
              </span>
              <br />
              <span className="font-medium text-primary/80 opacity-90 text-sm md:text-base tracking-wide">
                💵 Price: {hotel.price}
              </span>
              <br />
              <span className="font-medium text-primary/80 opacity-90 text-sm md:text-base tracking-wide line-clamp-1">
                📍 Location: {address || hotel.address}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

export default HotelCards;
