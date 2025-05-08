// src/lib/axios.ts
import axios, { AxiosResponse, AxiosError } from "axios";

// baseURL은 환경변수에서 가져오되 fallback 도 설정
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 15000, // 15초
  withCredentials: true, // 필요시 쿠키/세션 인증 처리
});

// 공통 에러 핸들링 (선택)
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    console.error("[API ERROR]", error.response?.data || error.message);
    // 나중에 toast 에러 출력 등 추가 가능
    return Promise.reject(error);
  }
);

// 파일 업로드용 함수
export const uploadFile = (url: string, formData: FormData, config = {}) => {
  return axiosInstance.post(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    ...config,
  });
};

export default axiosInstance;
