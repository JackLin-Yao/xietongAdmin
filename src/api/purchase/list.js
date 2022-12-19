import request from '@/utils/request'
export function getPurchaseList(params) {
  return request({
    url: '/purchase/undelivery/list',
    method: 'get',
    // params: {
    //   pageSize: 20
    // }
    params
  })
}
export function getPurchaseNumber(poNum) {
  return request({
    url: `/purchase/undelivery/${poNum}`,
    method: 'get',
    // params: {
    //   pageSize: 20
    // }

  })
}


export function postDeliverGoods(params) {
  return request({
    url: '/purchase/undelivery/delivery',
    method: 'post',
    data: JSON.stringify(params)

  })
}
