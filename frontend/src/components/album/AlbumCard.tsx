import Link from "next/link";

interface AlbumCardProps {
  group_id: number;
  person_id: number;
  name: string;
  thumbnail_url: string;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  group_id,
  person_id,
  name,
  thumbnail_url,
}) => {
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

          {<p className="text-xs text-gray-400 leading-tight">count</p>}
        </div>
      </div>
    </Link>
  );
};
