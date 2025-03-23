import axios from "axios";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { chatSession } from "@/Service/AiModel"; // Ensure this is correctly set up to call Gemini AI

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const configPlace = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.id,places.name,places.displayName,places.formattedAddress,places.photos,places.googleMapsUri,places.location,places.priceLevel,places.rating",
  },
};

const configCity = {
  headers: {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": API_KEY,
    "X-Goog-FieldMask": "places.name,places.displayName,places.photos,places.googleMapsUri,places.location",
  },
};

// Function to fetch place details
export const getPlaceDetails = async (query) => {
  try {
    const response = await axios.post(BASE_URL, { textQuery: query }, configPlace);
    const places = response.data.places || [];

    return places.map((place) => {
      const photoReference = place.photos?.[0]?.name || null;
      const imageUrl = photoReference ? getPhotoUrl(photoReference) : null;

      return {
        id: place.id,
        name: place.name,
        displayName: place.displayName?.text || place.name,
        address: place.formattedAddress,
        googleMapsUrl: place.googleMapsUri,
        location: place.location,
        priceLevel: place.priceLevel || "N/A",
        rating: place.rating || "No rating",
        imageUrl: imageUrl,
      };
    });
  } catch (error) {
    console.error("Error fetching place details:", error);
    return [];
  }
};

// Function to fetch city details
export const getCityDetails = async (query) => {
  try {
    const response = await axios.post(BASE_URL, { textQuery: query }, configCity);
    const places = response.data.places || [];

    return places.map((place) => {
      const photoReference = place.photos?.[0]?.name || null;
      const imageUrl = photoReference ? getPhotoUrl(photoReference) : null;

      return {
        name: place.name,
        displayName: place.displayName?.text || place.name,
        googleMapsUrl: place.googleMapsUri,
        location: place.location,
        imageUrl: imageUrl,
      };
    });
  } catch (error) {
    console.error("Error fetching city details:", error);
    return [];
  }
};

export const getPhotoUrl = (photoReference, maxWidth = 400) => {
  if (!photoReference) return ""; // Handle cases where photoReference is undefined
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${API_KEY}`;
};

// Component to create a trip
function CreateTrip() {
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    Budget: "",
    People: "",
    Date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateTrip = async () => {
    if (!formData.noOfDays || !formData.location || !formData.People || !formData.Budget || !formData.Date) {
      return toast.error("Please fill out every field or select every option.");
    }

    if (!formData.noOfDays || isNaN(formData.noOfDays) || formData.noOfDays <= 0) {
      return toast.error("Please enter a valid number of days (greater than 0).");
    }

    const FINAL_PROMPT = `
      Create a trip plan based on the following details:
      Location: ${formData.location}
      Number of Days: ${formData.noOfDays}
      People: ${formData.People}
      Budget: ${formData.Budget}
      Start Date: ${formData.Date}
    `;

    try {
      const toastId = toast.loading("Generating Trip", { icon: "✈️" });

      setIsLoading(true);
      const result = await chatSession.sendMessage(FINAL_PROMPT);

      const responseText = await result.response.text();

      let trip;
      try {
        const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/);
        if (jsonMatch) {
          trip = JSON.parse(jsonMatch[1]);
        } else {
          trip = JSON.parse(responseText);
        }
      } catch (jsonError) {
        console.error("❌ JSON Parsing Error:", jsonError);
        toast.dismiss(toastId);
        return toast.error("AI response is not valid JSON. Please try again.");
      }

      setItinerary(trip.itinerary);

      setIsLoading(false);
      toast.dismiss(toastId);
      toast.success("Trip Generated Successfully");
    } catch (error) {
      setIsLoading(false);
      toast.dismiss();
      toast.error("Failed to generate trip. Please try again.");
      console.error("❌ Error:", error);
    }
  };

  return (
    <div>
      <h2>Create Your Trip</h2>
      <div>
        <input
          type="text"
          placeholder="Location"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of Days"
          value={formData.noOfDays}
          onChange={(e) => handleInputChange("noOfDays", e.target.value)}
        />
        <input
          type="number"
          placeholder="Number of People"
          value={formData.People}
          onChange={(e) => handleInputChange("People", e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget"
          value={formData.Budget}
          onChange={(e) => handleInputChange("Budget", e.target.value)}
        />
        <input
          type="date"
          placeholder="Start Date"
          value={formData.Date}
          onChange={(e) => handleInputChange("Date", e.target.value)}
        />
      </div>

      <Button onClick={generateTrip} disabled={isLoading}>
        {isLoading ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Generate Trip"}
      </Button>

      {itinerary && (
        <div>
          <h3>Itinerary:</h3>
          <pre>{JSON.stringify(itinerary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CreateTrip;
