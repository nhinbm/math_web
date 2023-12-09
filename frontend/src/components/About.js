import React from "react";
import "./styles.css";

const INFORMATION = [
  {
    name: "Nguyễn Bùi Mẫn Nhi",
  },
];

const About = () => {
  return (
    <div className="about-wrapper">
      <div>Đồ án: Nhập môn học máy</div>
      <div>Trường: Đại học Khoa học Tự nhiên</div>
      <div>Lớp: 21CLC01</div>
      <div>Thành viên nhóm:</div>
      <div>Nguyễn Trần Trung Kiên - 211127327</div>
      <div>Đinh Công Huy Hoàng - 21127507</div>
      <div>Nguyễn Trần Minh Khôi - 21127518</div>
      <div>Nguyễn Bùi Mẫn Nhi - 21127662</div>
      <div>Trần Thuận Phát - 21127666</div>
    </div>
  );
};

export default About;
