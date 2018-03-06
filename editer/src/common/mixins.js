import consts from './const'
import {
  mix,
  each,
  toNV,
  toKV,
  toVL,
  url,
  toMap,
  filterNullParams,
  transformParams,
  getQuery,
  resetObject,
  selectionValue,
  kvValue,
  kvText,
  kvTextAS,
  kvItem,
  toUrlParams,
  toTextArray,
  numberFilter
} from './utils'
import 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

var initSelections = {}

each(consts.selectionOptions, (item, key) => {
  if (item.data) {
    initSelections[key] = {
      list: item.data,
      listText: toTextArray(item.data, 'name'),
      state: 1
    }
  } else {
    initSelections[key] = {
      list: [],
      listText: [],
      state: 0
    }
  }
})

const store = new Vuex.Store({
  state: {
    userInfoLoaded: 0,
    userInfo: {},
    selections: initSelections
  },
  mutations: {
    loadUserInfo: function (state, data) {
      if (data) {
        state.userInfo = data
        state.userInfoLoaded = 1
      } else {
        state.userInfo = {}
        state.userInfoLoaded = 2
      }
    },
    refreshSelections: function (state, datas) {
      state.selections[datas.key].list = datas.data
      state.selections[datas.key].listText = toTextArray(datas.data, datas.textField ? datas.textField : 'name')
      state.selections[datas.key].state = 1
    }
  },
  getters: {
    getItem: (state) => (key, valueField, value) => {
      if (state.selections[key].state === 1) {
        return state.selections[key].list.find(item => item[valueField] === value)
      } else return ''
    },
    doFilter: (state) => (key, filter) => {
      if (state.selections[key].state === 1) {
        return state.selections[key].list.filter(filter)
      } else return []
    }
  }
})

var loadedMixins = {
  computed: {
    userInfo: function () {
      return this.$store.state.userInfo
    },
    userInfoLoaded: function () {
      return this.$store.state.userInfoLoaded
    }
  },
  watch: {
    userInfoLoaded: function () {
      if (this.userInfoLoaded === 1) {
        this.$emit(this.consts.loadedEvent)
      } else {
        this.$emit(this.consts.loadedFailEvent)
      }
    }
  },
  mounted: function () {
    if (this.userInfoLoaded === 1) {
      this.$emit(consts.loadedEvent)
    }
  }
}

var selectionMixins = {
  computed: {
    selections: function () {
      return this.$store.state.selections
    }
  },
  methods: {
    refreshSelections: function (option) {
      if (typeof option === 'string') {
        option = { key: option }
      } else if (typeof option !== 'object') {
        console.log('selection refresh error: wrong option!')
        return
      }
      if (!consts.selectionOptions[option.key]) {
        console.log('selection refresh error: no key option!')
        return
      }
      if ((!option.forceRefresh && this.selections[option.key].state !== 1) || (option.forceRefresh)) {
        window.vm.$http.get(consts.selectionOptions[option.key].url, {
          params: {
            page: 1,
            pageSize: 9999
          }
        }).then((rsp) => {
          if (rsp.data instanceof Array) {
            this.$store.commit('refreshSelections', { key: option.key, data: rsp.data })
          } else if (rsp.data.dataList) {
            this.$store.commit('refreshSelections', { key: option.key, data: rsp.data.dataList })
          }
        })
      }
    }
  }
}

var mqttMixins = {
  created: function () {
    this.$on(consts.mqttMsgEvent, function (msg) {
      var children = this.$children
      for (var i = 0; i < children.length; i++) {
        children[i].$emit(consts.mqttMsgEvent, msg)
      }
    })
  }
}

var common = {
  store: store,
  data: function () {
    return {
      consts: consts,
      btnLoading: false,
      utils: {
        mix,
        each,
        toNV,
        toKV,
        toVL,
        url,
        toMap,
        filterNullParams,
        transformParams,
        getQuery,
        resetObject,
        selectionValue,
        kvValue,
        kvText,
        kvTextAS,
        kvItem,
        toUrlParams,
        toTextArray,
        numberFilter
      }
    }
  },
  methods: {
    toContent: function (content) {
      if (!content || !content.replace) return ''
      content = content.replace(/\n\r/g, '<br/>')
      content = content.replace(/\r\n/g, '<br/>')
      content = content.replace(/\n/g, '<br/>')
      content = content.replace(/\r/g, '<br/>')
      return content
    },
    searchFilter: function (value, option) {
      return option.toUpperCase().indexOf(value.toUpperCase()) !== -1
    }
  }
}

var verify = {
  data: function () {
    return {
      sendBtnText: '发送验证码',
      defaultDelay: 60,
      timeDelay: 0,
      sendBtnDisabled: false
    }
  },
  methods: {
    sendVerify: function (phone) {
      var delay = () => {
        setTimeout(() => {
          this.timeDelay--
          if (this.timeDelay !== 0) {
            this.sendBtnText = this.timeDelay + '秒后可重新发送'
            delay()
          } else {
            this.sendBtnText = '重新发送验证码'
            this.sendBtnDisabled = false
          }
        }, 1000)
      }
      window.vm.$http.get('user/sendSms', { params: { phone: phone } }).then((rsp) => {
        if (rsp.data) {
          window.vm.$Message.success('发送成功')
        } else {
          window.vm.$Message.success('已发送，短信5分钟内有效')
        }
        this.timeDelay = this.defaultDelay
        this.sendBtnText = this.timeDelay + '秒后可重新发送'
        this.sendBtnDisabled = true
        delay()
      })
    },
    sendVerifyByEmail: function (username) {
      if (!username) {
        this.$Message.error('请填写登录名!')
        return
      }
      var delay = () => {
        setTimeout(() => {
          this.timeDelay--
          if (this.timeDelay !== 0) {
            this.sendBtnText = this.timeDelay + '秒后可重新发送'
            delay()
          } else {
            this.sendBtnText = '重新发送验证码'
            this.sendBtnDisabled = false
          }
        }, 1000)
      }
      window.vm.$http.post('api/user/forget/send-email', { username: username }).then((rsp) => {
        window.vm.$Message.success('发送成功')
        this.timeDelay = this.defaultDelay
        this.sendBtnText = this.timeDelay + '秒后可重新发送'
        this.sendBtnDisabled = true
        delay()
      })
    }
  }
}

var mobileComponents = {
  components: {}
}

export { loadedMixins, common, verify, mqttMixins, mobileComponents, selectionMixins }
