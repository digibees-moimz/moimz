import { useAlbumData } from "@/hooks/useAlbum";
import { AlbumCard } from "./AlbumCard";
import { Grid } from "../ui-components/layout/Grid";

type TabType = "인물" | "일정" | "지역";

interface Props {
  tab: TabType;
  groupId: number;
}

export function GenericAlbum({ tab, groupId }: Props) {
  const { data, loading } = useAlbumData(tab, groupId);

  if (loading) return <div>로딩 중...</div>;
  if (!data.length) return <div>데이터 없음</div>;

  return (
    <Grid.Col3>
      {data.map((item) => (
        <AlbumCard
          key={item.person_id} // TODO: 탭에 따라 id 결정
          data={item}
          tab={tab}
          group_id={groupId}
        />
      ))}
    </Grid.Col3>
  );
}
