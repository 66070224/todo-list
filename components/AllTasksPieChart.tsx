"use client";

import { TaskGroupByOutputType } from "@/app/generated/prisma/models";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { PieChart, Pie, LabelList, Label } from "recharts";
import { PickEnumerable } from "@/app/generated/prisma/internal/prismaNamespace";
import { useMemo } from "react";

const chartFill = {
  WORK: { label: "Work", color: "var(--color-WORK)" },
  PERSONAL: { label: "Personal", color: "var(--color-PERSONAL)" },
  STUDY: { label: "Study", color: "var(--color-STUDY)" },
  FAMILY: { label: "Family", color: "var(--color-FAMILY)" },
  FINANCE: { label: "Finance", color: "var(--color-FINANCE)" },
  HEALTH: { label: "Health", color: "var(--color-HEALTH)" },
};

const chartConfig = {
  count: {
    label: "Tasks",
  },
  WORK: {
    label: "Work",
    color: "var(--chart-1)",
  },
  PERSONAL: {
    label: "Personal",
    color: "var(--chart-2)",
  },
  STUDY: {
    label: "Study",
    color: "var(--chart-3)",
  },
  FAMILY: {
    label: "Family",
    color: "var(--chart-4)",
  },
  FINANCE: {
    label: "Finance",
    color: "var(--chart-5)",
  },
  HEALTH: {
    label: "Health",
    color: "var(--chart-6)",
  },
} satisfies ChartConfig;

export default function AllTasksPieChart({
  data,
}: {
  data: (PickEnumerable<TaskGroupByOutputType, "category"[]> & {
    _count: {
      _all: number;
    };
  })[];
}) {
  const chartData = data.map((task) => ({
    category: task.category,
    count: task._count._all,
    fill: chartFill[task.category]?.color ?? "var(--chart-other)",
  }));

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Tasks</CardTitle>
        <CardDescription>All tasks from you</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="category"
              innerRadius={60}
              strokeWidth={5}
            >
              <LabelList
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Tasks
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
