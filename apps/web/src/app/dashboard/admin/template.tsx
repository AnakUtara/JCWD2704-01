import AdminMainNav from "./_component/admin.main-nav";

type Props = { children: React.ReactNode };
export default function AdminDashboardTemplate({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AdminMainNav />
      <main className="container">{children}</main>
    </div>
  );
}
