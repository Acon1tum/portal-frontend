"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function BarGraphSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-64 mt-2" />
          </CardDescription>
        </div>
        <div className="flex">
          {/* Desktop stats placeholder */}
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-24 mt-1" />
          </div>

          {/* Mobile stats placeholder */}
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t border-l px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-8 w-24 mt-1" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-6 pb-2 sm:p-6">
        <div className="aspect-auto h-[250px] w-full relative">
          {/* Chart grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-100" />
            ))}
          </div>

          {/* Chart X-axis */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between py-2">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-12" />
            ))}
          </div>

          {/* Chart bars */}
          <div className="absolute bottom-8 left-4 right-4 top-4 flex items-end justify-between">
            {[...Array(12)].map((_, i) => (
              <Skeleton
                key={i}
                className="w-6 rounded-t-sm"
                style={{
                  height: `${Math.max(30, Math.floor(Math.random() * 180))}px`,
                }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
