<template>
  <div id="app">
    <header class="layout-row">
      <div class="header">
        <Button @click="showLogin" v-if="userInfoLoaded!=1">登陆</Button>
        <span v-if="userInfoLoaded==1">
          {{userInfo.name}}
        </span>
        <AutoComplete v-model="fileName" :data="fileList" style="width:200px"></AutoComplete>
        <Button @click="getFile">打开</Button>
        <Button @click="save">保存</Button>
        <Button @click="publish">发布</Button>
      </div>
      <Modal class="login-modal" v-model="loginPop" width="360" :closable="true" :mask-closable="false">
        <div class="form-area">
          <h1 class="text-center margin-bottom-20">欢迎登陆</h1>
          <Form ref="loginForm" :model="loginForm" :rules="rule">
            <FormItem prop="phone">
              <Input type="text" v-model="loginForm.phone" placeholder="手机号" size="large">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="loginForm.password" placeholder="密码" size="large">
              <Icon type="ios-locked-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer" class="text-right">
          <Button class="btn-theme" type="primary" :loading="modalLoading" @click="login()" long>登陆</Button>
        </div>
      </Modal>
    </header>
    <div class="layout">
      <div class="layout-left layout-container" contenteditable="true" ref="mdContainer" @input="mdChange"></div>
      <div class="layout-right layout-container" v-html="html"></div>
    </div>
  </div>
</template>
<script>
import MarkdownIt from 'markdown-it'
import markdownitAbbr from 'markdown-it-abbr'
import markdownitDeflist from 'markdown-it-deflist'
import markdownitFootnote from 'markdown-it-footnote'
import markdownitSub from 'markdown-it-sub'
import markdownitSup from 'markdown-it-sup'
import markdownitEmoji from 'markdown-it-emoji'
// import markdownitPandocRenderer from 'markdown-it-pandoc-renderer'
var md = MarkdownIt()
  .use(markdownitAbbr)
  .use(markdownitDeflist)
  .use(markdownitFootnote)
  .use(markdownitSub)
  .use(markdownitSup)
  .use(markdownitEmoji)
// .use(markdownitPandocRenderer)
import { cookie } from 'vux'
export default {
  components: {},
  computed: {},
  data: function() {
    return {
      md: '',
      html: '',
      loginPop: false,
      modalLoading: false,
      fileList: [],
      fileName: '',
      loginForm: {
        phone: '18321482348',
        password: '123456'
      },
      rule: {
        phone: [{ required: true, message: '请填写手机号', trigger: 'blur' }],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    showLogin: function() {
      this.modalLoading = false
      this.loginPop = true
    },
    login: function() {
      this.$refs.loginForm.validate(valid => {
        this.modalLoading = true
        if (valid) {
          var params = this.loginForm
          this.$http.post('user/login', params).then(
            rsp => {
              this.$Message.success('登陆成功！')
              if (rsp.data) {
                cookie.set(this.consts.ticketKey, rsp.data.token)
              }
              window.vm.getUserInfo()
              this.modalLoading = false
              this.loginPop = false
            },
            () => {
              this.modalLoading = false
            }
          )
        }
      })
    },
    publish() {
      this.$http
        .post('md/publish', { content: this.md, fileName: this.fileName })
        .then(() => {
          window.vm.$Message.success('保存成功')
          this.refresh()
        })
    },
    save() {
      this.$http
        .post('md/save', { content: this.md, fileName: this.fileName })
        .then(() => {
          window.vm.$Message.success('保存成功')
          this.refresh()
        })
    },
    loginOut: function() {
      cookie.set(this.consts.ticketKey, '')
      window.vm.userInfo = {}
      window.vm.userInfoLoaded = 0
      window.vm.$emit(this.consts.loadedFailEvent)
    },
    getUserInfo: function() {
      this.$http.get('user/userInfo').then(rsp => {
        this.$store.commit('loadUserInfo', rsp.data)
      })
    },
    mdChange(e) {
      this.md = e.target.innerText
      this.html = md.render(this.md)
    },
    refresh() {
      this.$http.get('md/fileList').then(rsp => {
        this.fileList = rsp.data
      })
    },
    getFile() {
      this.$http.get('md/get', { params: { fileName: this.fileName } }).then(
        rsp => {
          this.$refs.mdContainer.innerText = rsp.data
          this.md = rsp.data
          this.html = md.render(this.md)
        },
        rsp => {
          this.$refs.mdContainer.innerText = ''
          this.md = ''
          this.html = md.render(this.md)
        }
      )
    }
  },
  created: function() {
    window.vm = this
    var ticket = cookie.get(this.consts.ticketKey)
    if (ticket) {
      this.getUserInfo()
    }
    this.$on('loaded', function() {
      this.refresh()
    })
  }
}
</script>
<style lang="scss">
@import '../../css/common/variables';
div#app {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  header {
    height: 80px;
    position: relative;
    z-index: 1;
  }
}
div.layout {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding-top: 80px;
  .layout-container {
    float: left;
    width: 50%;
    height: 100%;
    padding: 20px;
    background-color: $white;
    overflow: auto;
    border: 1px solid $borderColor;
  }
}
</style>
