import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const CategorizeOpenAIresults = ({ openAIresults }) => {
  const [canvasWidth, setCanvasWidth] = useState(0);
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    // Update canvas width based on parent's width
    if (containerRef.current) {
      setCanvasWidth(containerRef.current.offsetWidth * 0.75);
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const sortedVideos = [...openAIresults.text].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    const ctx = document.getElementById('myChart');

    const groupedData = {};
    sortedVideos.forEach((video) => {
      if (!groupedData[video.category]) {
        groupedData[video.category] = [];
      }
      groupedData[video.category].push({
        x: new Date(video.date),
        y: parseInt(video.viewCount),
        title: video.title,
      });
    });

    const datasets = Object.keys(groupedData).map((category, index) => {
      return {
        label: category,
        data: groupedData[category],
        borderColor: `hsl(${index * 25}, 100%, 50%)`,
        backgroundColor: `hsl(${index * 25}, 100%, 50%)`,
        fill: false,
        showLine: false, // Removes the lines between points
      };
    });

    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets,
      },
      options: {
        scales: {
          x: {
            type: 'time',
            title: {
              display: true,
              text: 'Date',
            },
          },
          y: {
            title: {
              display: true,
              text: 'View Count',
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom', // Moves the key (legend) below the chart
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                console.log(context);
                // Check if the point has title data
                if (context.raw && context.raw.title) {
                  return `${context.raw.title}: ${context.raw.y}`;
                } else {
                  return `${context.dataset.label}: ${context.raw.y}`;
                }
              },
            },
          },
        },
      },
    });
    chartRef.current = myChart;
  }, [openAIresults]);

  return (
    <div ref={containerRef} style={{ width: '100%' }}>
      <canvas id="myChart" width={canvasWidth} height="400"></canvas>
    </div>
  );
};

export default CategorizeOpenAIresults;
