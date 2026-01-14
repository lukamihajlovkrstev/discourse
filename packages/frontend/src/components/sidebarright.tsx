import { PanelRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';

export function SidebarRight() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="mr-2">
          <PanelRight className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <div className="p-4">Right Sidebar Content</div>
      </SheetContent>
    </Sheet>
  );
}
