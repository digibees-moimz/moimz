import Link from "next/link";
import { Typography } from "@/components/ui-components/typography/Typography";

interface Props {
  groupId: number;
  diaryId?: number | null; // diaryId가 없을 수도 있으니 optional로
}

export default function DiaryLink({ groupId, diaryId }: Props) {
  if (!diaryId) return null;

  return (
    <Link href={`/groups/${groupId}/diary/${diaryId}`}>
      <Typography.BodySmall className="text-blue-500 hover:underline cursor-pointer">
        모임일기
      </Typography.BodySmall>
    </Link>
  );
}
