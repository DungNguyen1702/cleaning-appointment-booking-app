import { FaUserCircle, FaCaretDown } from 'react-icons/fa';
import Wrapper from '../assets/wrappers/LogoutContainer';
import { useState, useEffect } from 'react';
import { useDashboardContext } from '../pages/DashboardLayout';
import RequestAPI from '../api/requestAPI';

const LogoutContainer = () => {
    const [showLogout, setShowLogout] = useState(false); // Toggle for logout dropdown
    const { user, logoutUser } = useDashboardContext(); // Context hooks for user and logout
    const [formData, setFormData] = useState({
        avatar: "",
        full_name: "",
    });
    const [alertMessage, setAlertMessage] = useState(""); // Optional alert message for errors
    const [updatedUserData, setUpdatedUserData] = useState(null); // For any profile updates
    const [showDetails, setShowDetails] = useState(false); // For toggling detailed view

    // Extract user_id from localStorage
    const storedUserInfo = localStorage.getItem("user_info");
    const userId = storedUserInfo ? JSON.parse(storedUserInfo)?.user_id : null;

    // Fetch user profile on mount or when userId changes
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                if (!userId) throw new Error("User ID is missing");

                const response = await RequestAPI.getProfile(userId);
                const data = response.data;

                console.log("Fetched user profile:", data);

                setFormData({
                    avatar: data.user?.avatar || "",
                    full_name: data.user?.full_name || "User",
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
            
            }
        };

        if (userId) fetchUserProfile();
    }, [userId]);

    return (
        <Wrapper>
            <button
                type='button'
                className='btn logout-btn'
                onClick={() => setShowLogout(!showLogout)}
            >
                {formData.avatar ? (
                    <img src={formData.avatar} alt='User Avatar' className='img' />
                ) : (
                    <FaUserCircle />
                )}
                {formData.full_name}
                <FaCaretDown />
            </button>

            {/* Logout Dropdown */}
            <div className={showLogout ? 'dropdown show-dropdown' : 'dropdown'}>
                <button
                    type='button'
                    className='dropdown-btn'
                    onClick={logoutUser}
                >
                    Logout
                </button>
            </div>

            {/* Alert Message */}
            {alertMessage && <p className="alert-message">{alertMessage}</p>}
        </Wrapper>
    );
};

export default LogoutContainer;
