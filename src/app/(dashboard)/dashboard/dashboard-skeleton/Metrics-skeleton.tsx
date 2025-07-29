"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MetricCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="py-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" /> {/* Title placeholder */}
          <div className="flex items-center">
            <Skeleton className="h-4 w-4 mr-1 rounded-full" />{" "}
            {/* Arrow icon placeholder */}
            <Skeleton className="h-4 w-12" /> {/* Percentage placeholder */}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <Skeleton className="h-10 w-28" /> {/* Value placeholder */}
      </CardContent>
      <CardFooter className="py-0 flex flex-col items-start">
        <div className="flex items-center">
          <Skeleton className="h-4 w-36 mb-1" /> {/* Description placeholder */}
          <Skeleton className="h-4 w-4 ml-1 rounded-full" />{" "}
          {/* Arrow icon placeholder */}
        </div>
        <Skeleton className="h-4 w-48 mt-1" />{" "}
        {/* Sub-description placeholder */}
      </CardFooter>
    </Card>
  );
};

const MetricsDashboardSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
      <MetricCardSkeleton />
    </div>
  );
};

export default MetricsDashboardSkeleton;
