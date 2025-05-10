// src/components/attendance/ConfirmedAttendeeList.tsx
import { IoMdLock } from "react-icons/io";
import Image from "next/image";

export const ConfirmedAttendeeList = ({ attendees }: { attendees: any[] }) => {
  return (
    <div className="space-y-2">
      {attendees.map((person) => (
        <div
          key={person.user_id}
          className="flex items-center justify-between p-1"
        >
          <div className="flex items-center gap-3">
            <Image
              width={40}
              height={40}
              src={person.profile_image_url || "/images/default-avatar.png"}
              alt="프로필"
              className="rounded-full"
            />
            <div>
              <p className="font-bold">{person.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 font-semibold text-gray-600">
            <p>{person.locked_amount.toLocaleString()}원</p>
            <IoMdLock size={18} className="text-[#FDCD6C]" />
          </div>
        </div>
      ))}
    </div>
  );
};
