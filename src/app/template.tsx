export default function DashboardTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-fadeIn">{children}</div>;
}
