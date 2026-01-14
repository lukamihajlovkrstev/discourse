import { SidebarLeft } from '@/components/sidebarleft';
import { SidebarRight } from '@/components/sidebarright';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { PanelRight } from 'lucide-react';

export const Route = createFileRoute('/_protected/chats')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <SidebarLeft />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
          <SidebarRight />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
