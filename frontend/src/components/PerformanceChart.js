import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const PerformanceChart = ({ students }) => {
  const data = {
    labels: students.map(student => student.name),
    datasets: [
      {
        label: "Marks",
        data: students.map(student => student.marks),
        backgroundColor: "rgba(93, 63, 211, 0.6)",
        borderColor: "#5a189a",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="chart-container">
      <h2>Student Performance</h2>
      <Bar data={data} />
    </div>
  );
};

export default PerformanceChart;
