import { Users } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { Button } from './ui/button';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { AvatarFallback } from './ui/avatar';

export function SidebarRight() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="mr-2">
          <Users className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Members</SheetTitle>
        </SheetHeader>
        <div className="px-4 flex flex-col">
          <div className="pl-0.5 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium">
            Online (3)
          </div>
          <div className="flex flex-col gap-4">
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
          </div>
        </div>
        <div className="px-4 pt-8 flex flex-col">
          <div className="pl-0.5 text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md text-xs font-medium">
            Offline (3)
          </div>
          <div className="flex flex-col gap-4">
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
