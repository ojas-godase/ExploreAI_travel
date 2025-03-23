import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Chatbot from "../../../../Service/Chatbot.jsx";

function MyTrips() {
  const [tripData, setTripData] = useState(null);
  const tripRef = useRef();
  const [images, setImages] = useState([]);
  const [weatherIconUrl, setWeatherIconUrl] = useState("");
  const [weatherData, setWeatherData] = useState(null);

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

  useEffect(() => {
    if (tripData?.location) {
      const fetchImages = async () => {
        try {
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(tripData.location)}&client_id=${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}&per_page=3`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setImages(data.results.map((img) => img.urls.small));
          }
        } catch (error) {
          console.error("❌ Error fetching Unsplash images:", error);
        }
      };

      const fetchWeatherData = async () => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(tripData.location)}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`
          );
          const data = await response.json();
          if (data.weather && data.weather.length > 0) {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

            const celsiusTemp = Math.round(data.main.temp - 273.15);
            const feelsLikeTemp = Math.round(data.main.feels_like - 273.15);
            const minTemp = Math.round(data.main.temp_min - 273.15);
            const maxTemp = Math.round(data.main.temp_max - 273.15);

            setWeatherIconUrl(iconUrl);
            setWeatherData({
              description: data.weather[0].description,
              temperature: celsiusTemp,
              feelsLike: feelsLikeTemp,
              minTemp: minTemp,
              maxTemp: maxTemp,
              humidity: data.main.humidity,
              precipitation: data.weather[0].main === "Rain" ? data.rain?.["1h"] || 0 : 0,
            });
          }
        } catch (error) {
          console.error("❌ Error fetching weather data:", error);
        }
      };

      fetchImages();
      fetchWeatherData();
    }
  }, [tripData]);

  const waitForImagesToLoad = () => {
    return new Promise((resolve) => {
      const images = tripRef.current?.querySelectorAll("img");
      if (!images || images.length === 0) {
        resolve();
        return;
      }

      let loadedCount = 0;
      images.forEach((img) => {
        if (img.complete) {
          loadedCount++;
        } else {
          img.onload = img.onerror = () => {
            loadedCount++;
            if (loadedCount === images.length) {
              resolve();
            }
          };
        }
      });

      if (loadedCount === images.length) {
        resolve();
      }
    });
  };

  const saveAsPDF = async () => {
    await waitForImagesToLoad();
    const canvas = await html2canvas(tripRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const doc = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    doc.save("Trip_Details.pdf");
  };

  const saveAsImage = async () => {
    await waitForImagesToLoad();
    const canvas = await html2canvas(tripRef.current, { scale: 2 });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "Trip_Details.png";
    link.click();
  };

  if (!tripData) {
    return <p className="text-center text-lg font-semibold">Loading trip data...</p>;
  }

  return (
    <div className="container mx-auto p-4 flex gap-4">
      {/* Weather Section */}
      <div className="fixed top-16 left-2 bg-white p-4 rounded-lg shadow-lg w-72 flex flex-col items-center justify-center space-y-2 z-10">
        {weatherData ? (
          <>
            <img src={weatherIconUrl} alt="Weather Icon" className="w-14 h-16" />
            <h3 className="text-xl font-semibold">{tripData.location}</h3>
            <p className="text-lg">{weatherData.description}</p>
            <p className="text-lg font-semibold">{weatherData.temperature}°C</p>
            <p className="text-sm text-gray-500">Feels like: {weatherData.feelsLike}°C</p>
            <p className="text-sm text-gray-500">{weatherData.minTemp}°C / {weatherData.maxTemp}°C</p>
            <p className="text-sm text-gray-500">Humidity: {weatherData.humidity}%</p>
            <p className="text-sm text-gray-500">Precipitation: {weatherData.precipitation}mm</p>
          </>
        ) : (
          <p className="text-lg">Loading weather data...</p>
        )}
      </div>

      {/* Main Content */}
      <div ref={tripRef} className="flex-1 ml-0">
        <div className="flex justify-start gap-4">
          <button onClick={saveAsPDF} className="bg-blue-500 text-white px-4 py-2 rounded">Save as PDF</button>
          <button onClick={saveAsImage} className="bg-green-500 text-white px-4 py-2 rounded">Save as Image</button>
        </div>

        <div className="p-4 bg-white w-full min-h-screen">
          <h1 className="text-3xl font-bold text-center">Your Trip</h1>
          <div className="mt-6 p-4 border rounded">
            <h2 className="text-2xl font-semibold">{tripData.location || "Unknown Location"}</h2>
            <p className="text-lg">Duration: {tripData.duration || "N/A"} days</p>
            <p className="text-lg">Budget: {tripData.budget || "N/A"}</p>
          </div>

          {/* Unsplash Images */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {images.length > 0 ? (
              images.map((img, index) => (
                <img key={index} src={img} alt={`View of ${tripData.location}`} className="rounded-lg w-full h-48 object-cover" />
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-3">No images found for this location.</p>
            )}
          </div>

          {/* Hotels */}
          <h3 className="text-2xl font-semibold mt-6">Hotels:</h3>
          <ul>
            {tripData.hotels?.length > 0 ? (
              tripData.hotels.map((hotel, index) => (
                <li key={index} className="border-b py-4">
                  <h4 className="font-bold text-lg">{hotel.name || "Unnamed Hotel"}</h4>
                  <p>{hotel.description || "No description available."}</p>
                  <p className="text-gray-600">Price: {hotel.price || "N/A"}</p>
                  <p className="text-gray-600">Rating: ⭐ {hotel.rating || "N/A"}</p>
                </li>
              ))
            ) : (
              <p>No hotels available.</p>
            )}
          </ul>

          {/* Itinerary */}
          <h3 className="text-2xl font-semibold mt-6">Itinerary:</h3>
          <ul>
            {tripData.itinerary?.length > 0 ? (
              tripData.itinerary.map((day, index) => (
                <li key={index} className="border-b py-4">
                  <h4 className="font-semibold text-lg">Day {index + 1}: {day.theme || ""}</h4>
                  <ul className="ml-4">
                    {day.places?.map((place, i) => (
                      <li key={i} className="mt-2">
                        <h5 className="font-bold">{place.name || "Unknown Place"}</h5>
                        <p>{place.details || "No details available."}</p>
                        <p className="text-gray-600">Price: {place.pricing || "N/A"}</p>
                        <p className="text-gray-600">Timings: {place.timings || "N/A"}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              <p>No itinerary available.</p>
            )}
          </ul>
        </div>

        {/* Chatbot */}
        <div className="mt-6">
          <Chatbot />
        </div>
      </div>
    </div>
  );
}

export default MyTrips;
