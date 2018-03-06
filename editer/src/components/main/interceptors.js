import consts from '../../common/const'
import { cookie } from 'vux'
import { url, transformParams } from '../../common/utils'

export function httpInterceptor (request, next) {
  if (request.url.indexOf('http://') < 0 && request.url.indexOf('https://') < 0) {
    request.url = url(request.url)
  }
  var ticket = cookie.get(consts.ticketKey)
  if (request.url.indexOf(window.baseUrl) >= 0 && ticket) {
    request.headers.set(consts.ticketKey, ticket)
  }
  request.params = transformParams(request.params)
  next((rsp) => {
    if (rsp.status === 200 && rsp.data && rsp.data.success) {
      if (request.method.toLowerCase() === 'post') {
        if (window.vm.$vux) {
          window.vm.$vux.loading.hide()
          window.vm.$vux.toast.text(rsp.data.message, 'bottom', 2000)
        } else if (window.vm.$Message) {
          if (rsp.data && rsp.data.msg) {
            window.vm.$Message.success(rsp.data.msg)
          }
        }
      }
      rsp.data = rsp.data.data
      rsp.ok = true
    } else if (rsp.status === 200 && typeof rsp.data !== 'object') {
      rsp.ok = true
    } else {
      rsp.ok = false
      if (rsp.status === 401) {
        // if (window.vm.$vux) {
        //   window.vm.$vux.loading.hide()
        //   window.vm.$vux.toast.text('请登录', 'bottom', 2000)
        // } else if (window.vm.$Message) {
        //   window.vm.$Message.error('请登录')
        // }
        window.vm.showLogin = true
        window.vm.$emit(consts.loadedFailEvent)
      } else if (rsp.status !== 200) {
        if (window.vm.$vux) {
          window.vm.$vux.loading.hide()
          window.vm.$vux.toast.text('服务器访问错误!', 'bottom', 2000)
        } else if (window.vm.$Message) {
          window.vm.$Message.error('服务器访问错误!')
        }
      } else {
        if (window.vm.$vux) {
          window.vm.$vux.loading.hide()
          window.vm.$vux.toast.text(rsp.data.msg, 'bottom', 2000)
        } else if (window.vm.$Message) {
          if (rsp.data && rsp.data.msg) {
            window.vm.$Message.error(rsp.data.msg)
          }
        }
      }
    }
  })
}
