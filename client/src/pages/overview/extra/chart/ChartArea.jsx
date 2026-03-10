import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
//
import BaseOptionChart from "../../../../components/chart/BaseOptionChart";

// ----------------------------------------------------------------------

const CHART_DATA = [
  { name: "series1", data: [250, 300, 150, 300] },
  // { name: 'series2', data: [11, 32, 45, 32, 34, 52, 41] }
];

export default function ChartArea() {
  const chartOptions = merge(BaseOptionChart(), {
    xaxis: {
      type: "category",
      categories: ["Jan", "Feb", "Mar", "Apr"],
    },
    tooltip: { x: { show: false }, marker: { show: false } },
    yaxis: {
      tickAmount: 2,
      labels: {
        /**
         * Allows users to apply a custom formatter function to yaxis labels.
         *
         * @param { String } value - The generated value of the y-axis tick
         * @param { index } index of the tick / currently executing iteration in yaxis labels array
         */
        formatter: function (val, index) {
          return val + "$";
        },
      },
    },
  });

  return (
    <ReactApexChart
      type="area"
      series={CHART_DATA}
      options={chartOptions}
      height={200}
    />
  );
}
