import React, { useEffect, useState } from "react";

function MyTrips() {
  const [tripData, setTripData] = useState(null);

  useEffect(() => {
    const storedTrip = localStorage.getItem("Trip");

    if (storedTrip) {
      try {
        const parsedTrip = JSON.parse(storedTrip);
        console.log("✅ Retrieved Trip Data:", parsedTrip);
        setTripData(parsedTrip);
      } catch (error) {
        console.error("❌ Error parsing stored trip data:", error);
      }
    }
  }, []);

  if (!tripData) {
    return <p className="text-center text-lg font-semibold">Loading trip data...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center">Your Trip</h1>

      {/* Trip Summary */}
      <div className="mt-6 p-4 border rounded">
        <h2 className="text-2xl font-semibold">{tripData.location || "Unknown Location"}</h2>
        <p className="text-lg">Duration: {tripData.duration || "N/A"} days</p>
        <p className="text-lg">Budget: {tripData.budget || "N/A"}</p>
      </div>

      {/* Hotels Section */}
      <h3 className="text-2xl font-semibold mt-6">Hotels:</h3>
      <ul>
        {tripData.hotels?.length > 0 ? (
          tripData.hotels.map((hotel, index) => (
            <li key={index} className="border-b py-4 flex gap-4 items-center">
              {hotel.image_url && (
                <img
                  src={hotel.image_url}
                  alt={hotel.name || "Hotel Image"}
                  className="w-32 h-32 rounded object-cover"
                />
              )}
              <div>
                <h4 className="font-bold text-lg">{hotel.name || "Unnamed Hotel"}</h4>
                <p>{hotel.description || "No description available."}</p>
                <p className="text-gray-600">Price: {hotel.price || "N/A"}</p>
                <p className="text-gray-600">Rating: ⭐ {hotel.rating || "N/A"}</p>
                {hotel.location_map && (
                  <a
                    href={hotel.location_map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    View on Google Maps
                  </a>
                )}
              </div>
            </li>
          ))
        ) : (
          <p>No hotels available.</p>
        )}
      </ul>


<h3 className="text-2xl font-semibold mt-6">Itinerary:</h3>
    <ul>
      {tripData.itinerary?.length > 0 ? (
        tripData.itinerary.map((day, index) => (
          <li key={index} className="border-b py-4">
            <h4 className="font-semibold text-lg">Day {index + 1}: {day.theme || ""}</h4>
            <ul className="ml-4">
              {day.places?.map((place, i) => {
                console.log("Place Image URL:", place.image_url);  // Debugging line to check the URL
                return (
                  <li key={i} className="mt-2">
                    <h5 className="font-bold">{place.name || "Unknown Place"}</h5>
                    <p>{place.details || "No details available."}</p>
                    <p className="text-gray-600">Price: {place.pricing || "N/A"}</p>
                    <p className="text-gray-600">Timings: {place.timings || "N/A"}</p>
                    {place.image_url && (
                      <img
                        src={place.image_url}
                        alt={place.name || "Place Image"}
                        className="w-64 h-40 mt-2 rounded object-cover"
                      />
                    )}
                    {place.location_map && (
                      <a
                        href={place.location_map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        View on Google Maps
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        ))
      ) : (
        <p>No itinerary available.</p>
      )}
    </ul>

    </div>
  );
}

export default MyTrips;
