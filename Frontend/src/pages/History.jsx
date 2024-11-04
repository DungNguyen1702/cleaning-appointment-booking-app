import React, { useState } from "react";
import { Button, Typography } from "@mui/material"; 
import { FaArrowRight } from "react-icons/fa"; 
import DetailRequest from "./DetailRequest"; 

const History = () => {
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

  
  const companies = [
    { id: 1, name: "Công ty A", requestId: 101 },
    { id: 2, name: "Công ty B", requestId: 102 },
    { id: 3, name: "Công ty C", requestId: 103 },
  ]; 

  return (
    <div>
      <Typography variant="h4">Lịch sử giao dịch</Typography>
      {companies.map((company) => (
        <div key={company.id} style={{ margin: "10px 0" }}>
          <Typography variant="h6">{company.name}</Typography>
          <Button
            variant="outlined"
            className="btn_detail"
            onClick={() => handleOpenModal(company)}
          >
            Xem chi tiết
            <FaArrowRight />
          </Button>
        </div>
      ))}

      <DetailRequest
        open={openModal}
        onClose={handleCloseModal}
        company={selectedCompany}
       
       
      />
    </div>
  );
};

export default History;
