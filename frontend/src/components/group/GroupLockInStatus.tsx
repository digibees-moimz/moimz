// src/components/group/GroupAccountList.tsx
"use client";

import { useGroupAccountSummary } from "@/hooks/useGroupAccountSummary";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import Image from "next/image";

type Props = { groupId: number };

export default function GroupLockInStatus({ groupId }: Props) {
  const { data, isLoading, error } = useGroupAccountSummary(groupId);

  if (isLoading)
    return (
      <Typography.BodySmall className="text-center py-6 text-gray-500">
        불러오는 중...
      </Typography.BodySmall>
    );

  if (error || !data)
    return (
      <Typography.BodySmall className="text-center py-6 text-red-500">
        모임 통장 정보를 가져오지 못했어요.
      </Typography.BodySmall>
    );

  const { members } = data;
  const minLocked = Math.min(...members.map((m) => m.locked_amount));
  const totalLocked = members.reduce((sum, m) => sum + m.locked_amount, 0);

  return (
    <Flex.ColStartCenter className="w-full gap-4">
      {/* 멤버 리스트 */}
      <div className="rounded-xl overflow-hidden bg-[#EEFAF7] w-full">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-[#d9f4ec]">
            <tr>
              <th className="p-2 text-left w-10" />
              <th className="p-2 text-left">
                <Typography.Caption>이름</Typography.Caption>
              </th>
              <th className="p-2 text-right">
                <Typography.Caption>락인 금액</Typography.Caption>
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.user_account_id} className="border-b last:border-none">
                <td className="p-2">
                  <Image
                    src={m.profile_image_url ?? "/images/default-avatar.png"}
                    alt={m.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </td>
                <td className="p-2">
                  <Typography.BodySmall>{m.name}</Typography.BodySmall>
                </td>
                <td className="p-2 text-right">
                  <Typography.BodySmall>
                    {m.locked_amount.toLocaleString()}원
                  </Typography.BodySmall>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 요약 박스 */}
      <div className="bg-white border rounded-xl p-4 space-y-1 text-sm w-full">
        <Typography.Body>
          총 인원 <b>{members.length}명</b>
        </Typography.Body>
        <Typography.Body>
          총 락인 금액 <b>{totalLocked.toLocaleString()}원</b>
        </Typography.Body>
        <Typography.Body>
          최저 락인 금액 <b>{minLocked.toLocaleString()}원</b>
        </Typography.Body>
        <Typography.Body>
          결제 가능 금액 <b>{data.available_to_spend.toLocaleString()}원</b>
        </Typography.Body>
      </div>
    </Flex.ColStartCenter>
  );
}
