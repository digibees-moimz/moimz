// src/app/groups/[groupId]/page.tsx

interface Props {
  params: { groupId: string };
}

export default function GroupOverviewPage({ params }: Props) {
  const { groupId } = params;

  return (
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold">그룹 {groupId} 개요</h1>
        <div className="bg-gray-100 p-4 rounded">
          <p>이곳에 그룹 정보를 표시할 예정입니다.</p>
          <p>예: 그룹 이름, 총 회비, 내 회비, 다음 일정 등</p>
        </div>
      </div>
  );
}
