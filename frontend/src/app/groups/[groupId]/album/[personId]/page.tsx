"use client";

import { useParams, useSearchParams } from "next/navigation";
import { usePersonFaces } from "@/hooks/useAlbum";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Grid } from "@/components/ui-components/layout/Grid";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function PersonAlbumDetailPage() {
  const { groupId, personId } = useParams();
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "이름 없음";
  const { faces, count, loading, error } = usePersonFaces(
    Number(groupId),
    Number(personId)
  );

  return (
    <div>
      <Flex.RowBetweenCenter>
        <Typography.Heading3 className="pb-2">{name}</Typography.Heading3>
        <Typography.Label>총 {count}개의 사진</Typography.Label>
      </Flex.RowBetweenCenter>
      {loading && (
        <Flex.RowCenter className="h-180">
          <p>로딩 중...</p>
        </Flex.RowCenter>
      )}

      {!loading && !error && (
        <Grid.Col3 className="gap-1">
          {faces.map((face) => (
            <div
              key={face.face_id}
              className="w-full aspect-square overflow-hidden rounded-sm "
            >
              <img
                src={`http://localhost:8000${face.image_url}`}
                alt="얼굴"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Grid.Col3>
      )}
    </div>
  );
}
