import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import "./AddEvent.scss";

const AddEvent = ({ onClose, open }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [repeat, setRepeat] = useState("Không lặp");
  const [repeatFrequency, setRepeatFrequency] = useState(1);
  const [repeatInterval, setRepeatInterval] = useState("tuần");
  const [taskContent, setTaskContent] = useState("");
  const [location, setLocation] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      title,
      date,
      startTime,
      endTime,
      repeat,
      repeatFrequency,
      repeatInterval,
      selectedDays,
      taskContent,
      location,
    });
    onClose();
  };

  const handleDaySelection = (event, newSelectedDays) => {
    setSelectedDays(newSelectedDays);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Tạo sự kiện
        </Typography>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} className="add-event-container">
          {/* Tiêu đề */}
          <TextField
            fullWidth
            label="Thêm tiêu đề"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
          />
          <br/>

          {/* Ngày và Giờ */}
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Ngày"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Giờ bắt đầu"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label="Giờ kết thúc"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                margin="normal"
              />
            </Grid>
          </Grid>
                <br/>
          {/* Lặp lại */}
          <FormControl fullWidth margin="normal">
            <InputLabel>Lặp lại</InputLabel>
            <Select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              label="Lặp lại"
            >
              <MenuItem value="Không lặp">Không lặp</MenuItem>
              <MenuItem value="Hàng ngày">Hàng ngày</MenuItem>
              <MenuItem value="Hàng tuần">Hàng tuần</MenuItem>
            </Select>
          </FormControl>

          {/* Tùy chỉnh lịch lặp */}
          {repeat !== "Không lặp" && (
            <>
              <ToggleButtonGroup
                value={selectedDays}
                onChange={handleDaySelection}
                className="repeat-toggle-buttons"
              >
                {["Cn", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <ToggleButton key={day} value={day}>
                    {day}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cứ mỗi"
                    type="number"
                    value={repeatFrequency}
                    onChange={(e) => setRepeatFrequency(e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Khoảng cách</InputLabel>
                    <Select
                      value={repeatInterval}
                      onChange={(e) => setRepeatInterval(e.target.value)}
                      label="Khoảng cách"
                    >
                      <MenuItem value="tuần">Tuần</MenuItem>
                      <MenuItem value="tháng">Tháng</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </>
          )}
             <br/>
          {/* Nội dung công việc */}
          <TextField
            fullWidth
            label="Nội dung công việc"
            variant="outlined"
            value={taskContent}
            onChange={(e) => setTaskContent(e.target.value)}
            multiline
            rows={4}
            margin="normal"
          />
             <br/>       
          {/* Địa điểm */}
          <TextField
            fullWidth
            label="Địa điểm"
            variant="outlined"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            margin="normal"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
        <Button type="submit" color="primary" onClick={handleSubmit}>
          Lưu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddEvent;
