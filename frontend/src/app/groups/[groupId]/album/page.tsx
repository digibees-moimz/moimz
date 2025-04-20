"use client";

import { useState } from "react";

const tabs = ["인물", "월별", "지역"] as const;
type TabType = (typeof tabs)[number];

type MonthlyPhoto = {
  date: string; // "3일", "7일"...
  src: string;
};

const dummyPhotos: Record<TabType, any> = {
  인물: ["우디", "똑디", "단디", "엔디"],
  월별: {
    month: "2025년 4월",
    photos: [
      { date: "3일", src: "/photo1.jpg" },
      { date: "7일", src: "/photo2.jpg" },
      { date: "11일", src: "/photo3.jpg" },
      { date: "14일", src: "/photo4.jpg" },
      { date: "19일", src: "/photo5.jpg" },
      { date: "22일", src: "/photo6.jpg" },
      { date: "25일", src: "/photo7.jpg" },
    ] as MonthlyPhoto[],
  },
  지역: ["서울", "부산", "대구", "샌프란시스코", "일본"],
};

export default function AlbumPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("월별");

  return (
    <div className="p-4 space-y-6">
      {/* 탭 */}
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedTab === tab
                ? "bg-green-200 font-bold"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      {selectedTab === "월별" ? (
        <>
          {/* 월 선택 영역 */}
          <div className="flex justify-between items-center text-lg font-semibold">
            <button>{"<"}</button>
            <span>{dummyPhotos["월별"].month}</span>
            <button>{">"}</button>
          </div>

          {/* 날짜별 썸네일 */}
          <div className="grid grid-cols-3 gap-4">
            {dummyPhotos["월별"].photos.map((photo: MonthlyPhoto) => (
              <div
                key={photo.date}
                className="flex flex-col items-center text-sm"
              >
                <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                  {/* 이미지 대체 */}
                  <span>📷</span>
                </div>
                <p className="mt-1">{photo.date}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        // 인물 / 지역
        <div className="grid grid-cols-3 gap-4">
          {dummyPhotos[selectedTab].map((item: string) => (
            <div
              key={item}
              className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-sm font-medium"
            >
              {item}
            </div>
          ))}
        </div>
      )}

      {/* 추가 버튼 */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-green-400 text-white rounded-full text-2xl shadow-md">
        +
      </button>
    </div>
  );
}
