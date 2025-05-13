"use client";

import { useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAlbum } from "@/hooks/useAlbum";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Grid } from "@/components/ui-components/layout/Grid";
import { Flex } from "@/components/ui-components/layout/Flex";
import { FiEdit2 } from "react-icons/fi";

export default function PersonAlbumDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const groupId = Number(params.groupId);
  const personId = Number(params.personId);
  const defaultName = searchParams.get("name") ?? "이름 없음";

  const { usePersonFaces, useUpdatePersonName } = useAlbum();
  const { faces, count, loading, error } = usePersonFaces(groupId, personId);
  const { mutateAsync: update } = useUpdatePersonName();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(defaultName);
  const [inputValue, setInputValue] = useState(defaultName);

  const handleSave = async () => {
    const trimmed = inputValue.trim();

    if (!trimmed || trimmed === name) {
      setEditing(false);
      return;
    }

    const res = await update({
      group_id: groupId,
      person_id: personId,
      new_name: trimmed,
    });

    if (res) {
      setName(res.name);
    }
    setEditing(false);
  };

  return (
    <div>
      <Flex.RowBetweenCenter>
        <div className="flex items-center gap-2 pb-2">
          {editing ? (
            <input
              className="text-xl font-bold border-b border-gray-300 focus:outline-none"
              value={inputValue}
              autoFocus
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
              }}
            />
          ) : (
            <button
              onClick={() => {
                setInputValue(name);
                setEditing(true);
              }}
            >
              <Flex.RowCenter className="gap-3">
                <Typography.Heading3>{name}</Typography.Heading3>
                <FiEdit2 size={15} color="#adadad" />
              </Flex.RowCenter>
            </button>
          )}
        </div>
        <Typography.Label>총 {count}개의 사진</Typography.Label>
      </Flex.RowBetweenCenter>

      {loading && (
        <Flex.RowCenter className="h-180">
          <p>로딩 중...</p>
        </Flex.RowCenter>
      )}

      {error && (
        <Flex.RowCenter className="h-180">
          <p className="text-red-500">데이터를 불러오는 데 실패했습니다.</p>
        </Flex.RowCenter>
      )}

      {!loading && !error && (
        <Grid.Col3 className="gap-1">
          {faces.map((face) => (
            <div
              key={face.face_id}
              className="aspect-square overflow-hidden rounded-sm"
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
