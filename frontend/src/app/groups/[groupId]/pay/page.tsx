"use client";

import { useSearchParams } from "next/navigation";

export default function PayPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) return <div className="p-4">잘못된 접근입니다.</div>;

  const qrImageUrl = `http://localhost:8000/api/attendance/qr/image/${token}`; // API URL

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold text-center">N등분 결제 QR</h1>

      <div className="flex justify-center">
        <img src={qrImageUrl} alt="QR 이미지" className="w-48 h-48" />
      </div>

      <p className="text-center text-sm text-gray-500">
        이 QR코드를 스캔해 결제를 진행하세요.
      </p>
    </div>
  );
}
