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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function PieGraphSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>
            <Skeleton className="h-6 w-40" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-36 mt-1" />
          </CardDescription>
        </div>
        {/* Select dropdown placeholder */}
        <div className="ml-auto">
          <Skeleton className="h-7 w-[130px] rounded-lg" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <div className="mx-auto aspect-square w-full max-w-[300px] relative flex items-center justify-center">
          {/* Donut chart skeleton */}
          <div className="relative">
            {/* Outer ring */}
            <Skeleton className="h-64 w-64 rounded-full" />

            {/* Inner circle (donut hole) */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-card rounded-full h-32 w-32"></div>

            {/* Text in the center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
              <Skeleton className="h-8 w-16 mb-2" /> {/* Number */}
              <Skeleton className="h-4 w-14" /> {/* "Visitors" label */}
            </div>

            {/* Active segment effect */}
            <div className="absolute top-0 left-1/2 w-[120px] h-[120px] rounded-tl-[120px] bg-muted/20"></div>

            {/* Active segment outer ring */}
            <div className="absolute -top-2 -left-2 w-[68px] h-[68px] rounded-tl-[68px] border-8 border-muted/30"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
