// src/app/groups/[groupId]/community/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "모임통장 커뮤니티",
};

interface Props {
  params: { groupId: string };
}

export default async function CommunityPage({ params }: Props) {
  const { groupId } = params;

  // SSR 예시용 더미 데이터
  const posts = [
    { id: 1, title: "첫 번째 게시글", content: "테스트 용도입니다." },
    { id: 2, title: "두 번째 게시글", content: "더미 데이터입니다." },
  ];

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">그룹 {groupId} • 커뮤니티</h1>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.id} className="p-3 bg-gray-100 rounded">
            <h2 className="font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-600">{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
