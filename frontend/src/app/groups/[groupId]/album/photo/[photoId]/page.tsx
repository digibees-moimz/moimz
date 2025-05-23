"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useAlbum } from "@/hooks/useAlbum";
import { Flex } from "@/components/ui-components/layout/Flex";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";

export default function PhotoDetailPage() {
  const { groupId, photoId } = useParams();
  const searchParams = useSearchParams();
  const from = searchParams.get("from"); // "person" 또는 null
  const name = searchParams.get("name") ?? "";

  const router = useRouter();
  const groupIdNum = Number(groupId);
  const photoIdNum = Number(photoId);

  const personId = Number(searchParams.get("personId"));
  const isFromPerson = from === "person";

  const { usePhotoDetail, useGroupPhotos, usePersonFaces } = useAlbum();
  const { faces: personPhotos, loading: loadingPerson } = usePersonFaces(
    groupIdNum,
    personId
  );
  const { data: allPhotos = [], isLoading: loadingAll } =
    useGroupPhotos(groupIdNum);
  const { data: photo, isLoading, error } = usePhotoDetail(photoIdNum);

  // 현재 사용될 사진 목록
  type ThumbnailItem = {
    id: number;
    imageUrl: string;
  };

  const photoList: ThumbnailItem[] = isFromPerson
    ? personPhotos.map((f) => ({
        id: f.photo_id,
        imageUrl: `http://localhost:8000${f.image_url}`,
      }))
    : allPhotos.map((p) => ({
        id: p.id,
        imageUrl: `http://localhost:8000/files/${p.file_name}`,
      }));

  // 현재 index 계산
  const currentIndex = photoList.findIndex((p) => p.id === photoIdNum);
  const prevPhoto = photoList[currentIndex - 1];
  const nextPhoto = photoList[currentIndex + 1];

  const goToPhoto = (id: number) => {
    if (isFromPerson) {
      router.push(
        `/groups/${groupId}/album/photo/${id}?from=person&personId=${personId}&name=${encodeURIComponent(
          name
        )}`
      );
    } else {
      router.push(`/groups/${groupId}/album/photo/${id}`);
    }
  };

  return (
    <Flex.ColStartCenter>
      {/* 메인 이미지 영역 */}
      {isLoading ? (
        <LoadingBar />
      ) : error || !photo ? (
        <Flex.RowCenter className="h-180 text-red-500">
          사진 불러오기 실패
        </Flex.RowCenter>
      ) : (
        <>
          <div className="relative max-w-3xl w-full shadow rounded overflow-hidden">
            {/* 오버레이된 날짜 텍스트 */}
            <div className="absolute w-full h-[60px] bg-black/70 text-white px-3 py-1 rounded z-10 text-center font-bold">
              {name ? (
                <>
                  <p className="mt-1">{name}</p>
                  <p className="text-sm">
                    {new Date(photo.uploaded_at).toLocaleString()}
                  </p>
                </>
              ) : (
                <p className="mt-4">
                  {new Date(photo.uploaded_at).toLocaleString()}
                </p>
              )}
            </div>

            {/* 이미지 */}
            <img
              src={`http://localhost:8000/files/${photo.file_name}`}
              alt="상세 이미지"
              className="w-full h-[720px] object-contain bg-black"
            />
            {/* 좌우 이동 */}
            {prevPhoto && (
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 text-white text-3xl"
                onClick={() => goToPhoto(prevPhoto.id)}
              >
                ‹
              </button>
            )}
            {nextPhoto && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-3xl"
                onClick={() => goToPhoto(nextPhoto.id)}
              >
                ›
              </button>
            )}
          </div>
        </>
      )}

      {/* 썸네일 슬라이드 영역 */}
      {(isFromPerson ? !loadingPerson : !loadingAll) && (
        <div className="overflow-x-auto w-full max-w-3xl py-2 whitespace-nowrap scrollbar-hide">
          {photoList.map((p) => (
            <button
              key={p.id}
              onClick={() => goToPhoto(p.id)}
              className={`inline-block w-15 h-15 rounded-md overflow-hidden border-2 ${
                p.id === photoIdNum ? "border-blue-500" : "border-transparent"
              }`}
            >
              <img
                src={p.imageUrl}
                alt="썸네일"
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </Flex.ColStartCenter>
  );
}
