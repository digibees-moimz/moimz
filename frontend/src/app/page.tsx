// src/app/page.tsx

import { Typography } from "@/components/ui-components/typography/Typography";
import GroupList from "@/components/group/GroupList";

export default function HomePage() {
  return (
    <>
      <Typography.Heading3 className="m-2">내 모임통장</Typography.Heading3>
      <GroupList />
    </>
  );
}
