"use client";

import { User2, LogOut, User, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserAccountNavProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    role?: string;
  };
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
          router.refresh();
        },
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none border-none bg-transparent p-0">
        <div className="flex max-w-[11rem] items-center gap-2 rounded-full border border-border/50 bg-secondary/50 px-2.5 py-1.5 transition-colors hover:bg-secondary/80 sm:max-w-none sm:px-3">
          <p className="hidden max-w-24 truncate text-xs font-medium min-[420px]:block sm:max-w-32">
            {user.name}
          </p>
          <User2 size={16} className="shrink-0 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 mt-2">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center gap-2 cursor-pointer w-full">
            <User size={16} />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {user.role === "ADMIN" && (
          <DropdownMenuItem asChild>
            <Link href="/admin" className="flex items-center gap-2 cursor-pointer w-full">
              <ShieldCheck size={16} />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
          onSelect={(e) => {
            e.preventDefault();
            handleSignOut();
          }}
        >
          <LogOut size={16} className="mr-2" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
