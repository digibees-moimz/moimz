import { useAlbumData } from "@/hooks/useAlbum";
import { AlbumCard } from "./AlbumCard";
import { Grid } from "@/components/ui-components/layout/Grid";
import { AlbumCardSkeleton } from "@/components/skeleton-ui/AlbumCardSkeleton";

type TabType = "인물" | "일정" | "지역";

interface Props {
  tab: TabType;
  groupId: number;
}

export function GenericAlbum({ tab, groupId }: Props) {
  const { data, loading } = useAlbumData(tab, groupId);

  if (loading) {
    return (
      <Grid.Col3 className="gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <AlbumCardSkeleton key={i} />
        ))}
      </Grid.Col3>
    );
  }

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
