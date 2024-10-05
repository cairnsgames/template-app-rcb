import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Container } from "react-bootstrap";

// Register the required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StampsBarChart = ({ data }) => {
  console.log("$$$ StampsBarChart data", data);
  // Initialize the count array for stamps
  const stampCounts = Array(10).fill(0); // from 0 to 9

  // Fill the count array based on the number of stamps collected
  data.forEach((item) => {
    if (item.stamps_collected >= 0 && item.stamps_collected <= 9) {
      stampCounts[item.stamps_collected]++;
    }
  });

  // Chart data configuration
  const chartData = {
    labels: Array.from({ length: 10 }, (_, i) => i.toString()),
    datasets: [
      {
        label: "Number of Cards",
        data: stampCounts,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart options configuration
  const options = {
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // To display each count increment
        },
      },
    },
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default StampsBarChart;
