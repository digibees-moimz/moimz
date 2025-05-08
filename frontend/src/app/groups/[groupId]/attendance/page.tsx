"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useAttendanceStore } from "@/stores/useAttendanceStore";
import { useParams, useRouter } from "next/navigation";
import { Typography } from "@/components/ui-components/typography/Typography";
import { Flex } from "@/components/ui-components/layout/Flex";
import { navigateWithScrollTop } from "@/utils/navigation";
import { Button } from "@/components/ui-components/ui/Button";

export default function AttendancePage() {
  const router = useRouter();
  const { groupId } = useParams();
  const groupIdNumber = Number(groupId);

  const { attendanceId, groupId: storedGroupId } = useAttendanceStore();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (
      attendanceId &&
      storedGroupId === groupIdNumber &&
      !isNaN(groupIdNumber)
    ) {
      setShowModal(true); // useAttendanceStore에 값 있으면 모달 띄우기
    } else {
      setShowModal(false); // 없으면 초기화
    }
  }, [attendanceId, storedGroupId, groupIdNumber]);

  const handleGoToResult = () => {
    router.push(`/groups/${groupId}/attendance/result/${attendanceId}`);
  };

  if (isNaN(groupIdNumber)) {
    return <Typography.Body>잘못된 그룹 ID입니다.</Typography.Body>;
  }

  return (
    <>
      {showModal && (
        <div className="fixed w-full h-screen inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full">
            <Typography.Heading4 className="mb-2">
              이미 출석했어요
            </Typography.Heading4>
            <Typography.Body className="text-gray-700 mb-4">
              이전에 출석한 내역이 있어요.
              <br />
              결과 페이지로 이동할까요?
            </Typography.Body>
            <div className="flex justify-end gap-2">
              <Button onClick={handleGoToResult}>결과 보기</Button>
              <Button variant="destructive" onClick={() => setShowModal(false)}>
                아니요
              </Button>
            </div>
          </div>
        </div>
      )}

      <Typography.Heading3>출석체크</Typography.Heading3>
      <Flex.ColCenter className="gap-5">
        <Image
          src="/icons/together.png"
          alt="단디 똑디 우디"
          width={320}
          height={100}
        />
        <Flex.ColCenter>
          <Typography.BodySmall>
            출석만 하면 똑똑하게 정산 끝!
          </Typography.BodySmall>
          <Typography.Caption>
            사진 또는 수동으로 출석체크만 하면
          </Typography.Caption>
          <Typography.Caption>
            출석한 멤버끼리 모임비가 자동으로 N등분 결제해드려요!
          </Typography.Caption>
        </Flex.ColCenter>

        {/* 사진 기반 출석체크 */}
        <button
          className="bg-[#E5EFFE] w-full p-3 rounded-lg hover:bg-[#d1e1f9] mt-7 cursor-pointer"
          onClick={() =>
            navigateWithScrollTop(router, `/groups/${groupId}/attendance/photo`)
          }
        >
          <Flex.RowStartCenter className="gap-6">
            <Image
              src="/icons/photo.png"
              alt="사진 아이콘"
              width={75}
              height={75}
            />
            <Flex.ColStartStart>
              <Typography.Heading5 className="pb-1">
                사진 출석체크
              </Typography.Heading5>
              <>
                <Typography.Caption as="p">
                  얼굴을 인식해 자동으로 출석 완료!
                </Typography.Caption>
                <Typography.Caption as="p">
                  출석도 하고, 소중한 순간도 함께 남겨요.
                </Typography.Caption>
              </>
            </Flex.ColStartStart>
          </Flex.RowStartCenter>
        </button>

        {/* 위치 기반 출석체크 */}
        <button
          className="bg-[#FFF3F6] w-full p-3 rounded-lg hover:bg-[#f6e2e0] cursor-pointer"
          onClick={() =>
            navigateWithScrollTop(
              router,
              `/groups/${groupId}/attendance/location`
            )
          }
        >
          <Flex.RowStartCenter className="gap-6">
            <Image
              src="/icons/location.png"
              alt="지도 아이콘"
              width={75}
              height={75}
            />
            <Flex.ColStartStart>
              <Typography.Heading5 className="pb-1">
                위치 출석체크
              </Typography.Heading5>
              <>
                <Typography.Caption as="p">
                  한 명만 눌러도 근처 멤버 모두 출석 완료!
                </Typography.Caption>
                <Typography.Caption as="p">
                  빠르게 출석을 끝내보세요.
                </Typography.Caption>
              </>
            </Flex.ColStartStart>
          </Flex.RowStartCenter>
        </button>

        {/* 수동 출석체크 */}
        <button
          className="bg-[#F4FBCF] w-full p-4 rounded-lg hover:bg-[#EEF6C2] cursor-pointer"
          onClick={() =>
            navigateWithScrollTop(
              router,
              `/groups/${groupId}/attendance/manual`
            )
          }
        >
          <Flex.RowStartCenter className="gap-6">
            <Image
              src="/icons/manual.png"
              alt="체크 아이콘"
              width={65}
              height={65}
            />
            <Flex.ColStartStart>
              <Typography.Heading5 className="pb-1">
                수동 출석체크
              </Typography.Heading5>
              <>
                <Typography.Caption>
                  이름만 선택하면 바로 출석 완료!
                </Typography.Caption>

                <Typography.Caption as="p">
                  사진 찍기 어려울 때 간편하게 사용하세요.
                </Typography.Caption>
              </>
            </Flex.ColStartStart>
          </Flex.RowStartCenter>
        </button>
      </Flex.ColCenter>
    </>
  );
}
