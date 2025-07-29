"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";


interface Metric {
  title: string;
  value: string;
  change: number;
  isPositive: boolean;
}

export default function MetricsDashboard() {
  const metrics: Metric[] = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: 20.1,
      isPositive: true,
    },
    {
      title: "Active Users",
      value: "2,350",
      change: 5.2,
      isPositive: true,
    },
    {
      title: "Conversion Rate",
      value: "12.5%",
      change: -2.3,
      isPositive: false,
    },
    {
      title: "Avg. Session",
      value: "4m 32s",
      change: 1.2,
      isPositive: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className={`flex items-center text-xs ${metric.isPositive ? "text-green-500" : "text-red-500"}`}>
              {/* {metric.isPositive ? (
                <ArrowUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-1" />
              )} */}
              {Math.abs(metric.change)}%
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 