import { NetInfo } from 'react-native'

export function getNetworkType (opts = {}) {
  const { success, fail, complete } = opts
  const res = {}

  return NetInfo.getConnectionInfo()
    .then((connectionInfo) => {
      const { type, effectiveType } = connectionInfo
      if (type === 'wifi' || type === 'none') {
        res.networkType = type
      } else {
        res.networkType = effectiveType
      }
      success && success(res)
      complete && complete(res)

      return Promise.resolve(res)
    }).catch((err) => {
      res.errMsg = err.message
      fail && fail(res)
      complete && complete(res)

      return Promise.reject(err)
    })
}

export function onNetworkStatusChange (callback) {
  async function changeCallback (connectionInfo) {
    const res = {}
    const { type, effectiveType } = connectionInfo
    if (type === 'wifi' || type === 'none') {
      res.networkType = type
    } else {
      res.networkType = effectiveType
    }
    const isConnected = await NetInfo.isConnected.fetch()
    res.isConnected = isConnected

    callback && callback(res)
  }

  NetInfo.addEventListener('connectionChange', changeCallback)
}

export default {
  getNetworkType,
  onNetworkStatusChange
}
