# OCOP Ecommerce Frontend

Đây là dự án frontend mô phỏng sàn thương mại điện tử OCOP, phục vụ mục đích học tập và thực hành xây dựng giao diện với React. Dự án không nhằm mục đích thương mại.

Ứng dụng sử dụng dữ liệu mock để mô phỏng các luồng mua sắm như xem sản phẩm, tìm kiếm, giỏ hàng, thanh toán, đơn hàng, tài khoản người dùng, wishlist, shop, kênh người bán, khám phá vùng miền OCOP và bản đồ OCOP.

## Công nghệ

- React 19 và TypeScript
- Vite
- TanStack Router, TanStack Query, TanStack Form, TanStack Table
- Zustand
- Tailwind CSS 4 và shadcn/ui
- i18next

## Cài đặt

Yêu cầu Node.js 18 trở lên.

```bash
npm install
npm run dev
```

Sau khi chạy, mở địa chỉ Vite hiển thị trong terminal, thường là:

```txt
http://localhost:5173
```

## Lệnh thường dùng

```bash
npm run dev
npm run typecheck
npm run format:check
npm run build
```

## Ghi chú

- Dự án dùng dữ liệu mock, không có backend thật, thanh toán thật hoặc triển khai production.
- Dữ liệu giỏ hàng, đơn hàng, tài khoản mock và wishlist có thể được lưu trong localStorage.
- Đây là dự án học tập, không nhằm mục đích thương mại.
- Dự án này không phát hành kèm license.
