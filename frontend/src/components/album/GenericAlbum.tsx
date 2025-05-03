import { usePersons } from "@/hooks/useAlbum";
import { AlbumCard } from "./AlbumCard";
import { Grid } from "../ui-components/layout/Grid";

export function PersonAlbum({ groupId }: { groupId: number }) {
  const { persons, loading } = usePersons(groupId);

  if (loading) return <div>로딩 중...</div>;
  if (!persons.length) return <div>인물이 없습니다.</div>;

  return (
    <Grid.Col3>
      {persons.map((person) => (
        <AlbumCard key={person.person_id} {...person} group_id={groupId} />
      ))}
    </Grid.Col3>
  );
}

// import { usePersons, useAlbumData } from "@/hooks/useAlbum";
// // import { useEvents } from "@/hooks/useEvents";
// // import { usePlaces } from "@/hooks/usePlaces";
// import { AlbumCard } from "./AlbumCard";

// type TabType = "인물" | "일정" | "지역";

// interface Props {
//   tab: TabType;
//   groupId: number;
// }

// export function GenericAlbum({ tab, groupId }: Props) {
//   const { data, loading } = useAlbumData(tab, groupId); // 아래 커스텀 훅으로 통합 fetch 처리

//   if (loading) return <div>로딩 중...</div>;
//   if (!data.length) return <div>데이터 없음</div>;

//   return (
//     <div className="grid gap-2">
//       {data.map((item) => (
//         <AlbumCard key={item.id || item.person_id} data={item} tab={tab} />
//       ))}
//     </div>
//   );
// }
