import { LogInContext } from "@/Context/LogInContext/Login";
// import { db } from "@/Service/Firebase";
// import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import AlltripsCard from "./AlltripsCard";
import { Link } from "react-router-dom";

function Alltrips() {
  const { user } = useContext(LogInContext);
  const [allTrips, setAllTrips] = useState([]);

  useEffect(() => {
    const getAllTrips = async () => {
      if (!user?.email) return;

      const tripsQuery = query(
        collection(db, "Trips"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(tripsQuery);
      const trips = querySnapshot.docs.map((doc) => doc.data()).reverse();

      setAllTrips(trips);
    };

    getAllTrips();
  }, [user]);

  return (
    <div className="mb-10">
      <h1 className="text-3xl md:text-5xl font-bold text-center my-5 md:my-10 bg-gradient-to-b from-primary/90 to-primary/60 bg-clip-text text-transparent">
        All Trips
      </h1>
      <div className="flex gap-3 flex-wrap justify-evenly items-center">
        {allTrips.length > 0
          ? allTrips.map((trip, idx) => (
              <Link
                key={idx}
                to={`/my-trips/${trip.tripId}`}
                className="w-full md:w-[48%]"
              >
                <AlltripsCard trip={trip} />
              </Link>
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-[48%] h-52 rounded-md border bg-card-foreground/50 animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default Alltrips;
