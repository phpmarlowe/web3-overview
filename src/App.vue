<template>
  <ElConfigProvider :locale="zhCn">
    <!-- <FloorMap></FloorMap> -->

    <RouterView />
  </ElConfigProvider>
</template>
<script setup lang="ts">
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

  import axios, { Axios } from 'axios'
  import {
    getAccountInfo,
    getBalance,
    getBlock,
    getBlockCommitment,
    getTokenAccountsByOwner,
  } from './service/api/helius'
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
  // getAccountInfo().then((res) => {
  //   console.log(res)
  // })

  // getBalance('7WzRCGXYCXBCTvDovjzzVz4Vdo6Wq8FDogpQPPKdYxNj').then((res) => {
  //   console.log('balance:', res.result.value, res.result.value / 1e9 + ' SOL')
  // })
  // // getBlock().then((res) => {
  // //   console.log(res)
  // // })
  // // getBlockCommitment()
  // getTokenAccountsByOwner('7WzRCGXYCXBCTvDovjzzVz4Vdo6Wq8FDogpQPPKdYxNj').then((res) => {
  //   console.log(res)
  // })
</script>

<style scoped>
  #app {
    font-family: 'Hiragino', 'DINPro' !important;
    letter-spacing: 1px !important;
  }
</style>
