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

export function deliverGoodsList(params, status = '') {
  return request({
    url: `/purchase/delivery/list/${status}`,
    method: 'get',
    data: params
  })
}


export function deliverGoodsDetail(id) {
  return request({
    url: `/purchase/delivery/${id}`,
    method: 'get',
    // data: params
  })
}


export function deliverGoodsCommit(params) {
  return request({
    url: `/purchase/delivery/receive`,
    method: 'post',
    data: params
  })
}
