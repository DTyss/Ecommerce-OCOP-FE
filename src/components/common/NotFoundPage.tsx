import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-primary text-6xl font-extrabold">404</p>
      <h1 className="text-foreground text-xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-muted-foreground max-w-md text-sm">Trang bạn tìm không tồn tại hoặc đã được di chuyển.</p>
      <Link
        to="/"
        className="bg-primary text-primary-foreground rounded-md px-5 py-2.5 text-sm font-medium transition-colors hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
