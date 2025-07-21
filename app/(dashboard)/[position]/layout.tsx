import { LayoutWrapper } from "@/app/(dashboard)/components/layout-wrapper";

export default function PositionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper season={true}>
      {children}
    </LayoutWrapper>
  );
}
