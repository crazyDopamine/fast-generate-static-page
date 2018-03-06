import {mix, each, filterNullParams} from './utils'
import consts from './const'
import {cookie} from 'vux'

var listConfig = {
  url: '',
  removeUrl: '',
  exportUrl: '',
  dataList: [],
  total: 0,
  page: 1,
  pageSize: 10,
  params: {},
  selected: {},
  options: {},
  loadFlag: 0,
  loading: false,
  showPage: false,
  refreshTime: 0,
  hideLoadingFn: null,
  reqParamName: {
    page: 'page',
    pageSize: 'pageSize'
  },
  rspParamName: {
    dataList: 'dataList',
    total: 'total'
  }
}
export default {
  methods: {
    initList: function (listNode = this.list, options) {
      listNode.options = mix({}, listNode.options, options)
      var list = mix({}, listConfig, listNode)
      var self = this
      each(list, function (data, key) {
        self.$set(listNode, key, data)
      })
    },
    refreshList: function (page, listNode = this.list) {
      var self = this
      if (page) {
        listNode.page = page
      }
      var params = {}
      if (listNode.page) {
        params[listNode.reqParamName.page] = listNode.page
        params[listNode.reqParamName.pageSize] = listNode.pageSize
      }
      params = mix(params, listNode.params)
      listNode.selected = {}
      if (!listNode.url) return
      listNode.dataList = []
      // this.$vux.loading.show({
      //   text: '加载中'
      // })
      filterNullParams(params)
      listNode.loadFlag = 1
      listNode.loading = true
      self.$Message.destroy()
      listNode.hideLoadingFn = self.$Message.loading({
        content: '正在加载中...',
        duration: 0
      })
      listNode.dataList = []
      listNode.refreshTime = new Date().getTime()
      this.$http.get(listNode.url, {params: params}).then((rsp) => {
        if (rsp.data instanceof Array) {
          listNode.dataList = rsp.data
          listNode.total = rsp.data.length
          listNode.showPage = false
        } else {
          listNode.dataList = rsp.data[listNode.rspParamName.dataList]
          listNode.total = rsp.data[listNode.rspParamName.total]
          if (listNode.total > listNode.pageSize || (listNode.total <= listNode.pageSize && listNode.page !== 1)) {
            listNode.showPage = true
          } else {
            listNode.showPage = false
          }
        }
        listNode.loadFlag = 2
        listNode.loading = false
        this.$forceUpdate()
        setTimeout(listNode.hideLoadingFn, 1000)
        self.$emit(consts.listLoadEvent, listNode)
      }, () => {
        listNode.loadFlag = 2
        listNode.loading = false
        setTimeout(listNode.hideLoadingFn, 1000)
      })
    },
    resetParams: function (listNode = this.list) {
      this.utils.resetObject(listNode.params)
      this.refreshList(1, listNode)
    },
    remove: function (id, listNode = this.list) {
      this.$Modal.confirm({
        title: '删除',
        content: '是否确认删除?',
        onOk: () => {
          if (typeof id === 'object') {
            this.$http.post(listNode.removeUrl, id).then(() => {
              this.refreshList(null, listNode)
              this.$emit(consts.afterListRemoveEvent)
            })
          } else {
            this.$http.post(listNode.removeUrl.replace('{id}', id), {id: id}).then(() => {
              this.refreshList(null, listNode)
              this.$emit(consts.afterListRemoveEvent)
            })
          }
        }
      })
    },
    exportList: function (listNode = this.list) {
      this.$Modal.confirm({
        title: '导出',
        content: '是否确认导出!',
        onOk: () => {
          var params = this.utils.mix({}, listNode.params)
          params[this.consts.ticketKey] = cookie.get(this.consts.ticketKey)
          params = this.utils.filterNullParams(params)
          params = this.utils.transformParams(params)
          window.open(window.baseUrl + listNode.exportUrl + '?' + this.utils.toUrlParams(params))
        }
      })
    }
  }
}
