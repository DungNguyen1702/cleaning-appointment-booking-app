import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faMapMarkerAlt,
  faEnvelope,
  faMoneyBill,
  faCalendar,
  faStar,
} from "@fortawesome/free-solid-svg-icons"; 
import "./DetailCompany.scss";
import companyAPI from "../api/companyAPI";
import LoadingOverlay from "../components/loading_overlay";

const DetailCompany = () => {
  const { companyId } = useParams();
  const [companyDetail, setCompanyDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      try {
        setLoading(true);
        const response = await companyAPI.getCompanyDetails(companyId);
        console.log("API response:", response.data);
        setCompanyDetail(response.data);
        setMainImage(response.data.main_image);
      } catch (error) {
        console.error("Error fetching company details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetail();
  }, [companyId]);

  if (!companyDetail) return <LoadingOverlay loading={loading} />;

  const totalReviews = companyDetail.ratingStatistics.reduce(
    (acc, stat) => acc + stat.count,
    0
  );

  const handleThumbnailClick = (image, imageKey) => {
    setCompanyDetail((prevDetails) => {
     
      const updatedDetail = { ...prevDetails, [imageKey]: mainImage };
      setMainImage(image); 
      return updatedDetail;
    });
  };

  // Hàm hiển thị số sao dựa trên rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating); 
    const halfStar = rating % 1 >= 0.5; 
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <FontAwesomeIcon
            key={`full-${index}`}
            icon={faStar}
            style={{ color: "gold" }}
          />
        ))}
        {halfStar && (
          <FontAwesomeIcon icon={faStar} style={{ color: "gold" }} />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <FontAwesomeIcon
            key={`empty-${index}`}
            icon={faStar}
            style={{ color: "#e0e0e0" }}
          />
        ))}
      </>
    );
  };

  return (
    <div className="container">
      <div className="main-content full-width">
        <LoadingOverlay loading={loading} />
        <div>
          <h1>
            <b>Chi Tiết Công Ty</b>
          </h1>
          <div className="company-details">
            <div className="image-section">
              <img src={mainImage} alt="company" className="main-image" />
              <div className="thumbnail-section">
                {companyDetail.image2 && (
                  <img
                    src={companyDetail.image2}
                    alt="thumbnail"
                    onClick={() =>
                      handleThumbnailClick(companyDetail.image2, "image2")
                    }
                  />
                )}
                {companyDetail.image3 && (
                  <img
                    src={companyDetail.image3}
                    alt="thumbnail"
                    onClick={() =>
                      handleThumbnailClick(companyDetail.image3, "image3")
                    }
                  />
                )}
                {companyDetail.image4 && (
                  <img
                    src={companyDetail.image4}
                    alt="thumbnail"
                    onClick={() =>
                      handleThumbnailClick(companyDetail.image4, "image4")
                    }
                  />
                )}
                {companyDetail.image5 && (
                  <img
                    src={companyDetail.image5}
                    alt="thumbnail"
                    onClick={() =>
                      handleThumbnailClick(companyDetail.image5, "image5")
                    }
                  />
                )}
              </div>

              <NavLink
                to={`/dashboard/appointmentform?companyId=${companyDetail.company_id}`}
              >
                <button className="button-booking">Đặt lịch</button>
              </NavLink>
            </div>

            <div className="info-section">
              <h2 style={{ fontSize: "30px", fontWeight: "bold" }}>
                {companyDetail.company_name}
              </h2>
              <p
  style={{
    fontWeight: "normal",
    color: "#555",
    marginLeft: "10px",
    fontSize: "16px",
    textAlign: "center",
    display: "inline-block", 
    width: "260px", 
    borderTop: "1px solid #ccc", 
    borderBottom: "1px solid #ccc", 
    padding: "10px 0", 
 
  }}
>
 
<span style={{ marginLeft: "150px", fontWeight: "bold" }}>
    {companyDetail.service_cost} đ / giờ
  </span>
</p>


              <br />
              <p>
                <b>Giới thiệu:</b>
              </p>
              <p
                style={{
                  fontWeight: "normal",
                  color: "#555",
                  marginLeft: "20px",
                  fontSize: "15px"
                }}
              >
                {companyDetail.description}
              </p>
              <br />
              <p>
                <b>Dịch vụ :</b>
              </p>
              <p
                style={{
                  fontWeight: "normal",
                  color: "#555",
                  marginLeft: "20px",
                  fontSize: "15px"
                }}
              >
                {companyDetail.service}
              </p>
              <br />
              <p>
                <b>Thời gian làm việc:</b>
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faCalendar}
                  style={{ marginLeft: "25px" , fontSize: "15px",color: "#555"}}
                />     {"  "}
             <a style={{ marginLeft: "10px" , fontSize: "15px" ,}} >   Khung giờ làm việc :</a>
              </p>
              <p
                style={{
                  fontWeight: "normal",
                  color: "#555",
                  marginLeft: "53px",
                   fontSize: "15px",marginTop:'12px'
                }}
              >
                {companyDetail.worktime}
              </p>
              <br />
              <b>Thông tin liên hệ:</b>
              <p
                style={{
                  fontWeight: "normal",
                  color: "#555",
                  marginLeft: "25px",
                   fontSize: "15px"
                }}
              >
                <FontAwesomeIcon icon={faPhone} />  <span  style={{ marginLeft: "10px" }}> Số điện thoại:{" "}
                {companyDetail.phone}</span>
              </p>
              <br />
              <p
                style={{
                  fontWeight: "normal",
                  color: "#555",
                  marginLeft: "25px",
                   fontSize: "15px"
                }}
              >
                <FontAwesomeIcon icon={faEnvelope} /> <span  style={{ marginLeft: "10px" }}>Email:{" "}
                {companyDetail.account.email}</span>
              </p>
              <br />
              <p
                style={{
                  fontWeight: "normal",
                  color: "#555",
                  marginLeft: "25px",
                   fontSize: "15px"
                }}
              >
                <FontAwesomeIcon icon={faMapMarkerAlt} />  <span  style={{ marginLeft: "14px" }}>Địa chỉ:
                {companyDetail.address} , {companyDetail.address_tinh}</span>
              </p>
              <br />
            </div>
          </div>
          <br />
          <div className="reviews-section">
            <h3>
              <b>Đánh Giá & Nhận Xét</b>
            </h3>
            <div className="rating-summary">
              <div className="rating-score">
                <span className="score">
                  {(
                    companyDetail.ratingStatistics.reduce(
                      (acc, stat) => acc + stat.rating * stat.count,
                      0
                    ) / totalReviews
                  ).toFixed(1)}
                </span>
                <div className="star-rating">
                  {renderStars(
                    (
                      companyDetail.ratingStatistics.reduce(
                        (acc, stat) => acc + stat.rating * stat.count,
                        0
                      ) / totalReviews
                    ).toFixed(1)
                  )}
                </div>
                <p>{totalReviews} Lượt đánh giá</p>
              </div>

              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="rating-bar">
                    <span>{rating} ⭐</span>
                    <div className="progress-bar">
                      <div
                        className="fill"
                        style={{
                          width: `${
                            ((companyDetail.ratingStatistics.find(
                              (stat) => stat.rating === rating
                            )?.count || 0) /
                              totalReviews) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span>
                      {companyDetail.ratingStatistics.find(
                        (stat) => stat.rating === rating
                      )?.count || 0}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCompany;
