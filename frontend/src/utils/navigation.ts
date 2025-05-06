import { useRouter } from "next/navigation";

// 지정된 경로로 이동하고, 스크롤을 최상단으로 이동
// @param router next/router 인스턴스
// @param path 이동할 경로 (ex. `/groups/1/attendance`)
export const navigateWithScrollTop = (
  router: ReturnType<typeof useRouter>,
  path: string
) => {
  router.push(path);
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// 페이지 이동 시 스크롤을 상단으로 고정
export const scrollToTop = () => {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
