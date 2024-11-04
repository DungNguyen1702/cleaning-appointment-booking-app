import React, { useState, useEffect } from "react";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { FaArrowRight } from "react-icons/fa";
import logo_company from "../assets/images/logo_company.png";
import locationAPI from "../api/locationAPI";
import companyAPI from "../api/companyAPI";
import "./CleaningCompany.scss";
import { Link, NavLink } from "react-router-dom";
import LoadingOverlay from "../components/loading_overlay";

const CleaningCompany = () => {
  const [provinces, setProvinces] = useState([]);
  const [companies, setCompany] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchName, setSearchName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    locationAPI
      .getProvinces()
      .then((response) => {
        if (response.data.error === 0) {
          setProvinces(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);
  const handleProvinceChange = (event) => {
    setSelectedProvince(event.target.value);
  };
  const handleChange = (event, value) => {
    setCurrentPage(value);
  };
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await companyAPI.getListCompany(
        currentPage,
        selectedProvince,
        searchName
      );
      console.log(response);
      setCompany(response.data.companies);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, [currentPage, selectedProvince]);

  const handleSearchChange = (event) => {
    setSearchName(event.target.value);
  };

  const handleFilter = () => {
    fetchCompanies();
  };
  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchCompanies();
    }
  };
  return (
    <div className="user-list-cng-ty">
      <div className="container">
        <LoadingOverlay loading={loading} />
        <Typography variant="h4" className="heading-seller">
          Công ty dọn dẹp
        </Typography>
        <div className="filter-options">
          <div className="input-search">
            <input
              type="text"
              placeholder="Tìm kiếm công ty"
              className="search-input"
              value={searchName}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
            />
          </div>
          {/* <img className="image-fill" alt="Image fill" src={imageFill} /> */}
          <div className="filter-address">
            <select value={selectedProvince} onChange={handleProvinceChange}>
              <option value="">Địa điểm...</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.name}>
                  {province.full_name}
                </option>
              ))}
            </select>
            <Button
              className="btn-filter"
              variant="contained"
              onClick={handleFilter}
            >
              {" "}
              Lọc
            </Button>
          </div>
        </div>
        {companies.length === 0 ? (
          <div className="no-products">
            <p>Không có sản phẩm hợp lệ</p>
          </div>
        ) : (
          <>
            <Grid container spacing={2} className="container-card">
              {companies.map((company, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card className="company-card">
                    <CardContent className="company-card-content">
                      <div className="company-detail">
                        <img
                          className="logo-company"
                          alt="Sellerlogo"
                          src={company.main_image}
                        />
                        <Typography variant="h6" className="heading-card">
                          {company.company_name}
                        </Typography>
                        <Typography className="text-card">
                          {company.address_tinh}
                        </Typography>
                      </div>
                      <div className="company-tk">
                        <div className="company-tk-uses">
                          <Typography className="content">
                            {company.completedRequestsCount}
                          </Typography>
                          <Typography className="title">Lượt dùng</Typography>
                        </div>
                        <hr className="vertical-line" />
                        <div className="company-tk-cost">
                          <Typography className="content">
                            {company.service_cost}
                          </Typography>
                          <Typography className="title">Giá</Typography>
                        </div>
                      </div>
                      <hr className="hos-line" />
                      <div className="button-detail">
                        <Link
                          to={`/dashboard/company/${company.company_id}`}
                          className="member-btn"
                        >
                          <Button variant="outlined" className="btn_detail">
                            Xem chi tiết
                            <FaArrowRight />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Pagination
              count={totalPages}
              variant="outlined"
              shape="rounded"
              page={currentPage}
              onChange={handleChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CleaningCompany;
