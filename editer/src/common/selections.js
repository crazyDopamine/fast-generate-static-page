// import city from './city'
window.selections = {}

var selectionsUrl = {
  // city: city,
  // business: 'business/getAll'
}

var getSelections = function (key) {
  var promise = new Promise(function (resolve, reject) {
    if (!window.selections[key]) {
      if (!selectionsUrl[key]) {
        window.vm.$Message.error('key无选项')
        reject()
        return
      }
      if (typeof selectionsUrl[key] === 'string') {
        window.vm.$http.get(selectionsUrl[key]).then((rsp) => {
          window.selections[key] = rsp.data
          resolve(window.selections[key])
        }, () => {
          reject()
        })
      } else if (selectionsUrl[key] instanceof Array === true) {
        window.selections[key] = selectionsUrl[key]
        resolve(window.selections[key])
      } else {
        reject()
      }
    } else {
      resolve(window.selections[key])
    }
  })
  return promise
}

export {
  getSelections
}
