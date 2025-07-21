import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  // SidebarMenuButton,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { SeasonSlider } from "@/components/slider/dashboard-slider";
import { SiteHeader } from "@/components/site-header";
import Nav from "./nav";

export const LayoutWrapper = ({
  season,
  children,
}: {
  season: boolean;
  children: React.ReactNode;
}) => {
  const PageWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-1">{children}</div>
  );

  if (!season)
    return (
      <>
        <SiteHeader>
          <Nav className="hidden md:block" href="/career-leaders" />
        </SiteHeader>
        <PageWrapper>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </PageWrapper>
      </>
    );

  return (
    <>
      <SiteHeader>
        <Nav className="hidden md:block" />
      </SiteHeader>
      <PageWrapper>
        <AppSidebar>
          <SidebarGroup>
            <SidebarGroupLabel className="mb-2">Filters</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SeasonSlider />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </AppSidebar>
        <SidebarInset>{children}</SidebarInset>
      </PageWrapper>
    </>
  );
};
