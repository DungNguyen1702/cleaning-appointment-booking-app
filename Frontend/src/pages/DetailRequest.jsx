import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import "./DetailRequest.scss";
import RequestAPI from "../api/requestAPI"; // Import the RequestAPI

const CompanyDetailModal = ({ open, onClose,company }) => {
  const [transactionData, setTransactionData] = useState(null);
  const requestId = company; // Set the request ID to fetch details
  // console.log(company?.request_id,company)

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (open) {
        try {
          const response = await RequestAPI.getCompanyDetails(requestId); // Fetch company details
          console.log("Fetched company details:", response.data); // Log the response
          setTransactionData(response.data); // Store the transaction details
        } catch (error) {
          console.error("Error fetching company details:", error);
        }
      }
    };

    fetchTransactionData();
  }, [open]); // Fetch data when modal opens

  // Function to format the price to VND with thousand separators
  const formatCurrency = (amount) => {
    if (!amount) return "0";
    return `${Number(amount).toLocaleString('vi-VN')} VND`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          width: '700px',
          padding: '24px',
        },
      }}
    >
      <DialogTitle className="modal-title">
        <b>Chi tiết lịch sử giao dịch</b>
      </DialogTitle>
      <hr className="separator" /> {/* Horizontal line separator */}
      <DialogContent className="modal-content">
        <div className="left-column">
          <Typography>
            <span className="transaction-detail-label">Công ty giao dịch:</span> 
            <span className="transaction-detail-value">{transactionData?.company?.company_name || "Công ty 1"}</span>
          </Typography><br/>
          <Typography>
            <span className="transaction-detail-label">Ngày thuê:</span>
            <span className="transaction-detail-value">{transactionData?.timejob ? new Date(transactionData.timejob).toLocaleDateString('vi-VN') : "15/09/2024"}</span>
          </Typography><br/>
          <Typography>
            <span className="transaction-detail-label">Ngày giao dịch:</span>
            <span className="transaction-detail-value">{transactionData?.request_date ? new Date(transactionData.request_date).toLocaleDateString('vi-VN') : "13/09/2024"}</span>
          </Typography><br/>
          <Typography className="transaction-detail-label"><b>Nội dung công việc:</b></Typography>
          <ul>
            <li>• {transactionData?.status}</li>
          </ul><br/>
          <Typography className="note-section"><b>Ghi chú:</b> {transactionData?.notes || "Ghi chú không có"}</Typography><br/>
        </div>
        <div className="right-column">
          <Typography>
            <span className="transaction-detail-label">Tên người giao dịch:</span>
            <span className="transaction-detail-value">{transactionData?.name || "Khách hàng 1"}</span>
          </Typography><br/>
          <Typography>
            <span className="transaction-detail-label">Địa điểm:</span>
            <span className="transaction-detail-value">{transactionData?.address || "Địa chỉ 1"}</span>
          </Typography><br/>
          <Typography>
            <span className="transaction-detail-label">Số điện thoại:</span>
            <span className="transaction-detail-value">{transactionData?.phone || "0123456781"}</span>
          </Typography>
        </div>
      </DialogContent>
      <DialogActions className="price-section">
        <Typography variant="h5">{formatCurrency(transactionData?.price) || "240.000 VND"}</Typography>
      </DialogActions>
      <DialogActions className="dialog-actions">
        <Button onClick={onClose} color="primary" variant="contained">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDetailModal;
