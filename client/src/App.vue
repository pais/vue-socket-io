<template>
  <Pie id="pie-chart" :data="chartData" :options="options" />
</template>

<script lang="ts">

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { io } from "socket.io-client";

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
  name: 'App',
  components: {
    Pie,
    io
  },
  data() {
    return {
      socket: {},
      chartData: {
        labels: [],
        datasets: [
          {
            backgroundColor: ["#41B883", "#E46651", "#00D8FF", '#FFB833'],
            data: []
          }]
      },
      options: {
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'test'
        }
      }
    }
  },
  created() {
    this.socket = io("localhost:3000", {
      path: "/vote/",
      transports: ['websocket', 'polling'],
      withCredentials: true
    });

    this.socket.on("connect_error", () => {
      this.socket.io.opts.transports = ["polling", "websocket"];
    });

    this.socket.on("connect", () => {
      console.log(this.socket.id); // x8WIv7-mJelg7on_ALbx
    });

    this.socket.on("started", (message) => {
      console.log(message);
    });

    var self = this;

    this.socket.on("polling", (message) => {
      self.updateChart(message);
      console.log(message);
    });

    this.socket.connect();
  },
  methods: {
    updateChart(message) {
      var self = this;

      const labels: string[] = [];
      const datas: Int32Array[] = [];

      for (var i = 0; i < message.Details.length; i++) {
        datas.push(message.Details[i].VoteCount);
        labels.push(message.Details[i].CandidateName);
        console.log(message.Details[i]);
      }

      self.chartData.datasets[0].data = datas;
      self.chartData.labels = labels;
      self.options.title.text = message.DateTime;

      var pieChart = ChartJS.getChart("pie-chart");

      pieChart.data = self.chartData;
      pieChart.update()
      pieChart.render();
    }
  }

}
</script>
