"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Typography } from "@/components/ui-components/typography/Typography";
import { FilterToggleGroup } from "@/components/album/FilterToggleGroup";
import { AddUploadButton } from "@/components/album/AddUploadButton";
import { GenericAlbum } from "@/components/album/GenericAlbum";

const tabs = ["인물", "일정", "지역"] as const;
type TabType = (typeof tabs)[number];

export default function AlbumPage() {
  const { groupId } = useParams();
  const { userId } = useUserStore();
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

      <GenericAlbum tab={selectedTab} groupId={Number(groupId)} />

      {/* 추가 버튼 */}
      <AddUploadButton groupId={Number(groupId)} userId={userId} />
    </>
  );
}
