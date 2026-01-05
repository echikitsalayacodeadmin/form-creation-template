import API from "./axiosInstance";

// 1️⃣ Send OTP
export const sendOtp = async (mobile) => {
  const res = await API.post(`https://auth.uno.care/send/patient/otp`, {
    mobile: mobile,
    //  role: "DOCTOR",
    //  portal: "ADMIN",
    //  email: "",
    encrypt: true,
  });
  return res.data;
};

// 2️⃣ Verify OTP
export const verifyOtp = async (mobile, otp) => {
  const res = await API.post(`https://auth.uno.care/authenticate/otp/patient`, {
    mobile,
    otp,
    //role,
    //portal
  });
  return res.data;
};

// 3️⃣ Get patient by authId
export const getPatientByAuthId = async (authId, mobile) => {
  const res = await API.get(`/patient/authId/${authId}?mobile=${mobile}`);
  return res.data;
};

// 4️⃣ Get labs
export const getLabs = async ({ lat, lng, corpId, empId, city }) => {
  const res = await API.get(
    `/lab/all?city=${city}&userLocationCoordinates=${lat}%2C${lng}&corpId=${corpId}&empId=${empId}`
  );
  return res.data;
};
