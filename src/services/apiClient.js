import axios from "axios";
import { decodeUser } from "./decode-user";

const user = decodeUser();

// Local Backend
export default axios.create({
  baseURL: "https://localhost:44342/api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + user?.token,
  },
});

// KEIGH BACKEND
// export default axios.create({
//   baseURL: "https://10.10.10.14:6001/api/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + user?.token,
//   },
// });

// LIVE
// export default axios.create({
//   baseURL: "http://10.10.2.31:82/api/",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: "Bearer " + user?.token,
//   },
// });
