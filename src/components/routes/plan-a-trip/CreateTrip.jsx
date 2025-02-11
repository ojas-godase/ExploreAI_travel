import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import {
  PROMPT,
  SelectBudgetOptions,
  SelectNoOfPersons,
} from "../../constants/Options";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { chatSession } from "@/Service/AiModel"; // Ensure this is correctly set up to call Gemini AI

function CreateTrip({ createTripPageRef }) {
  const [place, setPlace] = useState("");
  const [formData, setFormData] = useState({
    location: "",
    noOfDays: "",
    Budget: "",
    People: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState(null); // Store the generated itinerary
  const navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (name, value) => {
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const generateTrip = async () => {
    if (!formData.noOfDays || !formData.location || !formData.People || !formData.Budget) {
      return toast.error("Please fill out every field or select every option.");
    }

    // Remove days validation check
    if (!formData.noOfDays || isNaN(formData.noOfDays) || formData.noOfDays <= 0) {
      return toast.error("Please enter a valid number of days (greater than 0).");
    }

    const FINAL_PROMPT = PROMPT.replace(/{location}/g, formData.location)
      .replace(/{noOfDays}/g, formData.noOfDays)
      .replace(/{People}/g, formData.People)
      .replace(/{Budget}/g, formData.Budget);

    console.log("🔹 FINAL_PROMPT:", FINAL_PROMPT);

    try {
      const toastId = toast.loading("Generating Trip", { icon: "✈️" });

      setIsLoading(true);
      const result = await chatSession.sendMessage(FINAL_PROMPT);

      console.log("✅ AI Response (Raw):", result);

      const responseText = await result.response.text();
      console.log("✅ AI Response (Text):", responseText);

      let trip;
      try {
        // Try extracting JSON if AI wraps it in ```json ... ```
        const jsonMatch = responseText.match(/```json\n([\s\S]+?)\n```/);
        if (jsonMatch) {
          trip = JSON.parse(jsonMatch[1]);
        } else {
          trip = JSON.parse(responseText);
        }

        console.log("✅ Parsed Trip Data:", trip);
      } catch (jsonError) {
        console.error("❌ JSON Parsing Error:", jsonError);
        console.error("❌ Raw AI Response:", responseText);
        toast.dismiss(toastId);
        return toast.error("AI response is not valid JSON. Please try again.");
      }

      // Set itinerary to state
      setItinerary(trip.itinerary);

      setIsLoading(false);
      localStorage.setItem("Trip", JSON.stringify(trip));
      navigate("/my-trips");

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
    <div ref={createTripPageRef} className="mt-10 text-center">
      <h2 className="text-3xl md:text-5xl font-bold mb-5 flex items-center justify-center">
        <span className="hidden md:block">🚀</span>
        <span className="bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
          Share Your Travel Preferences
        </span>
        <span className="hidden md:block">🚀</span>
      </h2>
      <p className="opacity-90 mx-auto text-center text-md md:text-xl font-medium tracking-tight text-primary/80">
        Embark on your dream adventure with just a few details. <br />
        <span className="bg-gradient-to-b text-2xl from-blue-400 to-blue-700 bg-clip-text text-center text-transparent">
          ExploreAI
        </span>{" "}
        will curate a personalized itinerary for you!
      </p>

      <div className="form mt-14 flex flex-col gap-16 md:gap-20">
        {/* Location Input */}
        <div className="place">
          <h2 className="font-semibold text-lg md:text-xl mb-3">Where do you want to Explore? 🏖️</h2>
          <ReactGoogleAutocomplete
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm text-center"
            apiKey={import.meta.env.VITE_GOOGLE_MAP_API_KEY}
            autoFocus
            onPlaceSelected={(place) => {
              setPlace(place);
              handleInputChange("location", place.formatted_address);
            }}
            placeholder="Enter a City"
          />
        </div>

        {/* Trip Duration Input */}
        <div className="day">
          <h2 className="font-semibold text-lg md:text-xl mb-3">How long is your Trip? 🕜</h2>
          <Input
            className="text-center"
            placeholder="Ex: 2"
            type="number"
            name="noOfDays"
            required
            onChange={(day) => handleInputChange("noOfDays", day.target.value)}
          />
        </div>

        {/* Budget Selection */}
        <div className="budget">
          <h2 className="font-semibold text-lg md:text-xl mb-3">What is your Budget? 💳</h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("Budget", item.title)}
                className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg
                  ${formData.Budget === item.title && "border border-foreground/80"}`}
              >
                <h3 className="font-bold text-[15px] md:font-[18px]">
                  {item.icon} {item.title}
                </h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Number of People Selection */}
        <div className="people">
          <h2 className="font-semibold text-lg md:text-xl mb-3">Who are you traveling with? 🚗</h2>
          <div className="options grid grid-cols-1 gap-5 md:grid-cols-3">
            {SelectNoOfPersons.map((item) => (
              <div
                key={item.id}
                onClick={() => handleInputChange("People", item.no)}
                className={`option cursor-pointer transition-all hover:scale-110 p-4 h-32 flex items-center justify-center flex-col border rounded-lg
                  ${formData.People === item.no && "border border-foreground/80"}`}
              >
                <h3 className="font-bold text-[15px] md:text-[18px]">
                  {item.icon} {item.title}
                </h3>
                <p className="text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Trip Button */}
      <div className="create-trip-btn w-full flex items-center justify-center h-32">
        <Button disabled={isLoading} onClick={generateTrip}>
          {isLoading ? <AiOutlineLoading3Quarters className="h-6 w-6 animate-spin" /> : "Let's Go 🌏"}
        </Button>
      </div>

      {/* Display Itinerary */}
      {itinerary && (
        <div className="mt-10">
          {itinerary.map((day, index) => (
            <div key={index} className="day-container mt-6">
              <h3 className="font-semibold text-2xl">Day {index + 1}: {day.title}</h3>
              <ul className="list-disc pl-5 mt-3">
                {day.activities.map((activity, i) => (
                  <li key={i} className="text-lg">{activity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CreateTrip;
