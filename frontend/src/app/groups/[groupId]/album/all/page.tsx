"use client";

import { useParams } from "next/navigation";
import { useAlbum } from "@/hooks/useAlbum";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Grid } from "@/components/ui-components/layout/Grid";
import { Flex } from "@/components/ui-components/layout/Flex";
import { PhotoCardSkeleton } from "@/components/skeleton-ui/PhotoCardSkeleton";

export default function AllPhotoPage() {
  const { groupId } = useParams();
  const { useGroupPhotos } = useAlbum();
  const {
    data: photos = [],
    isLoading,
    error,
  } = useGroupPhotos(Number(groupId));

  return (
    <div>
      <Flex.RowBetweenCenter className="pb-2">
        <Typography.Heading3>전체 사진</Typography.Heading3>
        <Typography.Label>총 {photos.length}개의 사진</Typography.Label>
      </Flex.RowBetweenCenter>

      {isLoading && (
        <Grid.Col3 className="gap-1">
          {Array.from({ length: 18 }).map((_, i) => (
            <PhotoCardSkeleton key={i} />
          ))}
        </Grid.Col3>
      )}

      {error && (
        <Flex.RowCenter className="h-180">
          <p className="text-red-500">사진을 불러오지 못했습니다.</p>
        </Flex.RowCenter>
      )}

      {!isLoading && !error && (
        <Grid.Col3 className="gap-1">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="aspect-square overflow-hidden rounded-sm"
            >
              <img
                src={`http://localhost:8000/files/${photo.file_name}`}
                alt={`사진 ${photo.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Grid.Col3>
      )}
    </div>
  );
}
