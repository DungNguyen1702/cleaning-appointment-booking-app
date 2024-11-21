import React, { useState, useEffect } from "react";
import "./Profile.scss";
import RequestAPI from "../api/requestAPI";
import Select from 'react-select';
import { parsePhoneNumber, isValidPhoneNumber } from 'libphonenumber-js';


const Profile = () => {
    const [formData, setFormData] = useState({
        avatar :"",
        full_name: "",
        gender: "",
        birthDay: "",
        birthMonth: "",
        birthYear: "",
        email: "",
        phone: "",
    });

    // Lấy userId từ localStorage
    const storedUserInfo = localStorage.getItem("user_info");
    const userId = storedUserInfo ? JSON.parse(storedUserInfo)?.user_id : "";  // Default to 2 if not found
    const [alertMessage, setAlertMessage] = useState(""); // New state for alert message
    const [updatedUserData, setUpdatedUserData] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await RequestAPI.getProfile(userId);
                const data = response.data;
                console.log("Fetched user profile:", data);


                // const birthDate = data.birthDay || "1990-01-01";
                const birthDate = data.user.account.birthday || "1990-01-01";


                const [birthYear, birthMonth, birthDay] = birthDate.split("-");

                setFormData({
                    avatar:data.user.avatar,
                    full_name: data.user.full_name || "",
                    // gender: data.user.gender,
                    gender: data.user.gender === 0 ? "Male" :data.user.gender==1 ? "Female":"",

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

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
    
        if (!file) return;
    
        // Kiểm tra định dạng file (chỉ nhận ảnh)
        const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
        if (!validTypes.includes(file.type)) {
            setAlertMessage("Chỉ cho phép tải lên file ảnh (JPEG, PNG, JPG, GIF)");
            return;
        }
    
        // Kiểm tra kích thước file (giới hạn 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            setAlertMessage("Kích thước ảnh không được vượt quá 5MB");
            return;
        }
    
        // Xem trước ảnh
        const reader = new FileReader();
        reader.onload = () => {
            setFormData((prevData) => ({
                ...prevData,
                avatarFile: file, // Lưu file ảnh để upload sau
                avatarPreview: reader.result, // Hiển thị xem trước ảnh
            }));
        };
        reader.readAsDataURL(file);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log("Form data submitted:", formData);

        if (!formData.birthYear || !formData.birthMonth || !formData.birthDay) {
            setAlertMessage("Vui lòng nhập đầy đủ ngày, tháng, năm sinh");
            return;
        }

        // Validate phone number
        if (!isValidPhoneNumber(formData.phone, 'VN')) {
            setAlertMessage("Số điện thoại không hợp lệ");
            return;
        }

        // Additional check to ensure phone number starts with '0'
        if (!formData.phone.startsWith('0')) {
            setAlertMessage("Số điện thoại phải bắt đầu bằng số 0");
            return;
        }

        // if (formData.gender === '') {
        //     setAlertMessage("Bạn chưa chọn giới tính!");
        //     return;
        // }

        const formDataToSend = new FormData();
        formDataToSend.append('full_name', formData.full_name);
        formDataToSend.append('phone_number', formData.phone);
        formDataToSend.append('gender', formData.gender === 'Male' ? 0 : formData.gender === 'Female' ? 1 :""); // Assuming 0 for Male, 1 for Female
        // formDataToSend.append('gender', String(formData.gender));
        // formDataToSend.append('birthYear', formData.birthYear);
        // formDataToSend.append('birthMonth', formData.birthMonth);
        // formDataToSend.append('birthDay', formData.birthDay);
        // formDataToSend.append('birthday', `${formData.birthYear}-${formData.birthMonth.padStart(1, '0')}-${formData.birthDay.padStart(2, '0')}`);
        formDataToSend.append(
            'birthday',
            `${formData.birthYear}-${formData.birthMonth.toString().padStart(2, '0')}-${formData.birthDay.toString().padStart(2, '0')}`
        );
        // Nếu người dùng chọn ảnh mới, gửi ảnh lên server
        if (formData.avatarFile) {
            formDataToSend.append("avatar", formData.avatarFile); // Thêm file ảnh vào FormData
        }

        try {
            const response = await RequestAPI.updateProfile(userId, formDataToSend);
            if (response.status === 200) {
                setAlertMessage("Thay đổi thành công");
                setUpdatedUserData(response.data.user);
                setShowDetails(true);
                
                const updatedGender = response.data.user.gender === 0 ? 'Male' : 'Female';
                // Update formData with the new values
                setFormData(prevData => ({
                    ...prevData,
                    full_name: response.data.user.full_name,
                    // gender: response.data.user.gender === 0 ? 'Male' : response.data.user.gender === 1 ? 'Female' :"",
                    // gender: updatedGender,
                    // gender: updatedGender === '' ? undefined : Number(updatedGender),
                    // gender: Number(updatedGender),
                    gender: prevData.gender,
                    email: response.data.user.account.email,
                    phone: response.data.user.phone_number,
                    // Sửa đổi: Xử lý ngày sinh từ dữ liệu API
                    birthYear: response.data.user.account.birthday.split('-')[0],
                    birthMonth: response.data.user.account.birthday.split('-')[1],
                    birthDay: response.data.user.account.birthday.split('-')[2],
                    // birthYear: response.data.user.account.birthYear,
                    // birthMonth: response.data.user.account.birthMonth,
                    // birthDay: response.data.user.account.birthDay,
                    // avatarPreview: response.data.user.avatar || defaultAvatarUrl,
                    avatarPreview: response.data.user.avatar || prevData.avatarPreview, // URL ảnh mới từ server
                }));

                // Set a timeout to reload the page after 3 seconds
                // setTimeout(() => {
                //     window.location.reload();
                // }, 3000);

            } else {
                setAlertMessage("Thay đổi không thành công");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            setAlertMessage("Thay đổi không thành công: " + (error.response?.data?.message || error.message));
        }
    };

    useEffect(() => {
        if (alertMessage) {
          const timer = setTimeout(() => {
            setAlertMessage('');
          }, 3000);
      
          // Cleanup function
          return () => clearTimeout(timer);
        }
      }, [alertMessage]);

    return (
        <div className="profile-container">
             {/* Add this alert message display */}
             {alertMessage && (
                <div className="alert" style={{
                    padding: '10px',
                    backgroundColor: alertMessage.includes('không thành công') ?  '#f44336' : alertMessage.includes('Số điện thoại') ?  '#f44336' : '#4CAF50',
                    color: 'white',
                    marginBottom: '15px',
                    borderRadius: '5px'
                }}>
                    {alertMessage}
                </div>
            )}
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
                    src={
                        formData.avatarPreview || formData.avatar}
                    alt="Avatar"
                />
                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    style={{ display: "none" }} // Ẩn input thực tế
                    onChange={handleAvatarChange}
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
                    onClick={() => document.getElementById("avatarInput").click()} // Kích hoạt input file
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
                            name="full_name"
                            value={formData.full_name}
                            placeholder={formData.full_name}
                            onChange={handleChange}
                            style={{ width: "105%", padding: "8px", borderRadius: "4px", fontSize: "14px" }} 
                        />
                    </div>
                    <div className="form-group">
                        <label style={{ marginLeft: "20px" }}>Giới tính</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            placeholder={formData.gender}
                            onChange={handleChange}
                            style={{
                                marginLeft: "20px",
                                color: "#808080",
                                padding: "8px",
                                borderRadius: "4px",
                                fontSize: "14px",
                            }}
                        >
                            <option value="Male">
                                Nam
                            </option>
                            <option value="Female">
                                Nữ
                            </option>
                            {/* <option value="Binary" style={{ color: "#808080" }}>
                                Binary
                            </option> */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label style={{marginLeft:"-135px",}}>Ngày sinh</label>
                        <div style={{ display: "flex", gap: "10px" ,width:"90% ",marginLeft:"-135px",marginTop:"8px",color: "#808080"}}>
                            {/* <Select
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
                            /> */}
                            <Select
                                options={Array.from({ length: 31 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                                value={{ value: parseInt(formData.birthDay), label: formData.birthDay }}
                                onChange={(selectedOption) =>
                                    setFormData((prevData) => ({ ...prevData, birthDay: selectedOption.value }))
                                }
                            />
                            <Select
                                options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: i + 1 }))}
                                value={{ value: parseInt(formData.birthMonth), label: formData.birthMonth }}
                                onChange={(selectedOption) =>
                                    setFormData((prevData) => ({ ...prevData, birthMonth: selectedOption.value }))
                                }
                            />
                            <Select
                                options={Array.from({ length: 100 }, (_, i) => ({ value: 2024 - i, label: 2024 - i }))}
                                value={{ value: parseInt(formData.birthYear), label: formData.birthYear }}
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
                        value={formData.email}
                        readOnly
                        // onChange={handleChange}
                        // placeholder={formData.email || "customer1@gmail.com"}
                        style={{ width: "75%", padding: "8px", borderRadius: "4px", fontSize: "14px", 
                            backgroundColor: "#f0f0f0",
                            border: "1px solid #ccc",
                            color: "#666",
                            cursor: "not-allowed" }}
                    />
                </div>
                <div className="form-group" style={{ marginRight: "170px" }}>
                    <label>Số điện thoại</label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        placeholder={formData.phone || "0123456789"}
                        onChange={handleChange}
                        style={{ width: "40%", padding: "8px", borderRadius: "4px", fontSize: "14px" }}
                    />
                </div>
                <div className="form-group">
                    <button
                        type="submit"
                        className="save-button"
                        style={{
                            marginTop: "115px",
                            marginLeft: "550px",
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
            {/* {showDetails && updatedUserData && (
                <div className="updated-details" style={{
                    marginTop: '20px',
                    padding: '20px',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ marginBottom: '15px' }}>Thông tin sau khi cập nhật:</h2>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        <p><strong>Họ và tên:</strong> {updatedUserData.full_name}</p>
                        <p><strong>Email:</strong> {updatedUserData.account.email}</p>
                        <p><strong>Số điện thoại:</strong> {updatedUserData.phone_number}</p>
                        <p><strong>Giới tính:</strong> {updatedUserData.gender}</p>
                        <p><strong>Ngày sinh:</strong> {updatedUserData.account.birthday}</p>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default Profile;
