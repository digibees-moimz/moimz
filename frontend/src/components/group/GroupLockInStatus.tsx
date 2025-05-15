// src/components/group/GroupAccountList.tsx
"use client";

import { useGroupAccountSummary } from "@/hooks/useGroupAccountSummary";
import { Typography } from "@/components/ui-components/typography/Typography";
import { LoadingBar } from "@/components/ui-components/shared/LoadingBar";
import { Flex } from "@/components/ui-components/layout/Flex";
import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { useState } from "react";

type Props = { groupId: number };

export default function GroupLockInStatus({ groupId }: Props) {
  const [viewMode, setViewMode] = useState<"graph" | "table">("graph");
  const { data, isLoading, error } = useGroupAccountSummary(groupId);

  if (isLoading) return <LoadingBar />;

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
    <div className="">
      <Flex.RowCenter className="my-4 gap-2">
        <button
          onClick={() => setViewMode("graph")}
          className={`px-4 py-1 rounded-full text-sm border ${
            viewMode === "graph"
              ? "bg-[#22BD9C] text-white border-[#22BD9C]"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          그래프 보기
        </button>
        <button
          onClick={() => setViewMode("table")}
          className={`px-4 py-1 rounded-full text-sm border ${
            viewMode === "table"
              ? "bg-[#22BD9C] text-white border-[#22BD9C]"
              : "bg-white text-gray-600 border-gray-300"
          }`}
        >
          표로 보기
        </button>
      </Flex.RowCenter>

      <div className="relative min-h-[380px] pt-5">
        {viewMode === "graph" && (
          <div className="h-[350px] flex items-end justify-center overflow-visible">
            <ResponsiveContainer width="90%" height="100%">
              <BarChart
                data={members.map((m) => ({
                  name: m.name,
                  locked: m.locked_amount,
                }))}
              >
                <XAxis dataKey="name" tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Bar dataKey="locked" radius={[4, 4, 0, 0]}>
                  <LabelList
                    dataKey="locked"
                    position="top"
                    dy={2}
                    formatter={(value: number) =>
                      `${Math.round(value).toLocaleString()}원`
                    }
                  />
                  {members.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#22bd9b9b" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {viewMode === "table" && (
          <Flex.ColStartCenter className="w-full">
            <div className="w-full overflow-hidden rounded-lg bg-[#F9FDFD]">
              <table className="w-full text-sm text-gray-800">
                <thead className="bg-[#d9f4ec] text-left text-gray-600">
                  <tr>
                    <th className="px-4 py-2 w-12" />
                    <th className="px-4 py-2" />
                    <th className="px-4 py-2 text-right">락인 금액</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, idx) => (
                    <tr
                      key={m.user_account_id}
                      className={`border-t border-gray-100 transition ${
                        idx === members.length - 1 ? "rounded-b-xl" : ""
                      }`}
                    >
                      <td className="px-2">
                        <Image
                          src={
                            m.profile_image_url ?? "/images/default-avatar.png"
                          }
                          alt={m.name}
                          width={45}
                          height={45}
                          className="rounded-full"
                        />
                      </td>
                      <td className="p-1 py-3">
                        <Typography.BodySmall className="text-base text-gray-700 font-semibold">
                          {m.name}
                        </Typography.BodySmall>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <Typography.BodySmall className="font-bold text-gray-700">
                          {Math.round(m.locked_amount).toLocaleString()}원
                        </Typography.BodySmall>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Flex.ColStartCenter>
        )}
      </div>

      {/* 요약 */}
      <div className="p-5 mt-6 bg-[#EEFAF7] rounded-xl space-y-1 text-sm text-gray-800">
        <Typography.Body className="font-bold text-[#22BD9C]">
          모임 멤버 - {members.length}명
        </Typography.Body>

        <div className="flex justify-between p-1">
          <span>최저 락인 금액</span>
          <span>{Math.round(minLocked).toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between p-1">
          <span>총 락인 금액</span>
          <span>{Math.round(totalLocked).toLocaleString()} 원</span>
        </div>

        <div className="flex justify-between border-t mt-3 pt-2 border-gray-200 font-bold p-1">
          <span>총 결제 가능 금액</span>
          <span className="text-[#22BD9C] text-base">
            {data.available_to_spend.toLocaleString()} 원
          </span>
        </div>
      </div>
    </div>
  );
}
