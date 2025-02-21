import Cookies from "js-cookie";
import React from "react";
import {Navigate} from "react-router-dom";
import SignInPasswordPopup from "../components/popup/SignInPasswordPopup.jsx";
import {useAuth} from "../hooks/contexts/authContext/index.jsx";

const NonUserAuth = ({children}) => {
    const {userLoggedIn} = useAuth();
    if (userLoggedIn) {
        return <Navigate to="/"/>;
    } else if (!userLoggedIn) {
        return children;
    }
};

const UserAuth = ({children}) => {
    const {userLoggedIn} = useAuth();
    if (userLoggedIn) {
        return children;
    } else if (!userLoggedIn) {
        return <SignInPasswordPopup/>;
    }
};

const AdminAuth = ({children}) => {
    const {userLoggedIn, isPremiumUser} = useAuth();
    console.log('userLoggedIn', userLoggedIn);
    console.log('isPremiumUser', isPremiumUser);
    if (userLoggedIn && Cookies.get("role") === "admin") {
        return children;
    } else if (!userLoggedIn) {
        return <Navigate to="/login"/>;
    } else {
        return <Navigate to="/"/>;
    }
}


export {UserAuth, NonUserAuth, AdminAuth};
