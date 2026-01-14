import { EditIcon, LogOut, Plus, Search } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function SidebarLeft() {
  return (
    <Sidebar className="border-r-0">
      <SidebarHeader>
        <div className="flex gap-2 align-middle my-2">
          <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center">
            <img src="/icon.svg" alt="Logo" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Discourse Inc</span>
            <span className="truncate text-xs">Team communications</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="py-1">
          <SidebarGroupContent className="flex gap-1 justify-between">
            <div className="relative w-full">
              <SidebarInput placeholder="Search chats..." className="pl-8" />
              <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50" />
            </div>
            <Button variant="outline" size="icon-sm">
              <Plus className="size-4" />
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="gap-1">
                  <span className="truncate">
                    <img src="/star.svg" alt="owner" />
                  </span>
                  <span className="truncate">Example</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover>
                  <EditIcon className="size-4" />
                </SidebarMenuAction>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between items-center p-1 py-1.5">
          <div className="flex gap-2 items-center min-w-0">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="" alt="" />
              <AvatarFallback className="rounded-lg">LK</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight truncate">
              <span className="truncate font-medium">Luka Krstev</span>
              <span className="truncate text-xs opacity-70">
                arrianaire@gmail.com
              </span>
            </div>
          </div>
          <Button size="icon-sm" variant="outline">
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
