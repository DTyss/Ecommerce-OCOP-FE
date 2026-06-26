import type { Address, User } from "@/features/account/types/account";

export const MOCK_USERS: User[] = [
  {
    id: "u01",
    fullName: "Nguyễn Văn An",
    email: "an@example.com",
    phone: "0901234567",
    avatar: null,
    joinedDate: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "u02",
    fullName: "Trần Thị Bình",
    email: "binh@example.com",
    phone: "0912345678",
    avatar: null,
    joinedDate: "2024-03-20T00:00:00.000Z",
  },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr01",
    userId: "u01",
    label: "Nhà riêng",
    fullName: "Nguyễn Văn An",
    phone: "0901234567",
    province: "Hà Nội",
    district: "Cầu Giấy",
    ward: "Nghĩa Tân",
    addressDetail: "12 Nguyễn Khang",
    isDefault: true,
  },
  {
    id: "addr02",
    userId: "u01",
    label: "Văn phòng",
    fullName: "Nguyễn Văn An",
    phone: "0901234567",
    province: "Hà Nội",
    district: "Đống Đa",
    ward: "Láng Hạ",
    addressDetail: "45 Huỳnh Thúc Kháng",
    isDefault: false,
  },
  {
    id: "addr03",
    userId: "u02",
    label: "Nhà riêng",
    fullName: "Trần Thị Bình",
    phone: "0912345678",
    province: "Thành phố Hồ Chí Minh",
    district: "Quận 3",
    ward: "Phường Võ Thị Sáu",
    addressDetail: "28 Pasteur",
    isDefault: true,
  },
];
