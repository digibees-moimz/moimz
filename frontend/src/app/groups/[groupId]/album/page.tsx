"use client";

import { Flex } from "@/components/ui-components/layout/Flex";
import { Grid } from "@/components/ui-components/layout/Grid";
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
    <>
      {/* 탭 */}
      <Flex.RowStartCenter className="gap-2">
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
      </Flex.RowStartCenter>

      {/* 콘텐츠 */}
      {selectedTab === "월별" ? (
        <>
          {/* 월 선택 영역 */}
          <Flex.RowCenter className="text-lg font-semibold gap-8">
            <button>{"<"}</button>
            <span>{dummyPhotos["월별"].month}</span>
            <button>{">"}</button>
          </Flex.RowCenter>

          {/* 날짜별 썸네일 */}
          <Grid.Col3>
            {dummyPhotos["월별"].photos.map((photo: MonthlyPhoto) => (
              <Flex.ColCenter key={photo.date} className="text-sm">
                <Flex.RowCenter className="w-full aspect-square bg-gray-200 rounded-lg">
                  {/* 이미지 대체 */}
                  <span>📷</span>
                </Flex.RowCenter>
                <p className="mt-1">{photo.date}</p>
              </Flex.ColCenter>
            ))}
          </Grid.Col3>
        </>
      ) : (
        // 인물 / 지역
        <Grid.Col3>
          {dummyPhotos[selectedTab].map((item: string) => (
            <Flex.ColCenter
              key={item}
              className="aspect-square bg-gray-200 rounded-lg text-sm font-medium"
            >
              {item}
            </Flex.ColCenter>
          ))}
        </Grid.Col3>
      )}

      {/* 추가 버튼 */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-green-400 text-white rounded-full text-2xl shadow-md">
        +
      </button>
    </>
  );
}
