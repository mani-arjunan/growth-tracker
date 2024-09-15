function getData() {
  const growthData = localStorage.getItem("growth-data");

  if (!growthData) {
    return [];
  } else {
    return JSON.parse(growthData || "[]");
  }
}

function renderNoData() {
  const noDataElement = document.getElementById("no-data");
  const chartElement = document.getElementById("chart-container");

  chartElement.innerHTML = "";

  if (!noDataElement.innerHTML || noDataElement.style.display === "none") {
    const h1 = document.createElement("h1");
    h1.innerHTML = "No Data Found";

    noDataElement.appendChild(h1);
  }
}

function removeNoData() {
  const noDataElement = document.getElementById("no-data");

  noDataElement.innerHTML = "";
}

function drawChart(growthData) {
  if (growthData.length === 0) {
    renderNoData();
  } else {
    removeNoData();
    window.chart = Highcharts.chart("chart-container", {
      title: {
        text: "Growth Tracker",
        align: "left",
      },

      yAxis: {
        title: {
          text: "Salary/Net-Worth",
        },
        labels: {
          formatter: function ({ value }) {
            return value.toLocaleString();
          },
        },
      },

      xAxis: {
        type: "linear",
        title: {
          text: "Year",
        },
        tickInterval: 1,
      },

      exporting: {},
      series: [
        {
          name: "Salary/Net-Worth",
          data: growthData,
        },
      ],
    });
    window.chart.backupExporting = window.chart.options.exporting;
  }
}

function setData(growthData) {
  localStorage.setItem("growth-data", JSON.stringify(growthData));
}

function submitHandler() {
  const growthData = getData();
  const profitInput = document.getElementById("profit");
  const yearInput = document.getElementById("year");

  if (!profitInput.value || !yearInput.value) {
    alert("Some fields are Empty!");
    return;
  }

  growthData.push([+yearInput.value, +profitInput.value]);
  setData(growthData);
  drawChart(growthData);
  profitInput.value = "";
  yearInput.value = "";
}

function deleteHandler() {
  localStorage.removeItem("growth-data");
  drawChart([]);
}

function exportHandler() {
  const growthData = getData();

  if (growthData.length === 0) {
    alert("No data to export!");
    return;
  }

  var modal = document.getElementById("export-modal");

  modal.style.display = "block";

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

/**
 * Helper function to update chart config
 * @param {'All data' | 'Data with year' | 'No data'} exportType
 * @returns void
 **/
function updateChartConfig(exportType) {
  console.log(exportType);
  if (exportType === "All data") {
    window.chart.options.exporting = window.chart.backupExporting;
  } else if (exportType === "Data without salary") {
    window.chart.options.exporting = {
      ...window.chart.options.exporting,
      chartOptions: {
        yAxis: {
          labels: { enabled: false },
          tickLength: 0,
          lineWidth: 0,
        },
      },
    };
  } else {
    window.chart.options.exporting = {
      ...window.chart.options.exporting,
      chartOptions: {
        xAxis: {
          labels: { enabled: false },
          tickLength: 0,
          lineWidth: 0,
        },
        yAxis: {
          labels: { enabled: false },
          tickLength: 0,
          lineWidth: 0,
        },
      },
    };
  }

  return;
}

function downloadHandler() {
  const exportType = Array.from(
    document.getElementsByName("export-data"),
  ).filter((entry) => entry.checked);

  if (exportType.length === 0) {
    alert("Select export type!");
    return;
  }

  updateChartConfig(exportType[0].value);

  window.chart.exportChart({ type: "image/png", name: exportType[0].value });
}

function main() {
  const growthData = getData();

  // document.getElementById("delete").addEventListener("click", deleteHandler);
  document.getElementById("submit").addEventListener("click", submitHandler);
  document
    .getElementById("export")
    .addEventListener("click", exportHandler);
  document
    .getElementById("download")
    .addEventListener("click", downloadHandler);

  drawChart(growthData);
}

main();
