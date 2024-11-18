import React, { useState } from "react";
import AddEvent from "./AddEvent";
import { Button } from "@mui/material"; 

const Schedule = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="schedule-container">
            <h1>Lịch trình</h1>
            <Button
                onClick={handleOpenModal}
                variant="contained"
                color="primary"
                className="add-job-button"
            >
                Thêm công việc
            </Button>

            {isModalOpen && <AddEvent open={isModalOpen} onClose={handleCloseModal} />}
        </div>
    );
};

export default Schedule;
