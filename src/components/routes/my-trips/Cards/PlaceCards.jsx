import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getPlaceDetails, PHOTO_URL } from "@/Service/GlobalApi";

function PlaceCards({ place, city }) {
  const isMobile = useMediaQuery({ query: "(max-width: 445px)" });
  const isSmall = useMediaQuery({ query: "(max-width: 640px)" });

  const [placeDets, setPlaceDets] = useState({});
  const [photos, setPhotos] = useState("");
  const [url, setUrl] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");

  const getPlaceInfo = async () => {
    const data = { textQuery: `${place.name} ${city}` };
    try {
      const res = await getPlaceDetails(data);
      if (res.data.places.length > 0) {
        const placeInfo = res.data.places[0];
        setPlaceDets(placeInfo);
        setPhotos(placeInfo.photos?.[0]?.name || "");
        setAddress(placeInfo.formattedAddress || place.address);
        setLocation(placeInfo.googleMapsUri || "");
      }
    } catch (err) {
      console.error("Error fetching place details:", err);
    }
  };

  useEffect(() => {
    getPlaceInfo();
  }, []);

  useEffect(() => {
    if (photos) {
      setUrl(PHOTO_URL.replace("{replace}", photos));
    }
  }, [photos]);

  return (
    <>
      {isSmall ? (
        <Popover>
          <PopoverTrigger>
            <Card className="grid mt-4 hover:scale-105 transition-all text-left grid-rows-1 grid-cols-[30%_1fr] h-20 sm:grid-cols-[35%_1fr] gap-2 items-center p-2 sm:h-auto min-w-[250px] bg-gray-100 border border-black/10">
              <div className="img h-full rounded-lg bg-gray-200 border border-black/10">
                <img
                  src={url || "/logo.png"}
                  className="h-full max-h-48 w-full object-cover"
                  alt=""
                />
              </div>
              <div className="text-content w-full">
                <CardHeader>
                  <CardTitle className="sm:font-semibold text-lg">
                    {place.name}
                  </CardTitle>
                  {!isMobile && (
                    <CardDescription className="text-sm line-clamp-2">
                      {place.details}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {isMobile && (
                    <p className="text-sm text-muted-foreground w-full line-clamp-1">
                      {place.details}
                    </p>
                  )}
                </CardContent>
              </div>
            </Card>
          </PopoverTrigger>
          <PopoverContent>
            <h3 className="text-lg font-medium leading-none">Details:</h3>
            <p className="text-muted-foreground">{place.details}</p>
            <div className="mt-4">
              <span className="text-base font-medium">🕒 Timings:</span> {place.timings} <br />
              <span className="text-base font-medium">💵 Price: </span> {place.pricing} <br />
              <span className="text-base font-medium">📍 Location: </span> {address} <br />
              <br />
              <Link
                to={location || `https://www.google.com/maps/search/${place.name},${city}`}
                target="_blank"
                className="mt-3"
              >
                <Button className="w-full">See in Map</Button>
              </Link>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <Link
          target="_blank"
          to={location || `https://www.google.com/maps/search/${place.name},${city}`}
        >
          <Card className="grid mt-4 hover:scale-105 transition-all text-left grid-rows-1 grid-cols-[30%_1fr] h-20 sm:grid-cols-[35%_1fr] gap-2 items-center p-2 sm:h-auto bg-gray-100 border border-black/10">
            <div className="img h-full rounded-lg bg-gray-200 border border-black/10">
              <img
                src={url || "/logo.png"}
                className="h-full max-h-48 w-full object-cover"
                alt=""
              />
            </div>
            <div className="text-content w-full flex sm:items-start items-center justify-center flex-col h-full">
              <CardHeader>
                <CardTitle className="sm:font-semibold text-lg">
                  {place.name}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {place.details}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-left">
                <div>
                  <span className="text-base font-medium">🕒 Timings:</span> {place.timings} <br />
                  <span className="text-base font-medium">💵 Price: </span> {place.pricing} <br />
                  <span className="text-base font-medium">📍 Location: {address}</span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      )}
    </>
  );
}

export default PlaceCards;
