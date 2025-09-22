"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
} from "lucide-react";

export function RoleBasedHeader() {
  const { user } = useAuth();
  const router = useRouter();


  return (
    <header className="bg-background border-b sticky top-0 z-50">
      <div className="md:max-w-[80dvw] max-w-[90dvw] mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">Marino Portal</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/chat")}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Messages
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
