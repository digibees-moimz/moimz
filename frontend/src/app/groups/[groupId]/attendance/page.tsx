"use client";

import { useParams } from "next/navigation";
import { Typography } from "@/components/ui-components/typography/Typography";

export default function AttendancePage() {
  const { groupId } = useParams();
  const groupIdNumber = Number(groupId);

  if (isNaN(groupIdNumber)) {
    return <Typography.Body>잘못된 그룹 ID입니다.</Typography.Body>;
  }

  return (
    <div className="p-4">
      <Typography.Heading3>출석 체크</Typography.Heading3>
      {/* 출석 관련 컴포넌트 추가 예정 */}
    </div>
  );
}
