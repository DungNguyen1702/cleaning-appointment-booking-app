import React, { useState, useEffect, useRef } from "react";
import ordericon from "../assets/images/order-icon.png";
import completedicon from "../assets/images/completed-icon.png";
import incompleteicon from "../assets/images/incomplete-icon.png";
import revenueicon from "../assets/images/revenue-icon.png";
import companyAPI from "../api/companyAPI";
import useAuth from "../hooks/useAuth";
import { Bar } from "react-chartjs-2"; // Import Bar chart từ Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import {
  FaRegStar,
  FaStarHalfAlt,
  FaTimesCircle,
  FaDollarSign,
  FaStar,
} from "react-icons/fa";
import { AiOutlineCalendar } from "react-icons/ai";
import "./OverviewStats.scss";

export const OverviewStats = () => {
  const [companyData, setCompanyData] = useState({});
  const [stats, setStats] = useState({});
  const [ratings, setRatings] = useState({});
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);

  const { account } = useAuth();

  const fetchData = async (startDate, endDate) => {
    try {
      setLoading(true);
      const response = await companyAPI.getStatificCompany(
        account.company_id,
        startDate,
        endDate
      );
      const data = response.data[0];
      setStats({
        orders: data.total_jobs,
        completedTasks: data.successful_jobs,
        incompleteTasks: data.failed_jobs,
        revenue: data.total_revenue,
      });

      // Xử lý ratingStatistics
      const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      data.ratingStatistics.forEach((rating) => {
        ratingCounts[rating.rating] = rating.count;
      });
      const totalRatings = data.ratingStatistics.reduce(
        (sum, rating) => sum + rating.count,
        0
      );
      setRatings({
        total: totalRatings,
        stars: ratingCounts,
      });

      setChartData({
        labels: [
          "Thứ 2",
          "Thứ 3",
          "Thứ 4",
          "Thứ 5",
          "Thứ 6",
          "Thứ 7",
          "Chủ nhật",
        ],
        datasets: [
          {
            label: "Số đơn hàng",
            data: [
              data.weekData.THU_HAI[0].soLuong,
              data.weekData.THU_BA[0].soLuong,
              data.weekData.THU_TU[0].soLuong,
              data.weekData.THU_NAM[0].soLuong,
              data.weekData.THU_SAU[0].soLuong,
              data.weekData.THU_BAY[0].soLuong,
              data.weekData.CHU_NHAT[0].soLuong,
            ],
            backgroundColor: [
              "rgba(22, 121, 171, 100)",
              "rgba(16, 44, 87, 100)",
              "rgba(22, 121, 171, 100)",
              "rgba(16, 44, 87, 100)",
              "rgba(22, 121, 171, 100)",
              "rgba(16, 44, 87, 100)",
              "rgba(22, 121, 171, 100)",
            ],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvarta = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getCompanyDetails(account.company_id);
      const data = response.data;

      setCompanyData({
        name: data.company_name,
        email: data.account.email,
        avatar: data.main_image,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAvarta();
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    const sunday = new Date(today);

    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    sunday.setDate(monday.getDate() + 6);

    const startDateStr = monday.toISOString().split("T")[0];
    const endDateStr = sunday.toISOString().split("T")[0];
    setStartDate(startDateStr);
    setEndDate(endDateStr);
    setSelectedDate(startDateStr);

    fetchData(startDateStr, endDateStr);
  }, []);
  // Date picker
  const [startDate, setStartDate] = useState(""); // Ngày thứ Hai
  const [endDate, setEndDate] = useState(""); // Ngày Chủ Nhật
  const [selectedDate, setSelectedDate] = useState("");
  const inputRef = useRef(null); // Tham chiếu đến input

  const handleIconClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // Hiển thị trình chọn ngày
    }
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    setSelectedDate(e.target.value); // Cập nhật ngày đã chọn

    const dayOfWeek = date.getDay(); // Lấy ngày trong tuần (0: Chủ Nhật, 1: Thứ Hai, ...)
    const monday = new Date(date);
    const sunday = new Date(date);

    // Tính ngày thứ Hai và Chủ Nhật
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    sunday.setDate(monday.getDate() + 6);

    // Cập nhật startDate và endDate
    setStartDate(monday.toISOString().split("T")[0]);
    setEndDate(sunday.toISOString().split("T")[0]);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const averageRating = (
    Object.entries(ratings.stars || {}).reduce(
      (sum, [star, count]) => sum + star * count,
      0
    ) / (ratings.total || 1)
  ).toFixed(1);

  // Hàm tính số sao tương ứng với điểm trung bình
  const getFullStars = Math.floor(averageRating); // Số sao đầy
  const getHalfStar =
    averageRating % 1 >= 0.25 && averageRating % 1 < 0.75 ? 1 : 0; // Số sao rưỡi nếu phần thập phân >= 0.25
  const getEmptyStars = 5 - getFullStars - getHalfStar; // Số sao rỗng

  const starColors = {
    5: "#27B7FF",
    4: "#1E8AC1",
    3: "#1673A3",
    2: "#0C4663",
    1: "#041923",
  };

  return (
    <div className="overview-stats">
      {/* Phần 1: Công ty và Lịch chọn thời gian */}
      <div className="company-info">
        <div className="company-avatar-one">
          <div className="company-avatar">
            <img src={companyData.avatar} alt="Avatar" />
          </div>
          <div className="company-details-chart">
            <h2>{companyData.name}</h2>
            <p>{companyData.email}</p>
          </div>
        </div>
        <div className="date-picker">
          {/* Biểu tượng lịch */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Biểu tượng lịch */}
            <AiOutlineCalendar
              size={36}
              style={{ cursor: "pointer" }}
              onClick={handleIconClick} // Khi nhấn, mở trình chọn ngày
            />

            {/* Input ẩn bình thường */}
            <input
              ref={inputRef}
              type="date"
              onChange={handleDateChange}
              value={selectedDate}
              style={{ display: "none" }} // Ẩn input, chỉ dùng để kích hoạt trình chọn ngày
            />
          </div>

          {/* Hiển thị kết quả */}
          <div>
            <input
              type="date"
              value={startDate}
              readOnly
              placeholder="Thứ Hai"
            />
            <span>đến</span>
            <input
              type="date"
              value={endDate}
              readOnly
              placeholder="Chủ Nhật"
            />
          </div>
        </div>
      </div>

      {/* Phần 2: Thống kê */}
      <div className="stats-summary">
        <div className="stat-item">
          <img src={ordericon} alt="Số lần đặt" className="stat-icon" />
          <div className="stat-text">
            <span className="stat-value">{stats.orders}</span>
            <span className="stat-label">Số lần đặt</span>
          </div>
        </div>
        <div className="stat-item">
          <img
            src={completedicon}
            alt="Hoàn thành công việc"
            className="stat-icon"
          />
          <div className="stat-text">
            <span className="stat-value">{stats.completedTasks}</span>
            <span className="stat-label">Hoàn thành công việc</span>
          </div>
        </div>
        <div className="stat-item">
          <img
            src={incompleteicon}
            alt="Không hoàn thành công việc"
            className="stat-icon"
          />
          <div className="stat-text">
            <span className="stat-value">{stats.incompleteTasks}</span>
            <span className="stat-label">Không hoàn thành công việc</span>
          </div>
        </div>
        <div className="stat-item">
          <img src={revenueicon} alt="Doanh thu" className="stat-icon" />
          <div className="stat-text">
            <span className="stat-value">{stats.revenue} đ</span>
            <span className="stat-label">Doanh thu</span>
          </div>
        </div>
      </div>

      {/* Phần 3: Đánh giá */}
      <div className="ratings-summary">
        {/* Biểu đồ cột */}
        <div className="order-time-chart">
          <h3>Thời điểm khách hàng đặt</h3>
          <div className="chart-placeholder">
            {/* Kiểm tra chartData trước khi render biểu đồ */}
            {chartData.labels ? (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  scales: { y: { beginAtZero: true } },
                }}
              />
            ) : (
              <p>Loading chart data...</p>
            )}
          </div>
        </div>
        <div className="star-rating">
          <h3>Số lượt đánh giá</h3>
          <div className="star-rating-container">
            {/* Phần bên trái */}
            <div className="average-rating">
              <div className="average-score">
                {/* Hiển thị điểm trung bình */}
                {averageRating}
              </div>
              {/* Hiển thị số sao tương ứng */}
              <div className="stars-display">
                {Array(getFullStars)
                  .fill()
                  .map((_, index) => (
                    <FaStar key={index} color="#1679AB" />
                  ))}
                {getHalfStar ? <FaStarHalfAlt color="#1679AB" /> : null}
                {Array(getEmptyStars)
                  .fill()
                  .map((_, index) => (
                    <FaRegStar
                      key={index + getFullStars + getHalfStar}
                      color="#1679AB"
                    />
                  ))}
              </div>
              <div className="total-reviews">{ratings.total} lượt đánh giá</div>
            </div>

            {/* Phần bên phải */}
            <div className="detailed-ratings">
              {Object.keys(ratings.stars || {})
                .sort((a, b) => b - a)
                .map((star) => (
                  <div className="rating-row" key={star}>
                    <span className="star-label">
                      {star} <FaStar color="#545454" />
                    </span>
                    <div className="rating-bar">
                      <div
                        className="rating-fill"
                        style={{
                          width: `${
                            ((ratings.stars[star] || 0) /
                              (ratings.total || 1)) *
                            100
                          }%`,
                          backgroundColor: starColors[star], // Áp dụng màu sắc theo sao
                        }}
                      ></div>
                    </div>
                    <span className="rating-count">
                      {ratings.stars[star] || 0}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phần 4: Đánh giá khách hàng */}
      <div className="customer-reviews">
        <div className="reviews-header">
          <h3 className="reviews-title">Feedback từ khách hàng</h3>
          <div className="pagination-buttons">
            <button className="prev-button">{"<"}</button>
            <button className="next-button">{">"}</button>
          </div>
        </div>
        <div className="reviews-list">
          <div className="review-item">
            <div className="review-header">
              <img
                src="https://via.placeholder.com/50"
                alt="Avatar người dùng"
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">Nguyễn Văn A</span>
                <span className="review-time">2 giờ trước</span>
              </div>
            </div>
            <p className="review-text">Dịch vụ rất tốt, tôi hài lòng!</p>
            <div className="review-stars">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < 5 ? "#FFD700" : "#E4E4E4"}
                  />
                ))}
              <span className="star-count">5.0</span>
            </div>
          </div>

          <div className="review-item">
            <div className="review-header">
              <img
                src="https://via.placeholder.com/50"
                alt="Avatar người dùng"
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">Lê Thị B</span>
                <span className="review-time">5 giờ trước</span>
              </div>
            </div>
            <p className="review-text">Giao hàng nhanh chóng và đúng hẹn.</p>
            <div className="review-stars">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < 4 ? "#FFD700" : "#E4E4E4"}
                  />
                ))}
              <span className="star-count">4.0</span>
            </div>
          </div>

          <div className="review-item">
            <div className="review-header">
              <img
                src="https://via.placeholder.com/50"
                alt="Avatar người dùng"
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">Phạm Văn C</span>
                <span className="review-time">1 ngày trước</span>
              </div>
            </div>
            <p className="review-text">Chất lượng sản phẩm chưa đạt yêu cầu.</p>
            <div className="review-stars">
              {Array(5)
                .fill(0)
                .map((_, index) => (
                  <FaStar
                    key={index}
                    color={index < 3 ? "#FFD700" : "#E4E4E4"}
                  />
                ))}
              <span className="star-count">3.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
