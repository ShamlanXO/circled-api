import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
//
import BaseOptionChart from "../../../../components/chart/BaseOptionChart";

// ----------------------------------------------------------------------

const CHART_DATA = [{ name: "Total Customers", data: [11, 10, 13, 14] }];

export default function ChartColumnSingle() {
  const chartOptions = merge(BaseOptionChart(), {
    plotOptions: { bar: { columnWidth: "6px" } },
    stroke: { show: false },

    colors: ["#FB8500"],

    chart: {
      foreColor:
        "linear-gradient(270deg, #FB8500 0%, rgba(251, 133, 0, 0.43) 100%)",
    },
    xaxis: {
      categories: ["Jan", "Feb", "Mar", "Apr"],
    },
    yaxis: {
      tickAmount: 3,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}`,
      },
    },
  });

  return (
    <ReactApexChart
      type="bar"
      series={CHART_DATA}
      options={chartOptions}
      height={200}
    />
  );
}
