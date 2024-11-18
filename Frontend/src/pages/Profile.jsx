import React, { useState } from "react";
import "./Profile.scss"; 

const Profile = () => {
    const [formData, setFormData] = useState({
        name: "X Factor",
        gender: "Binary",
        birthDay: "3",
        birthMonth: "10",
        birthYear: "2024",
        email: "xfactor@gmail.com",
        phone: "0910102024",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form data:", formData);
    };

    return (
        <>
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
                    src="https://via.placeholder.com/100"
                    alt="Avatar"
                />
                <button
                    className="choose-image-button"
                    style={{
                        backgroundColor: "#0045b5",
                        color: "white",
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
                            placeholder={formData.name || "Nhập họ và tên"}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: "-70px" }}>Giới tính</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            style={{
                                marginLeft: "-70px",
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
                    <div className="form-group date-group" style={{ marginLeft: "-415px", marginTop: "10px" }}>
                        <label style={{ marginTop: "-14px" }}>Ngày sinh</label>
                        <div
                            style={{
                                display: "flex",
                                gap: "10px",
                                width: "50%",
                                marginTop: "10px",
                                position: "relative"
                            }}
                        >
                            <select
                                name="birthDay"
                                value={formData.birthDay}
                                onChange={handleChange}
                                style={{
                                    flex: 1,
                                    marginLeft: "-85px",
                                    color: "#808080",
                                    padding: "8px",
                                    borderRadius: "4px",
                                    fontSize: "14px",
                                    maxHeight: "50px", 
                                    overflowY: "auto",  
                                    
                                    
                                }}
                            >
                                {Array.from({ length: 31 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="birthMonth"
                                value={formData.birthMonth}
                                onChange={handleChange}
                                style={{
                                    flex: 1,
                                    color: "#808080",
                                    padding: "8px", 
                                    borderRadius: "4px",
                                    fontSize: "14px", 
                                }}
                            >
                                {Array.from({ length: 12 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                            <select
                                name="birthYear"
                                value={formData.birthYear}
                                onChange={handleChange}
                                style={{
                                    flex: 1,
                                    color: "#808080",
                                    padding: "8px", 
                                    borderRadius: "4px", 
                                    fontSize: "14px",
                                }}
                            >
                                {Array.from({ length: 100 }, (_, i) => (
                                    <option key={2024 - i} value={2024 - i}>
                                        {2024 - i}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder={formData.email || "Nhập email"}
                        style={{ width: "97.5%", padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                    />
                </div>
                <div className="form-group" style={{ marginRight: "185px" }}>
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder={formData.phone || "Nhập số điện thoại"}
                        onChange={handleChange}
                        style={{ width: "63%", padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                    />
                </div>
                <div className="form-group">
                    <button
                        type="submit"
                        className="save-button"
                        style={{
                            marginTop: "115px",
                            marginLeft: "400px",
                            backgroundColor: "#0045b5",
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
        </>
    );
};

export default Profile;
