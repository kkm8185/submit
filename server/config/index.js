import dotenv from "dotenv";
dotenv.config();
export default {
  PORT: process.env.PORT || 9000,
  USER: "아이디",
  PASSWORD: "비밀번호",
  CONNECTSTRING: "주소",
};
