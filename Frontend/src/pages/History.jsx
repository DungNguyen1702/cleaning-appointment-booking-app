

import { Button, Typography } from "@mui/material"; 

import DetailRequest from "./DetailRequest"; 

import "./History.scss"
import React, { useState, useEffect } from "react";

import Pagination from "@mui/material/Pagination";
import { FaArrowRight } from "react-icons/fa";

import RequestAPI from "../api/requestAPI";

import { Link, NavLink } from "react-router-dom";
import LoadingOverlay from "../components/loading_overlay";
const History = () => {
    const [dataSearch,setDataSearch] = useState({
        name:"",date:""
    })
    const [history,setHistory] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [sttRes,setSttRes] = useState("")
    const handleSearchChange = (e) =>{
        const { name, value } = e.target;
        setDataSearch({ ...dataSearch, [name]: value });
    }
    const handleChange =(e, value)=>{
        setCurrentPage(value);
    }
    const storedUserInfo = localStorage.getItem("user_info");
    const user_id = storedUserInfo ? JSON.parse(storedUserInfo)?.user_id : "";
    const fetchHistory = async () => {
        try {
          setLoading(true);
          console.log(currentPage,user_id,dataSearch.name,dataSearch.date)
          const response = await RequestAPI.getHistory(currentPage,user_id,dataSearch.name,dataSearch.date,8)
          console.log(response);
          

            setHistory(response.data.companies);
            setTotalPages(response.data.totalPages);
            setSttRes("");
           
        } catch (error) {
          console.error("Error fetching history:", error);
          setSttRes(error.response.data.message);
        } finally {
          setLoading(false);
        }
      };
    useEffect(() => {
        fetchHistory();
    }, [currentPage,dataSearch.date]);

    const handleSearchKeyPress = (event) => {
        if (event.key === "Enter") {
          fetchHistory();
          
        }
    };


      //của thanh 
    const [openModal, setOpenModal] = useState(false); 
    const [selectedCompany, setSelectedCompany] = useState(null); 

    const handleOpenModal = (company) => {
        setSelectedCompany(company); 
        setOpenModal(true); 
    };

    const handleCloseModal = () => {
        setOpenModal(false); 
        setSelectedCompany(null); 
    };

    // console.log(dataSearch,user_id)
    return (
        <div>
            <LoadingOverlay loading={loading} />
            <h4 className="title-left">Lịch sử giao dịch</h4>
            <div className="abc">
                <div className="nav-search">
                    <input 
                        type="text" className="input-name" name="name" 
                        value={dataSearch.name} 
                        id="" placeholder="Nhập vào tên công ty"
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyPress} 
                        />
                    <input type="date" className="input-date"
                    name="date" value={dataSearch.date} id="" 
                    onChange={handleSearchChange}   />
                </div>
                {sttRes!==""? 
                (
                <div className="no-products">
                    <p>{sttRes}</p>
                </div>
                ) : (
                    <>
                <div className="list-company">
                    {history.map((h, index) => (
                    <div className="company">
                        <div className="price">
                            <span>{Number(h.price).toLocaleString("vi-VN")} VNĐ</span>
                        </div>
                        <div className="avatar-name">
                            <div className="avatar">
                                <img src={h.company.main_image} alt="" />

                            </div>
                            <div className="name-address">
                                <p className="name">{h.company.company_name}</p>
                                <p className="address">{h.company.address_tinh}</p>
                            </div>

                        </div>
                        <div className="date-rent">
                            <span >Ngày thuê : </span>
                            <span className="date">{h.timejob}</span>

                        </div>
                        <div className="content-descp">
                            <span>Nội dung công việc : </span>
                            <p>{h.request}
                            </p>

                        </div>
                        <hr/>
                        <div className="view-detail">
                            <Button onClick={() => handleOpenModal(h.request_id)}>
                                Xem chi tiết
                            </Button>    
                        </div>


                        
                        
                    </div>
                        
                        
                    ))}
                   
                </div>
                <div className="pagination">
                        <Pagination
                            count={totalPages}
                            variant="outlined"
                            shape="rounded"
                            page={currentPage}
                            onChange={handleChange}
                            />
                </div> 
                </>
                )
                }
                
            </div>
            


            <DetailRequest
                open={openModal}
                onClose={handleCloseModal}
                company={selectedCompany}
       
       
            />
            
        </div>
    );
}


export default History;
