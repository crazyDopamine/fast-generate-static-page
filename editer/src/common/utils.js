/**
 * Created by dongwei on 2017/5/15.
 */
import consts from './const'

/**
 * 深度拷贝
 * @returns {*}
 */
var mix = function () {
  var argu = arguments
  if (argu.length <= 0) return {}
  var obj = argu[0]
  if (!obj || typeof obj !== 'object') obj = {}
  var keys, key
  for (let i = 1; i < argu.length; i++) {
    if (argu[i] && argu[i] instanceof Array) {
      if (!(obj instanceof Array)) {
        obj = []
      }
      for (let k = 0; k < argu[i].length; k++) {
        if (typeof argu[i][k] === 'object') {
          obj.push(mix({}, argu[i][k]))
        } else {
          obj.push(argu[i][k])
        }
      }
    } else if (argu[i] && typeof argu[i] === 'object') {
      keys = Object.keys(argu[i])
      for (let j = 0; j < keys.length; j++) {
        key = keys[j]
        if (key === undefined) continue
        if (argu[i][key] instanceof Date) {
          obj[key] = argu[i][key]
        } else if (typeof argu[i][key] === 'object' && argu[i][key] != null) {
          obj[key] = mix(obj[key], argu[i][key])
        } else {
          obj[key] = argu[i][key]
        }
      }
    }
  }
  return obj
}

var each = function (array, callback) {
  if (!array) return
  if (array instanceof Array) {
    for (let i = 0; i < array.length; i++) {
      callback(array[i], i)
    }
  } else if (typeof array === 'object') {
    var keys = Object.keys(array)
    for (let i = 0; i < keys.length; i++) {
      callback(array[keys[i]], keys[i])
    }
  }
}

var toNV = function (array, valueField, labelField) {
  if (!valueField) valueField = 'id'
  if (!labelField) labelField = 'name'
  var result = []
  each(array, function (data, index) {
    result.push({ value: data[valueField], name: data[labelField] })
  })
  return result
}

var toKV = function (array, valueField, labelField) {
  if (!valueField) valueField = 'id'
  if (!labelField) labelField = 'name'
  var result = []
  each(array, function (data, index) {
    result.push({ key: data[valueField], value: data[labelField] })
  })
  return result
}

var toVL = function (array, valueField, labelField, num) {
  if (num == undefined) num = 4;
  if (!valueField) valueField = 'id'
  if (!labelField) labelField = 'name'
  var result = []
  var item = {}
  each(array, function (data, index) {
    item = { value: data[valueField], label: data[labelField], data: data }
    if (data.children && num != 1) {
      item.children = toVL(data.children, valueField, labelField, num - 1)
    }
    result.push(item)
  })
  return result
}

var toMap = function (array, valueField) {
  if (!valueField) valueField = 'id'
  var result = {}
  each(array, function (data, index) {
    result[data[valueField]] = data
  })
  return result
}

var url = function (url) {
  if (!url) url = ''
  if (url.indexOf('http://') < 0) {
    return window.baseUrl + url
  } else {
    return url
  }
}

var kvItem = function (value, selections, valueField) {
  var result = false
  var childrenResult = ''
  selections.forEach((item, index) => {
    if (item[valueField] == value) {
      result = item
    }
    if (item.children) {
      childrenResult = kvItem(value, item.children, valueField)
      if (childrenResult !== false) {
        result = []
        result.push(item)
        if (typeof childrenResult === 'string' || typeof childrenResult === 'number') {
          result.push(childrenResult)
        } else if (childrenResult instanceof Array) {
          result = result.concat(childrenResult)
        }
      }
    }
  })
  return result
}

var kvText = function (value, selections, valueField, textField) {
  var result = false
  var childrenResult = ''
  selections.forEach((item, index) => {
    if (item[valueField] == value) {
      result = item[textField]
    } else if (item.children) {
      childrenResult = kvText(value, item.children, valueField, textField)
      if (childrenResult != false) {
        result = []
        result.push(item[textField])
        if (typeof childrenResult == 'string') {
          result.push(childrenResult)
        } else if (childrenResult instanceof Array) {
          result = result.concat(childrenResult)
        }
      }
    }
  })
  return result
}

var kvTextAS = function (value, selections, valueField, textField, index) {
  if (!index) index = 0
  var result = []
  if (typeof value == 'string') {
    value = value.toString().split(',')
  }
  if (value && value.length - 1 >= index) {
    selections.forEach((item) => {
      if (item[valueField] == value[index]) {
        result.push(item[textField])
        if (index < value.length - 1) {
          var childrenValue = kvTextAS(value, item.children, valueField, textField, index + 1)
          if (childrenValue && childrenValue instanceof Array) {
            result = result.concat(childrenValue)
          } else {
            result.push(childrenValue)
          }
        }
      }
    })
    return result
  } else {
    return ''
  }
}

