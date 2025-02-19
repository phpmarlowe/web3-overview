<template>111</template>
<script setup lang="ts">
  import axios, { Axios } from 'axios'
  import { getAcoountInfo } from './service/api/helius'
  const APIKEY = import.meta.env.WEB3_API_KEY

  // axios.post(`/web3?api-key=${APIKEY}`, {
  //   jsonrpc: '2.0',
  //   id: 1,
  //   method: 'getAccountInfo',
  //   params: [
  //     'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg',
  //     {
  //       encoding: 'base58',
  //     },
  //   ],
  // })
  getAcoountInfo().then((res) => {
    console.log(res)
  })
</script>

<style scoped></style>
