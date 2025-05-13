"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Typography } from "@/components/ui-components/typography/Typography";
import { AlbumCardSkeleton } from "@/components/skeleton-ui/AlbumCardSkeleton";
import { FilterToggleGroup } from "@/components/album/FilterToggleGroup";
import { AddUploadButton } from "@/components/album/AddUploadButton";
import { GenericAlbum } from "@/components/album/GenericAlbum";
import { AllAlbum } from "@/components/album/AllAlbum";
import { useAlbum } from "@/hooks/useAlbum";

const tabs = ["인물", "일정", "지역"] as const;
type TabType = (typeof tabs)[number];

export default function AlbumPage() {
  const { groupId } = useParams();
  const { userId } = useUserStore();
  const [selectedTab, setSelectedTab] = useState<TabType>("인물");

  const { useAlbumSummary } = useAlbum();
  const { data: summary, isLoading: summaryLoading } = useAlbumSummary(
    Number(groupId)
  );

  return (
    <>
      <Typography.Heading3>모임 앨범</Typography.Heading3>

      {/* 전체 앨범 카드 */}
      <div className="w-32 min-h-[8rem]">
        {summaryLoading ? (
          <AlbumCardSkeleton />
        ) : summary ? (
          <AllAlbum summary={summary} groupId={Number(groupId)} />
        ) : null}
      </div>

      {/* 탭 */}
      <div className="sticky top-0 z-20 bg-white py-2">
        <FilterToggleGroup
          options={tabs}
          selected={selectedTab}
          onChange={(val) => setSelectedTab(val)}
        />
      </div>

      <GenericAlbum tab={selectedTab} groupId={Number(groupId)} />

      {/* 추가 버튼 */}
      <AddUploadButton groupId={Number(groupId)} userId={userId} />
    </>
  );
}
