import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "./CompanyDetails.scss";
import companyAPI from "../api/companyAPI";

const AutoResizeTextarea = ({ value, onChange }) => {
  const textareaRef = useRef(null);
  const [height, setHeight] = useState("auto");

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  const handleChange = (e) => {
    setHeight("auto");
    onChange(e);
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={handleChange}
      style={{
        height,
        resize: "none",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
        padding: "12px 24px",
      }}
    />
  );
};


export const CompanyDetails = () => {
  // const companyData = {
  //   mainlogo: companylogo,
  //   logo1: logocompany,
  //   logo2: logocompany,
  //   logo3: logocompany,
  //   logo4: logocompany,
  //   name: "X Factor",
  //   email: "xfactor@gmail.com",
  //   phone: "0910102024",
  //   address: "1234 Main St, Da Nang, Vietnam",
  //   introduction: `Chuyên cung cấp các dịch vụ vệ sinh nhà cửa quanh khu vực Đà nẵng. Đảm bảo sạch sẽ, thơm tho mang lại cảm giác thoải mái cho người dùng.`,
  //   services: [
  //     "Lau chùi nhà cửa bao gồm tất cả dịch vụ lau chùi các thiết bị trong nhà.",
  //     "Hỗ trợ bàn giặt ủi và phơi đồ tại nhà.",
  //     "Hỗ trợ đi chợ giúp gia chủ.",
  //   ],
  //   hours: {
  //     sunday: { isOpen: false, start: "", end: "" },
  //     monday: { isOpen: true, start: "09:00", end: "17:00" },
  //     tuesday: { isOpen: true, start: "09:00", end: "17:00" },
  //     wednesday: { isOpen: true, start: "09:00", end: "17:00" },
  //     thursday: { isOpen: true, start: "09:00", end: "17:00" },
  //     friday: { isOpen: true, start: "09:00", end: "17:00" },
  //     saturday: { isOpen: false, start: "", end: "" },
  //   },
  // };
  const storedUserInfo = localStorage.getItem("user_info");
  const companyId = storedUserInfo ? JSON.parse(storedUserInfo)?.company_id : "";
  const [company, setCompany] = useState(null);
  const [quillValue, setQuillValue] = useState("");
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [originalCompany, setOriginalCompany] = useState(null);

  useEffect(() => {
    // Kiểm tra xem companyId có hợp lệ không
    if (!companyId) {
      console.error("Company ID is missing or invalid");
      return;
    }

    const fetchCompanyDetails = async () => {
      setLoading(true);
      try {
        const response = await companyAPI.getCompanyDetailsByRole(companyId);
        const companyData = response.data;
    
        // Lưu dữ liệu gốc
        setOriginalCompany(companyData);
    
        // Đặt dữ liệu vào state để hiển thị
        setCompany({
          ...companyData,
          account: companyData.account || {}, // Đảm bảo account không undefined
        });
    
        // Xử lý dịch vụ từ chuỗi sang mảng (như trước đây)
        const servicesArray = companyData.service
          ? companyData.service.split(";").map((s) => s.trim())
          : [];
        const updatedQuillValue = `<ul>${servicesArray
          .map((service) => `<li>${service}</li>`)
          .join("")}</ul>`;
        setQuillValue(updatedQuillValue);
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };    

    fetchCompanyDetails();
  }, [companyId]);  // Thêm companyId vào dependencies để re-fetch khi companyId thay đổi


  const getChangedData = (original, updated) => {
    const changedData = {};
  
    Object.keys(original).forEach((key) => {
      if (original[key] !== updated[key]) {
        changedData[key] = updated[key];
      }
    });
  
    return changedData;
  };
  
  const handleSave = async () => {
    if (!company || !originalCompany) return;
  
    const newServices = quillValue
    .match(/<li>(.*?)<\/li>/g)
    ?.map((item) => item.replace(/<\/?li>/g, "")) || [];
    const updatedData = {
      ...company,
      service: newServices.join(";"), // Chuyển mảng dịch vụ thành chuỗi ngăn cách bằng dấu ";"
    };
  
  
    // So sánh với dữ liệu gốc
    const changedData = getChangedData(originalCompany, updatedData);
  
    console.log("Dữ liệu thay đổi gửi lên:", changedData);
  
    try {
      setLoading(true);
      const response = await companyAPI.updateCompanyDetails(companyId, changedData);
      setCompany(response.data);
      setOriginalCompany(response.data); // Cập nhật lại dữ liệu gốc sau khi lưu
      alert("Lưu thay đổi thành công!");
    } catch (error) {
      console.error("Error updating company details:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        alert(`Lỗi: ${error.response.data.message || "Có lỗi xảy ra khi lưu!"}`);
      } else {
        alert("Có lỗi xảy ra khi lưu!");
      }
    } finally {
      setLoading(false);
    }
  };
  
  
  
  

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompany((prev) => ({ ...prev, main_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const modules = {
    toolbar: false, // Ẩn thanh công cụ
  };
  
  // Nếu dữ liệu chưa tải xong
  if (!company || loading) {
    return <div>Đang tải...</div>;
  }
  return (
    <div className="company-profile">
      <div className="main-content">
        <div className="header">
          <h1>Thông tin công ty</h1>
        </div>
        <div className="profile-section">
          <div className="profile-picture-section">
            <div className="profile-picture-title">
              <img
                className="profile-picture"
                alt="Company Logo"
                src={company.main_image || main_image}
              />
              <h4 className="company-name-title">{company.company_name}</h4>
            </div>
            <button
              className="choose-image-button"
              onClick={() => fileInputRef.current.click()}
            >
              Chọn ảnh
            </button>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </div>

          <div className="company-details">
            <div className="company-info">
              <div className="company-name">
                <label htmlFor="company-name">Công ty</label>
                <input
                  id="company-name"
                  type="text"
                  value={company.company_name}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, company_name: e.target.value }))
                  }                  
                />
              </div>

              <div className="email-info">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={company.account.email}
                  readOnly
                />
              </div>

              <div className="phone-info">
                <label htmlFor="phone">Số điện thoại</label>
                <input
                  id="phone"
                  type="text"
                  value={company.phone}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>

              <div className="address-info">
                <label htmlFor="address">Địa chỉ</label>
                <input
                  id="address"
                  type="text"
                  value={company.address}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, address: e.target.value }))
                  }
                />
              </div>

              <div className="worktime-info">
                <label htmlFor="worktime">Giờ làm việc</label>
                <input
                  id="worktime"
                  type="text"
                  value={company.worktime}
                  onChange={(e) =>
                    setCompany((prev) => ({ ...prev, worktime: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="description-section">
              <div className="introduction">
                <h2>Giới thiệu:</h2>
                <AutoResizeTextarea
                  value={company.description}
                  onChange={(e) =>
                    setCompany((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="service-info">
                <label htmlFor="services">Dịch vụ: </label>
                <ReactQuill
                  value={quillValue}
                  onChange={setQuillValue}
                  modules={modules}
                  ref={quillRef}
                  theme="snow"
                  placeholder="Nhập dịch vụ công ty"
                />
              </div>

              <div className="list-image">
                <img src={company.main_image} alt="thumbnails" />
                <img src={company.image2} alt="thumbnails" />
                <img src={company.image3} alt="thumbnails" />
                <img src={company.image4} alt="thumbnails" />
              </div>
            </div>
          </div>
        </div>

        <div className="save-button-section">
          <button className="save-button" onClick={handleSave}>
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};
