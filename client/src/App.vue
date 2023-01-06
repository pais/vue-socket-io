<template>
    <Pie :data="data" :options="options" />
  </template>
  
  <script lang="ts">
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  import { Pie } from 'vue-chartjs'
  import { io } from "socket.io-client";
  import * as chartConfig from './chartConfig.js'
  
  ChartJS.register(ArcElement, Tooltip, Legend)

  const socket = io("https://localhost:3000", {
    path: "/vote/"
  });
  
  export default {
    name: 'App',
    components: {
      Pie,
      io
    },
    data() {
      return chartConfig
    }
  }
  </script>
  