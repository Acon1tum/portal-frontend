"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MetricsWaveSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-36 mt-1" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] relative">
          {/* Chart grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-100" />
            ))}
          </div>

          {/* Wave line chart skeleton */}
          <div className="absolute inset-0 pt-8 pb-4">
            <div className="relative h-full">
              {/* Create points for the line */}
              <div className="absolute top-0 left-0 right-0 flex justify-between">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="relative">
                    {/* Wave line point */}
                    <Skeleton className="h-3 w-3 rounded-full" />

                    {/* X-axis label */}
                    <Skeleton className="h-3 w-8 absolute -bottom-16 left-1/2 transform -translate-x-1/2" />
                  </div>
                ))}
              </div>

              {/* Create a line-like curve using multiple skeletons */}
              <div className="absolute top-[40%] left-0 right-0 h-px">
                <svg className="w-full h-16" viewBox="0 0 500 60">
                  <path
                    d="M0,30 C100,10 150,50 250,20 C350,0 400,40 500,15"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* Data labels on points */}
              <div className="absolute top-[20%] left-[40%]">
                <Skeleton className="h-4 w-8" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-4" /> {/* Icon placeholder */}
        </div>
        <div className="leading-none">
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
      </CardFooter>
    </Card>
  );
}
