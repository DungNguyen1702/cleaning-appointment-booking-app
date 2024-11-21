import React, { useRef, useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "./CompanyDetails.scss";
import companyAPI from "../api/companyAPI";
import LoadingOverlay from "../components/loading_overlay";
import ImageUploader from "./ImageUploader";

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
        border: "1px solid #ccc",
        fontFamily: "Arial, sans-serif",
        color: "#333",
        fontSize: "16px",
      }}
    />
  );
};

const formatCurrency = (value) => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(numericValue)) return "";
  return numericValue.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
};

const parseCurrency = (value) => {
  const numericValue = value.replace(/[^0-9]/g, "");
  return parseInt(numericValue, 10) || 0;
};

export const CompanyDetails = () => {
  const storedUserInfo = localStorage.getItem("user_info");
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const companyId = storedUserInfo
    ? JSON.parse(storedUserInfo)?.company_id
    : "";
  const [company, setCompany] = useState(null);
  const [quillValue, setQuillValue] = useState("");
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [originalCompany, setOriginalCompany] = useState(null);
  const [imageFiles, setImageFiles] = useState({
    image2: null,
    image3: null,
    image4: null,
    image5: null,
  });
  const [displayServiceCost, setDisplayServiceCost] = useState("");

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

        // Định dạng giá dịch vụ
        setDisplayServiceCost(formatCurrency(companyData.service_cost));
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [companyId]); // Thêm companyId vào dependencies để re-fetch khi companyId thay đổi

  const handleSave = async () => {
    if (!company || !originalCompany) return;

    const newServices =
      quillValue
        .match(/<li>(.*?)<\/li>/g)
        ?.map((item) => item.replace(/<\/?li>/g, "")) || [];
    const updatedData = {
      ...company,
      service: newServices.join(";"), // Chuyển mảng dịch vụ thành chuỗi ngăn cách bằng dấu ";"
    };

    const formData = new FormData();
    formData.append("company_name", updatedData.company_name);
    formData.append("phone", updatedData.phone);
    formData.append("address", updatedData.address);
    formData.append("worktime", updatedData.worktime);
    formData.append("description", updatedData.description);
    formData.append("service", updatedData.service);
    formData.append("service_cost", updatedData.service_cost);

    if (selectedImageFile) {
      formData.append("main_image", selectedImageFile);
    }
    if (imageFiles) {
      const imageFields = ["image2", "image3", "image4", "image5"];
      console.log(imageFields);
      imageFields.forEach((field) => {
        if (imageFiles[field]) {
          console.log(imageFields[field]);
          formData.append(field, imageFiles[field]);
        }
      });
    }

    try {
      setLoading(true);
      const response = await companyAPI.updateCompanyDetails(
        companyId,
        formData
      );
      setCompany(response.data);
      setOriginalCompany(response.data);
      alert("Lưu thay đổi thành công!");
    } catch (error) {
      console.error("Error updating company details:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        alert(
          `Lỗi: ${error.response.data.message || "Có lỗi xảy ra khi lưu!"}`
        );
      } else {
        alert("Có lỗi xảy ra khi lưu!");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageMainChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);
        setCompany((prev) => ({ ...prev, main_image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (field, value) => {
    setImageFiles((prev) => ({
      ...prev,
      [field]: value,
    }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };
    reader.readAsDataURL(value);
  };

  const handleServiceCostChange = (e) => {
    const inputValue = e.target.value;
    const parsedValue = parseCurrency(inputValue);
    setDisplayServiceCost(inputValue);
    setCompany((prev) => ({
      ...prev,
      service_cost: parsedValue,
    }));
  };

  const modules = {
    toolbar: false, // Ẩn thanh công cụ
  };

  // Nếu dữ liệu chưa tải xong
  if (!company || loading) {
    return <LoadingOverlay loading={loading} />;
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
              onChange={handleImageMainChange}
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
                    setCompany((prev) => ({
                      ...prev,
                      company_name: e.target.value,
                    }))
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

              <div className="address-info">
                <label htmlFor="address">Giá dịch vụ</label>
                <input
                  id="address"
                  type="text"
                  value={displayServiceCost}
                  onChange={handleServiceCostChange}
                />
              </div>

              <div className="worktime-info">
                <label htmlFor="worktime">Giờ làm việc</label>
                <input
                  id="worktime"
                  type="text"
                  value={company.worktime}
                  onChange={(e) =>
                    setCompany((prev) => ({
                      ...prev,
                      worktime: e.target.value,
                    }))
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
                <ImageUploader
                  imageSrc={company.image2}
                  onImageChange={(value) => handleImageChange("image2", value)}
                />
                <ImageUploader
                  imageSrc={company.image3}
                  onImageChange={(value) => handleImageChange("image3", value)}
                />
                <ImageUploader
                  imageSrc={company.image4}
                  onImageChange={(value) => handleImageChange("image4", value)}
                />
                <ImageUploader
                  imageSrc={company.image5}
                  onImageChange={(value) => handleImageChange("image5", value)}
                />
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
