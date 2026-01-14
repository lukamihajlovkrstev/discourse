import { Sidebar, SidebarContent, SidebarHeader } from './ui/sidebar';

export function SidebarLeft() {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader>
        <div>Header</div>
      </SidebarHeader>
      <SidebarContent>Content</SidebarContent>
    </Sidebar>
  );
}
