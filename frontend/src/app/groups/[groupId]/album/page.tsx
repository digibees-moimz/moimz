"use client";

import { FilterToggleGroup } from "@/components/album/FilterToggleGroup";
import { AddButton } from "@/components/album/AddButton";
import { useState } from "react";
import { Typography } from "@/components/ui-components/typography/Typography";

const tabs = ["인물", "일정", "지역"] as const;
type TabType = (typeof tabs)[number];

export default function AlbumPage() {
  const [selectedTab, setSelectedTab] = useState<TabType>("인물");

  return (
    <>
      <Typography.Heading3>모임 앨범</Typography.Heading3>
      {/* 탭 */}
      <FilterToggleGroup
        options={tabs}
        selected={selectedTab}
        onChange={(val) => setSelectedTab(val)}
      />

      {/* 추가 버튼 */}
      <AddButton />
    </>
  );
}
