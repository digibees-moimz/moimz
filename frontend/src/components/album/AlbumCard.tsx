import Link from "next/link";

interface AlbumCardProps {
  group_id: number;
  tab: "인물" | "일정" | "지역";
  data: any; // 아래에서 안전하게 추론함
}
export const AlbumCard: React.FC<AlbumCardProps> = ({
  group_id,
  tab,
  data,
}) => {
  if (tab === "인물") {
    const { person_id, name, thumbnail_url, count } = data;
    return (
      <Link
        href={`/groups/${group_id}/album/${person_id}?name=${encodeURIComponent(
          name
        )}`}
      >
        <div className="cursor-pointer">
          <div className="bg-white h-25 rounded-xl shadow-md overflow-hidden">
            <div className="w-full h-25 relative">
              <img
                alt={name}
                className="mb-2 w-full h-34 object-cover object-top"
                src={`http://localhost:8000${thumbnail_url}`}
              />
            </div>
          </div>
          <div className="p-1 leading-tight">
            {name ? (
              <h3 className="text-sm font-bold text-gray-900">{name}</h3>
            ) : (
              <h3 className="text-sm font-bold text-gray-400">이름 없음</h3>
            )}
            <p className="text-xs text-gray-400 leading-tight">{count}</p>
          </div>
        </div>
      </Link>
    );
  }

  // TODO: tab === "일정" | "지역"일 때 UI 구성
  return <div className="text-gray-400">아직 미지원 탭: {tab}</div>;
};
