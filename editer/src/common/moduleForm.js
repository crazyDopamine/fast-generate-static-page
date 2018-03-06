import {mix, each} from './utils'
import consts from './const'

var formConfig = {
  data: {},
  initData: {},
  submitData: {},
  rule: {},
  config: {
    addUrl: '',
    updateUrl: '',
    detailUrl: ''
  },
  status: 0,
  readonly: false,
  formRef: 'form',
  formPop: false
}

var moduleForm = {
  methods: {
    initForm: function (formNode = this.form, config = {}) {
      config.config = mix({}, formConfig.config, formNode.config, config.config)
      formNode.initData = mix({}, formNode.data)
      config = mix({}, formConfig, formNode, config)
      each(config, (data, key) => {
        this.$set(formNode, key, data)
      })
    },
    reset: function (formNode = this.form) {
      mix(formNode.data, formNode.initData)
      // if (formNode.initData) {
      //   mix(formNode.data, formNode.initData)
      // } else {
      //   resetForm(formNode.data, true)
      // }
      if (this.$refs[formNode.formRef]) {
        this.$refs[formNode.formRef].resetFields()
      }
      delete formNode.data.id
      this.btnLoading = false
    },
    add: function (formNode = this.form, callback) {
      formNode.status = 1
      this.reset(formNode)
      if (callback) callback()
      formNode.readonly = false
      formNode.formPop = true
      this.$emit(consts.beforeFormAddEvent)
    },
    edit: function (data, formNode = this.form, callback) {
      formNode.status = 2
      this.reset(formNode)
      mix(formNode.data, data)
      formNode.data.id = data.id
      if (callback) callback()
      formNode.readonly = false
      formNode.formPop = true
    },
    showDetail: function (data, formNode = this.form, callback) {
      formNode.status = 0
      this.reset(formNode)
      mix(formNode.data, data)
      formNode.data.id = data.id
      formNode.readonly = true
      if (callback) callback()
      formNode.formPop = true
    },
    submit: function (formNode = this.form, callback) {
      this.$refs[formNode.formRef].validate((valid) => {
        if (valid) {
          var params = this.utils.mix({}, formNode.submitData, formNode.data)
          let url = formNode.config.addUrl
          if (formNode.status === 2) {
            url = formNode.config.updateUrl.replace('{id}', params.id)
          }
          this.btnLoading = true
          this.$http.post(url, params).then((rsp) => {
            this.btnLoading = false
            formNode.formPop = false
            if (formNode.afterSubmit) formNode.afterSubmit.call(this, formNode)
            if (callback) callback()
          }, () => {
            this.btnLoading = false
          })
        }
      })
    },
    afterSubmit: function (formNode = this.form) {
    }
  }
}

export default moduleForm
