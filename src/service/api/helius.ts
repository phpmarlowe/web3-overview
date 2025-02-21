import gabRequest from '..'

export const getAccountInfo = () => {
  return gabRequest.post({
    url: ``,
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

export const getBalance = (token) => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBalance',
      params: [token],
    },
  })
}

export const getBlock = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlock',
      params: [430],
    },
  })
}

export const getBlockCommitment = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlockCommitment',
      params: [5],
    },
  })
}

export const getBlockHeight = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlockHeight',
      params: [
        {
          commitment: 'finalized',
          minContextSlot: 1,
        },
      ],
    },
  })
}

export const getBlockProduction = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlockProduction',
      params: [
        {
          commitment: 'finalized',
          identity: '85iYT5RuzRTDgjyRa3cP8SYhM2j21fj7NhfJ3peu1DPr',
          range: {
            firstSlot: 0,
            lastSlot: 9887,
          },
        },
      ],
    },
  })
}

export const getBlockTime = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlockTime',
      params: [5],
    },
  })
}

export const getBlocks = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlocks',
      params: [5],
    },
  })
}

export const getBlocksWithLimit = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getBlocksWithLimit',
      params: [
        {
          start_slot: 5,
          limit: 3,
          commitment: 'finalized',
        },
      ],
    },
  })
}

export const getClusterNodes = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getClusterNodes',
    },
  })
}

export const getEpochInfo = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getEpochInfo',
      params: [
        {
          commitment: 'finalized',
          minContextSlot: 1000,
        },
      ],
    },
  })
}

export const getEpochSchedule = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getEpochSchedule',
    },
  })
}

export const getFeeForMessage = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getFeeForMessage',
      params: [
        'AQABAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQAA',
      ],
    },
  })
}

export const getFirstAvailableBlock = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getFirstAvailableBlock',
    },
  })
}

export const getGenesisHash = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getGenesisHash',
    },
  })
}
// 以上按https://docs.helius.dev/rpc/http/getgenesishash 顺序写的

//
export const getTokenAccountsByOwner = (token) => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByOwner',
      params: [
        token,
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          encoding: 'jsonParsed',
        },
      ],
    },
  })
}

export const getTokenAccountsByDelegate = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: 1,
      method: 'getTokenAccountsByDelegate',
      params: [
        'VaxZxmFXV8tmsd72hUn22ex6GFzZ5uq9DVJ5wA5pump',
        {
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
        },
        {
          encoding: 'jsonParsed',
        },
      ],
    },
  })
}
export const getProgramAccounts = () => {
  return gabRequest.post({
    url: ``,
    data: {
      jsonrpc: '2.0',
      id: '1',
      method: 'getProgramAccounts',
      params: ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'],
    },
  })
}
