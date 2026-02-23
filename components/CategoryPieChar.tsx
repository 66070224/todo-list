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
  PENDING: { label: "Pending", color: "var(--color-PENDING)" },
  PROGRESS: { label: "Personal", color: "var(--color-PROGRESS)" },
  COMPLETED: { label: "Completed", color: "var(--color-COMPLETED)" },
  BREAK: { label: "Break", color: "var(--color-BREAK)" },
};

const chartConfig = {
  count: {
    label: "Tasks",
  },
  PENDING: {
    label: "Pending",
    color: "#808080",
  },
  PROGRESS: {
    label: "In Progress",
    color: "#ffff00",
  },
  COMPLETED: {
    label: "Completed",
    color: "#33cc33",
  },
  BREAK: {
    label: "Break",
    color: "#ff0000",
  },
} satisfies ChartConfig;

export default function CategoryPieChart({
  data,
  category,
}: {
  data: (PickEnumerable<TaskGroupByOutputType, ("status" | "category")[]> & {
    _count: {
      _all: number;
    };
  })[];
  category: string;
}) {
  const chartData = data.map((category) => ({
    status: category.status,
    count: category._count._all,
    fill: chartFill[category.status]?.color ?? "var(--chart-other)",
  }));

  const totalVisitors = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{category}</CardTitle>
        <CardDescription>All tasks from {category} category.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length !== 0 ? (
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
                nameKey="status"
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
        ) : (
          "No tasks yet"
        )}
      </CardContent>
    </Card>
  );
}
