import multer from 'multer';

// Cấu hình lưu trữ bộ nhớ
const storage = multer.memoryStorage();

// Cấu hình multer để nhận tối đa 5 file
const upload = multer({
  storage,
  limits: { files: 5 }, // Giới hạn số lượng file
});

// Đặt tên cụ thể cho từng ảnh
export const uploadFields = upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'image2', maxCount: 1 },
  { name: 'image3', maxCount: 1 },
  { name: 'image4', maxCount: 1 },
  { name: 'image5', maxCount: 1 },
]);

export default upload;
