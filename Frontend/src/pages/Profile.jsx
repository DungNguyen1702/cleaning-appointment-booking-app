import React, { useState, useEffect } from "react";
import "./Profile.scss";
import RequestAPI from "../api/requestAPI";
import Select from 'react-select';

const Profile = () => {
    const [formData, setFormData] = useState({
        full_name: "",
        gender: "Male",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
        email: "",
        phone: "",
    });

    // Lấy userId từ localStorage
    const storedUserInfo = localStorage.getItem("user_info");
    const userId = storedUserInfo ? JSON.parse(storedUserInfo)?.user_id : "";  // Default to 2 if not found

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await RequestAPI.getProfile(userId);
                const data = response.data;
                console.log("Fetched user profile:", data);


                const birthDate = data.birthDay || "1990-01-01";


                const [birthYear, birthMonth, birthDay] = birthDate.split("-");

                setFormData({
                    full_name: data.user.full_name || "",
                    gender: data.gender || "Male",
                    birthDay: birthDay || "",
                    birthMonth: birthMonth || "",
                    birthYear: birthYear || "",
                    email: data.user.account.email || "",
                    phone: data.user.phone_number || "",
                });
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        };

        if (userId) fetchUserProfile();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data submitted:", formData);
    };




    return (
        <div className="profile-container">
            <h1 style={{ fontSize: "25px", marginTop: "-5px", textAlign: "left" }}>
                <b>Thông tin cá nhân</b>
            </h1>
            <div
                className="profile-avatar"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <img
                    style={{
                        width: "100px",
                        height: "100px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginTop: "22px",
                        marginRight: "1022px",
                    }}
                    src="https://static.vecteezy.com/system/resources/previews/011/490/381/original/happy-smiling-young-man-avatar-3d-portrait-of-a-man-cartoon-character-people-illustration-isolated-on-white-background-vector.jpg"
                    alt="Avatar"
                />
                <button
                    className="choose-image-button"
                    style={{
                        backgroundColor: "#b7bacc",
                        color: "blue",
                        border: "none",
                        padding: "5px 15px",
                        borderRadius: "5px",
                        fontSize: "14px",
                        cursor: "pointer",
                        marginRight: "1022px",
                        marginTop: "0px",
                    }}
                >
                    Chọn ảnh
                </button>
            </div>
            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="row-group">
                    <div className="form-group">
                        <label>Họ và tên</label>
                        <input
                            type="text"
                            name="name"
                            placeholder={formData.full_name || "khách hàng 1"}
                            onChange={handleChange}
                            style={{ width: "105%", padding: "8px", borderRadius: "4px", fontSize: "14px" }} 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: "20px" }}>Giới tính</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{
                                marginLeft: "20px",
                                color: "#808080",
                                padding: "8px",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        >
                            <option value="Male" style={{ color: "#808080" }}>
                                Nam
                            </option>
                            <option value="Female" style={{ color: "#808080" }}>
                                Nữ
                            </option>
                            <option value="Binary" style={{ color: "#808080" }}>
                                Binary
                            </option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{marginLeft:"-135px",}}>Ngày sinh</label>
                        <div style={{ display: "flex", gap: "10px" ,width:"90% ",marginLeft:"-135px",marginTop:"8px",color: "#808080"}}>
                            <Select
                                options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                                value={{  value: formData.birthDay, label: formData.birthDay  }}
                                onChange={(selectedOption) =>
                                    setFormData((prevData) => ({ ...prevData, birthDay: selectedOption.value }))
                                }
                            />
                            <Select
                                options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                                value={{ value: formData.birthMonth, label: formData.birthMonth }}
                                onChange={(selectedOption) =>
                                    setFormData((prevData) => ({ ...prevData, birthMonth: selectedOption.value }))
                                }
                            />
                            <Select
                                options={Array.from({ length: 100 }, (_, i) => ({ value: 2024 - i, label: 2024 - i }))}
                                value={{ value: formData.birthYear, label: formData.birthYear }}
                                onChange={(selectedOption) =>
                                    setFormData((prevData) => ({ ...prevData, birthYear: selectedOption.value }))
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder={formData.email || "customer1@gmail.com"}
                        style={{ width: "86.5%", padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                    />
                </div>
                <div className="form-group" style={{ marginRight: "185px" }}>
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder={formData.phone || "03582911315"}
                        onChange={handleChange}
                        style={{ width: "55%", padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                    />
                </div>
                <div className="form-group">
                    <button
                        type="submit"
                        className="save-button"
                        style={{
                            marginTop: "115px",
                            marginLeft: "400px",
                            backgroundColor: "#1a1a5e",
                            color: "white",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            fontSize: "14px",
                        }}
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
