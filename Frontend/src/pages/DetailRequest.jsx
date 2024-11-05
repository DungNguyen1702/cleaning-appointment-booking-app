import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import "./DetailRequest.scss";
import RequestAPI from "../api/requestAPI";

const CompanyDetailModal = ({ open, onClose, company }) => {
  const [transactionData, setTransactionData] = useState(null);
  const requestId = company;

  useEffect(() => {
    const fetchTransactionData = async () => {
      if (open) {
        try {
          const response = await RequestAPI.getCompanyDetails(requestId);
          console.log("Fetched company details:", response.data);
          setTransactionData(response.data);
        } catch (error) {
          console.error("Error fetching company details:", error);
        }
      }
    };

    fetchTransactionData();
  }, [open, requestId]);

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
      <hr className="separator" />
      <DialogContent className="modal-content">
        <div className="left-column">
          <Typography>
            <span className="transaction-detail-label">Công ty giao dịch:</span>
            <span className="transaction-detail-value">{transactionData?.company?.company_name || "Công ty 1"}</span>
          </Typography><br />
          <Typography>
            <span className="transaction-detail-label">Ngày thuê:</span>
            <span className="transaction-detail-value">{transactionData?.timejob ? new Date(transactionData.timejob).toLocaleDateString('vi-VN') : "15/09/2024"}</span>
          </Typography><br />
          <Typography>
            <span className="transaction-detail-label">Ngày giao dịch:</span>
            <span className="transaction-detail-value">{transactionData?.request_date ? new Date(transactionData.request_date).toLocaleDateString('vi-VN') : "13/09/2024"}</span>
          </Typography><br />
          <Typography className="transaction-detail-label"><b>Nội dung công việc:</b></Typography>
          <ul>

            {Array.isArray(transactionData?.request)
              ? transactionData.request.map((item, index) => (
                <li key={index}>• {item}</li>
              ))
              : <li>• {transactionData?.request || "Không có nội dung công việc"}</li>}
          </ul><br />
          <Typography className="note-section"><b>Ghi chú:</b> {
            transactionData?.notes
              .replace(/<\/?[^>]+>/g, ', ')  
              .replace(/,\s*,/g, ', ')      
              .replace(/(^,\s*|\s*,\s*$)/g, '')  
              .replace(/[, ]+$/, '')
            || "Ghi chú không có"}</Typography><br/>


        </div>
        <div className="right-column">
          <Typography>
            <span className="transaction-detail-label">Tên người giao dịch:</span>
            <span className="transaction-detail-value">{transactionData?.name || "Khách hàng 1"}</span>
          </Typography><br />
          <Typography>
            <span className="transaction-detail-label">Địa điểm:</span>
            <span className="transaction-detail-value">{transactionData?.address || "Địa chỉ 1"}</span>
          </Typography><br />
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