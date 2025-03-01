// app.js
import $ from 'jquery';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { get } from 'jquery';

async function fetchData(address) {
  const url = `https://mainnet-idx.algonode.cloud/v2/accounts/${address}/transactions?limit=50`;
  const resp = await fetch(url);
  const parsedData = await resp.json();
  console.log('Fetched data:', parsedData);
  return {
    transactions: parsedData.transactions,
    parsedData: parsedData
  };
}

function decodeSensorData(data) {
  return data.map(item => {
    try {
      return window.atob(item);
    } catch (e) {
      console.error('Error decoding base64 string:', item, e);
      return null;
    }
  });
}

function parseSensorData(data) {
  return data.filter(item => item !== null).map(item => JSON.parse(item));
}

function uniqueMultiDimArray(array, key) {
  const tempArray = [];
  const keyArray = [];

  array.forEach(val => {
    if (!keyArray.includes(val[key])) {
      keyArray.push(val[key]);
      tempArray.push(val);
    }
  });

  return tempArray;
}

function prepareChartData(data) {
  let sensorTot = '';
  let co2Tot = '';
  let tempTot = '';
  let rhTot = '';

  data.forEach(item => {
    if (item?.object?.meas) {
      sensorTot += item.deviceName + ',';
      co2Tot += item.object.meas.co2 + ',';
      tempTot += item.object.meas.temp + ',';
      rhTot += item.object.meas.rh + ',';
    }
  });

  return {
    labels: sensorTot.slice(0, -1).split(','),
    co2: co2Tot.slice(0, -1).split(','),
    temp: tempTot.slice(0, -1).split(','),
    rh: rhTot.slice(0, -1).split(',')
  };
}

function createChart(chartData) {
  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'CO2 in ppm',
        backgroundColor: chartData.co2.map(co2 => {
          const co2Value = parseFloat(co2);
          if (co2Value > 900) {
            return 'rgba(255, 0, 0, 0.7)'; // Red
          } else if (co2Value > 500) {
            return 'rgba(255, 255, 0, 0.7)'; // Yellow
          } else {
            return 'rgba(0, 0, 255, 0.2)'; // Default blue
          }
        }),
        borderColor: 'rgb(255, 99, 132)',
        data: chartData.co2,
      },
      {
        label: 'Temperatura in C',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderColor: 'rgb(255, 159, 64)',
        data: chartData.temp,
      },
      {
        label: 'Umidita in %',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        borderColor: 'rgb(75, 192, 192)',
        data: chartData.rh,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        annotation: {
          annotations: {
            co2Label: {
              type: 'label',
              position: 'top',
              content: 'CO2',
              font: {
                size: 14
              },
              color: 'black',
              xAdjust: 0,
              yAdjust: -20,
              drawTime: 'afterDatasetsDraw',
              textAlign: 'center',
              formatter: (value, context) => {
                return 'CO2';
              },
              display: true,
            }
          }
        }
      }
    },
    plugins: [ChartDataLabels],
  };

  const myChart = new Chart(document.getElementById('myChart'), config);
  return myChart;
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

async function initialize(address) {
  const { transactions, parsedData } = await fetchData(address);
  const notaDati = transactions.map(trx => trx.note);
  const loraDati = decodeSensorData(notaDati);
  const loraJsonDati = parseSensorData(loraDati);
  const uniq = uniqueMultiDimArray(loraJsonDati, 'deviceName');
  const chartData = prepareChartData(uniq);

  if (window.myChart && typeof window.myChart.destroy === 'function') {
    window.myChart.destroy();
  }
  window.myChart = createChart(chartData);

  const schoolName = loraJsonDati[0]?.name || 'S.A.P. - Scuola Aria Pulita';
  document.getElementById('schoolName').innerText = schoolName;
  document.getElementById('aule').innerText = 'Numero di aule lette ' + (uniq.length);

  // Extract and format the last transaction date
  if (transactions.length > 0) {
    const lastTransaction = transactions[0];
    const lastTransactionDate = formatDate(lastTransaction['round-time']);
    document.getElementById('data-ultima-lettura').innerText = `Data ultima lettura: ${lastTransactionDate}`;
  } else {
    document.getElementById('data-ultima-lettura').innerText = 'Data ultima lettura: Nessuna transazione trovata';
  }
}

$(document).ready(function() {
  $('#fetch-data-button').on('click', function() {
    const address = $('#school-select').val();
    initialize(address);
  });
});
