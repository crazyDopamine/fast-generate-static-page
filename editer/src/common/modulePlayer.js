import mqtt from 'mqtt'

var module = {
  data: function () {
    return {
      players: {},
      client: null
    }
  },
  methods: {
    initPlayer: function (appId, cameraIp, domId) {
      this.initPlayerContainer(appId, domId, cameraIp)
      this.initPlayerMqtt(window.playerMqttTopic, () => {
        this.startPlayer(cameraIp, window.playerMqttTopic)
      })
    },
    initPlayerContainer: function (appId, domId, cameraIp) {
      if (!window.players) {
        window.players = {}
      }
      if (window.players[domId]) {
        // console.log(window.players[domId].container)
      }
      var player = {}
      player.container = new window.mpsPlayer({
        container: domId,//播放器容器ID，必要参数
        uin: '21884',//用户ID
        appId: appId,//播放实例ID
        width: '100%',//播放器宽度，可用数字、百分比等
        height: '100%',//播放器高度，可用数字、百分比等
        autostart: true,//是否自动播放，默认为false
        controlbardisplay: 'enable',//是否显示控制栏，值为：disable、enable默认为disable。
        isclickplay: false,//是否单击播放，默认为false
        isfullscreen: true,//是否双击全屏，默认为true,
      })
      // player.interval = window.setInterval(()=>{
      //   this.sendHeart(cameraIp,window.playerMqttTopic)
      // },1000*60*5)
      window.players[domId] = player
    },
    startPlayer: function (cameraIp, topic) {
      if (!this.client) {
        return
      }
      let msg = {
        command: 'live',
        para: {
          'camera_name': cameraIp,
          live: 'up'
        }
      }
      this.client.publish(topic, JSON.stringify(msg), {}, () => {
        console.log('开流成功')
      })
    },
    endPlayer: function (cameraId, topic, domId) {
      if (!this.client) {
        return
      }
      if (window.players[domId]) {
        // window.clearInterval(window.players[domId].interval)
        window.players[domId].container.handle = ''
        window.players[domId] = ''
        if (window.document.querySelector('#' + domId)) {
          window.document.querySelector('#' + domId).innerHTML = ''
        }
      }
      // let msg = {
      //   command:'live',
      //   para:{
      //     'camera_name':cameraId,
      //     live:'down'
      //   }
      // }
      // this.client.publish(topic,JSON.stringify(msg),{},()=>{
      //   console.log('闭流成功')
      // })
    },
    // sendHeart: function (cameraIp, topic) {
    //   if (!this.client) {
    //     return
    //   }
    //   let msg = {
    //     command: 'heart',
    //     para: {
    //       'camera_name': cameraIp
    //     }
    //   }
    //   this.client.publish(topic, JSON.stringify(msg), {}, () => {
    //     console.log('发送心跳成功')
    //   })
    // },
    operateCamera: function (cameraId, operate) {
      if (!this.client) {
        return
      }
      let msg = {
        command: '',
        para: {
          'camera_name': cameraId,
          message: {}
        }
      }
      if (operate === 'in' || operate === 'out') {
        msg.command = 'zoom'
        msg.para.message.zoom = operate
      } else {
        msg.command = 'turn'
        msg.para.message.turn = operate
      }
      this.client.publish(window.playerMqttTopic, JSON.stringify(msg), {}, () => {
        console.log('操作成功')
      })
    },
    initPlayerMqtt: function (topic, callback) {
      if (this.client) {
        if (callback) callback()
        return
      }
      this.client = mqtt.connect(window.playerMqttUrl, {
        username: window.playerMqttAccount,
        password: window.playerMqttPassword
      })
      this.client.on('connect', () => {
        console.log('mqtt连接成功!')
        if (callback) callback()
      })
    },
    restartPlayer: function (data, domId) {
      this.endPlayer(data.appId, data.cameraId, domId ? domId : 'player-' + data.deviceId)
      this.initPlayer(data.appId, data.cameraId, domId ? domId : 'player-' + data.deviceId)
    }
  }
}

export default module
