import Link from "next/link";
import { AlbumSummary } from "@/types/album";

export const AllAlbum = ({
  summary,
  groupId,
}: {
  summary: AlbumSummary;
  groupId: number;
}) => {
  return (
    <Link href={`/groups/${groupId}/album/all`}>
      <div className="w-32">
        <img
          src={
            `http://localhost:8000${summary.thumbnail_url}` ||
            "/images/default-thumbnail.png"
          }
          alt="전체 사진 썸네일"
          className="rounded-xl aspect-square object-cover"
        />
        <div className="p-1 leading-tight">
          <h3 className="text-sm font-bold text-gray-900">{summary.title}</h3>
          <p className="text-xs text-gray-400 leading-tight">{summary.count}</p>
        </div>
      </div>
    </Link>
  );
};
