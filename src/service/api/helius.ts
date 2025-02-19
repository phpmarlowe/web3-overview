import gabRequest from '..'
const APIKEY = import.meta.env.WEB3_API_KEY
// alert(APIKEY)
export const getAcoountInfo = () => {
  return gabRequest.post({
    url: ``,
    query: {
      apikey: APIKEY,
    },
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getAccountInfo',
      params: [
        'vines1vzrYbzLMRdu58ou5XTby4qAqVRLmqo36NKPTg',
        {
          encoding: 'base58',
        },
      ],
    },
  })
}