var toTextArray = function (selections, textField) {
  var result = []
  selections.forEach(function (data, index) {
    result.push(data[textField])
  })
  return result
}

var kvValue = function (value, selections, valueField) {
  var result = false
  var childrenResult = ''
  selections.forEach((item, index) => {
    if (item[valueField] === value) {
      result = item[valueField]
    }
    if (item.children) {
      childrenResult = kvValue(value, item.children, valueField)
      if (childrenResult !== false) {
        result = []
        result.push(item[valueField])
        if (typeof childrenResult === 'string' || typeof childrenResult == 'number') {
          result.push(childrenResult)
        } else if (childrenResult instanceof Array) {
          result = result.concat(childrenResult)
        }
      }
    }
  })
  return result
}

var filterNullParams = function (obj) {
  if (typeof obj !== 'object') return
  each(obj, function (value, key) {
    if (value === '' || value === null) {
      delete obj[key]
    }
  })
  return obj
}

var transformParams = function (obj) {
  each(obj, function (item, key) {
    if (item instanceof Date) {
      obj[key] = item.getTime()
    }
  })
  return obj
}

var resetObject = function (obj, isDeep) {
  each(obj, function (value, key) {
    if (obj[key] instanceof Array) {
      obj[key] = []
    } else if (typeof obj[key] === 'object') {
      if (obj[key] == null) {
        return
      } else if (obj[key] instanceof Date) {
        obj[key] = ''
      } else if (isDeep) {
        resetObject(obj[key])
      } else {
        obj[key] = null
      }
    } else if (typeof obj[key] === 'number') {
      obj[key] = ''
    } else if (typeof obj[key] === 'string') {
      obj[key] = ''
    } else {
      obj[key] = null
    }
  })
}

// var resetForm = function (obj, isDeep) {
//   each(obj, function (value, key) {
//     if (obj[key] instanceof Array) {
//       obj[key] = []
//     } else if (typeof obj[key] === 'object') {
//       if (obj[key] == null) {
//         return
//       } else if (obj[key] instanceof Date) {
//         obj[key] = ''
//       } else if (isDeep) {
//         resetObject(obj[key])
//       } else {
//         obj[key] = null
//       }
//     } else if (typeof obj[key] === 'number') {
//       obj[key] = ''
//     } else if (typeof obj[key] === 'string') {
//       obj[key] = ''
//     } else {
//       obj[key] = null
//     }
//   })
// }

Array.prototype.contains = function (item) {
  var result = false
  each(this, (data, index) => {
    if (data === item) result = true
  })
  return result
}
// Array.prototype.each = function (callback) {
//   for (let i = 0; i < this.length; i++) {
//     callback(this[i], i)
//   }
// }
// Array.prototype.getCheckAll = function (key = 'id') {
//   let result = []
//   this.each((item, index) => {
//     result.push(item[key])
//   })
//   return result
// }

/**
 * 获取search参数
 * @returns {{}}
 */
var getHashObj = function () {
  let qs = location.hash.length > 0 && location.hash.indexOf('?') > 0 ? location.hash.substr(location.hash.indexOf('?') + 1, location.hash.length) : ''
  let args = {}
  let items = qs.length > 0 ? qs.split('&') : []
  let item = null
  let name = null
  let value = null
  for (let i = 0; i < items.length; i++) {
    item = items[i].split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  return args
}

var getSearchObj = function () {
  let qs = location.hash.length > 0 && location.hash.indexOf('?') > 0 ? location.hash.substr(location.hash.indexOf('?') + 1, location.hash.length) : ''
  let args = {}
  let items = qs.length > 0 ? qs.split('&') : []
  let item = null
  let name = null
  let value = null
  for (let i = 0; i < items.length; i++) {
    item = items[i].split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  }
  return args
}

var getQuery = function (obj) {
  return mix({}, getHashObj(), getSearchObj(), obj)
}

var selectionValue = function (value, selectionsMap, descField) {
  if (selectionsMap && selectionsMap[value]) {
    return descField ? selectionsMap[value][descField] : selectionsMap[value].desc
  } else {
    return value
  }
}

import md5 from 'js-md5'
// let Base64 = require('js-base64').Base64
var encrypt = function (code) {
  code += consts.encryptCode ? consts.encryptCode : 'useonline'
  code = md5.base64(code)
  return code
}

var toUrlParams = function (obj) {
  var url = ''
  each(obj, function (item, key) {
    if (url != '') {
      url += '&'
    }
    url += key + '=' + item
  })
  return url
}

var numberFilter = function (num, length) {
  if (num == null) {
    return '--'
  } else if (isNaN(Number(num))) {
    return ''
  } else {
    return Number(num).toFixed(length)
  }
}

export {
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
  encrypt,
  toUrlParams,
  toTextArray,
  numberFilter
}
