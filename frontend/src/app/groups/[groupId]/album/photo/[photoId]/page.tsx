"use client";

import { useParams, useRouter } from "next/navigation";
import { useAlbum } from "@/hooks/useAlbum";
import { Flex } from "@/components/ui-components/layout/Flex";

export default function PhotoDetailPage() {
  const { groupId, photoId } = useParams();
  const router = useRouter();
  const groupIdNum = Number(groupId);
  const photoIdNum = Number(photoId);

  const { useGroupPhotos, usePhotoDetail } = useAlbum();
  const { data: allPhotos = [], isLoading: loadingAll } =
    useGroupPhotos(groupIdNum);
  const { data: photo, isLoading, error } = usePhotoDetail(photoIdNum);

  // 현재 index 계산
  const currentIndex = allPhotos.findIndex((p) => p.id === photoIdNum);
  const prevPhoto = allPhotos[currentIndex - 1];
  const nextPhoto = allPhotos[currentIndex + 1];

  const goToPhoto = (id: number) => {
    router.push(`/groups/${groupId}/album/photo/${id}`);
  };

  return (
    <Flex.ColStartCenter>
      {/* 메인 이미지 영역 */}
      {isLoading ? (
        <Flex.RowCenter className="h-180">로딩 중...</Flex.RowCenter>
      ) : error || !photo ? (
        <Flex.RowCenter className="h-180 text-red-500">
          사진 불러오기 실패
        </Flex.RowCenter>
      ) : (
        <>
          <div className="relative max-w-3xl w-full shadow rounded overflow-hidden">
            {/* 오버레이된 날짜 텍스트 */}
            <div className="absolute w-full h-[60px] bg-black/70 text-white px-3 py-1 rounded z-10">
            <p className="text-center mt-4 font-bold">
              {new Date(photo.uploaded_at).toLocaleString()}
            </p>
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
      <div className="overflow-x-auto w-full max-w-3xl py-2 whitespace-nowrap scrollbar-hide">
        {loadingAll
          ? "사진 목록 불러오는 중..."
          : allPhotos.map((p) => (
              <button
                key={p.id}
                onClick={() => goToPhoto(p.id)}
                className={`inline-block w-15 h-15 rounded-md overflow-hidden border-2 ${
                  p.id === photoIdNum ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img
                  src={`http://localhost:8000/files/${p.file_name}`}
                  alt="썸네일"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
      </div>
    </Flex.ColStartCenter>
  );
}
