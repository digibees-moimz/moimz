import { Flex } from "@/components/ui-components/layout/Flex";
import { Typography } from "@/components/ui-components/typography/Typography";
import Link from "next/link";

export default function MyPage() {
  return (
    <>
      <Typography.Heading3>마이페이지</Typography.Heading3>
      <div>
        <Link href="/my/face-register">
          <button className="bg-[#7DB5FF] hover:bg-blue-500 text-white px-4 py-2 rounded-lg">
            얼굴 등록하기
          </button>
        </Link>
      </div>
    </>
  );
}
