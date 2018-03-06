import {dateFormat, numberComma} from 'vux'
import {selectionValue, kvTextAS, numberFilter} from './utils'

export default {
  install: function (Vue) {
    Vue.filter('date', function (date, format) {
      if (!format) {
        format = 'YYYY-MM-DD'
      }
      return dateFormat(date, format)
    })
    Vue.filter('numberComma', function (num, length) {
      return numberComma(num, length)
    })
    Vue.filter('number', numberFilter)
    Vue.filter('selections', selectionValue)
    Vue.filter('kvTextAS', function (value, selections, valueField, textField, index) {
      var textArray = kvTextAS(value, selections, valueField, textField, index)
      if (textArray) {
        return textArray.join('/')
      } else {
        return ''
      }
    })
    var defaultImg = '/static/imgs/img-default.jpg'
    var imgFilter = function (src, type) {
      var zipImgDic = window.baseUrl + 'breviary/'
      var bigImgDic = window.baseUrl + 'upload/'
      if ((type === 3 || type === 4) && !src) return src
      if (!src) return defaultImg
      if (src.indexOf('http') >= 0) {
        return src
      } else if (type === 1 || type === 3) {
        return bigImgDic + src
      } else if (type === 2 || type === 4) {
        return zipImgDic + src
      } else {
        return zipImgDic + src
      }
    }
    Vue.filter('img', imgFilter)
    var imgIdFilter = function (id) {
      if (id) {
        return window.baseUrl + 'open/common/orgPictures/' + id
      } else {
        return defaultImg
      }
    }
    Vue.filter('imgId', imgIdFilter)
    Vue.filter('movie', function (src, type) {
      return imgFilter(src, 1)
    })
    Vue.filter('localFile', function (file) {
      if (file) {
        return 'static/' + file
      } else {
        return ''
      }
    })
  }
}
