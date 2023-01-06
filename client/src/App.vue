<template>
  <Pie :data="data" :options="options" />
</template>

<script lang="ts">
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { io } from "socket.io-client";
import * as chartConfig from './chartConfig.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const socket = io("localhost:3000", {
  path: "/vote/",
  transports: ['websocket', 'polling'],
  withCredentials: true
});

socket.on("connect_error", () => {
  // revert to classic upgrade
  debugger;
  socket.io.opts.transports = ["polling", "websocket"];
});

socket.on("connect", () => {
  console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("started", (message) => {
  console.log(message);
});

socket.on("polling", (message) => {
  console.log(message);
});

export default {
  name: 'App',
  components: {
    Pie,
    io
  },
  data() {
    return chartConfig
  },
  created() {
    socket.connect();
  }

}
</script>
