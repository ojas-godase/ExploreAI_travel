import { createContext, useState } from "react";

export const LogInContext = createContext(null);

export const LogInContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Always true
    const [trip, setTrip] = useState([]);

    // Dummy functions to replace login/logout
    const loginWithPopup = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);

    return (
        <LogInContext.Provider value={{ user, loginWithPopup, logout, isAuthenticated, trip, setTrip }}>
            {props.children}
        </LogInContext.Provider>
    );
};
