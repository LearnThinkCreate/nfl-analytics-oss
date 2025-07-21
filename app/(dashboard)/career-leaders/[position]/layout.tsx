import { LayoutWrapper } from "@/app/(dashboard)/components/layout-wrapper";

export default function CareerLeadersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutWrapper season={false}>
      {children}
    </LayoutWrapper>
  );
}
