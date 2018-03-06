export default {
  ticketKey: 'Security-Token',
  encryptCode: 'gasunion',
  adminTicketKey: 'ADMIN_TOKEN',
  loginEvent: 'loginEvent',
  loadedEvent: 'loaded',
  loadedFailEvent: 'loadedFail',
  listLoadEvent: 'listLoadEvent',
  formErrorEvent: 'formErrorEvent',
  beforeFormAddEvent: 'beforeFormAddEvent',
  afterListRemoveEvent: 'afterListRemoveEvent',
  mqttMsgEvent: 'mqttMsgEvent',
  loginOutEvent: 'loginOutEvent',
  CODE_SUCC: 200,
  CODE_FAIL: 200000,
  CODE_ERROR: -999999,
  CODE_PARAM_ERR: 10002,
  CODE_VERIFI_ERROR: 10012,
  CODE_COOKIE_NULL: 'COOKIE_IS_NULL',
  moduleSet: {
    warn: true
  },
  // deviceTypeSelections: [
  //   {name: '压力表', value: 0},
  //   {name: '液位计', value: 1},
  //   {name: '温度计', value: 2},
  //   {name: '流量计', value: 3},
  //   {name: '地磅', value: 4},
  //   {name: '视频设备', value: 5},
  //   {name: '智能锁', value: 6}
  // ],
  // deviceTypePortTypeMap: {0: 0, 1: 0, 2: 1, 3: 1, 4: 1, 5: 1, 6: 0},
  // portTypeSelections: [{name: '模拟端口', value: 0}, {name: '数字端口', value: 1}],
  // portTypeMap: {0: '模拟端口', 1: '数字端口'},
  // deviceTypeUnitMap: {
  //   '压力表': 'MPa',
  //   '液位计': 'Nm<sup>3</sup>',
  //   '温度计': '℃',
  //   '流量计': 'm<sup>3</sup>／s',
  //   '地磅': 'kg',
  //   '视频设备': '',
  //   '智能锁': ''
  // },
  // deviceTypeUnitFMap: {
  //   '压力表': () => {
  //     return 'MPa'
  //   },
  //   '液位计': (h) => {
  //     return ['Nm', h('sup', 3)]
  //   },
  //   '温度计': () => {
  //     return '℃'
  //   },
  //   '流量计': (h) => {
  //     return ['m', h('sup', 3), '／s']
  //   },
  //   '地磅': (h) => {
  //     return 'kg'
  //   },
  //   '视频设备': (h) => {
  //     return ''
  //   },
  //   '智能锁': (h) => {
  //     return ''
  //   }
  // },
  deviceTypeImgMap: {
    '压力': 'realtime-img-yl.png',
    '液位': 'realtime-img-yw.png',
    '温度': 'realtime-img-wd.png',
    '流量': 'realtime-img-ll.png',
    '重量': 'realtime-img-db.png',
    '视频设备': '',
    '智能锁-施封': 'realtime-img-zns-0.png',
    '智能锁-锁定（本地施封）': 'realtime-img-zns-0.png',
    '智能锁-待命（锁未施封）': 'realtime-img-zns-1.png',
    '智能锁-解封': 'realtime-img-zns-1.png',
    '智能锁-停止（锁杆拔出）': 'realtime-img-zns-2.png',
    '智能锁-未锁好（锁杆拔出）': 'realtime-img-zns-2.png',
    '智能锁-报警（施封状态下）': 'realtime-img-zns-2.png',
    '智能锁-锁定报警（本地施封状态下）': 'realtime-img-zns-2.png',
    '智能锁-解除报警': 'realtime-img-zns-2.png',
    '智能锁-异常': 'realtime-img-zns-2.png'
  },
  deviceTypeIconMap: {
    '压力': 'icon-storage-tank',
    '液位': 'icon-liquid-level',
    '温度': 'icon-temperature',
    '流量': 'icon-flow',
    '重量': 'icon-dipon',
    '视频设备': 'icon-camera',
    '智能锁': 'icon-Page-1'
  },
  // siteTypeSelections: [{name: '液化天然气', value: 0}],
  // siteTypeMap: {'0': '液化天然气'},
  // warnConditionSelection: [{name: '无', value: 0}, {name: '大于等于阈值上限', value: 1},
  //   {name: '小于阈值上限大于等于阈值下限', value: 2}, {name: '小于等于阈值下限', value: 3},
  //   {name: '大于等于阈值上限或小于等于阈值下限', value: 4}],
  // warnConditionMap: {0: '无', 1: '大于等于阈值上限', 2: '小于阈值上限大于等于阈值下限', 3: '小于等于阈值下限', 4: '大于等于阈值上限或小于等于阈值下限'},
  // tankTypeSelections: [{name: '横向标准储罐', value: 0}, {name: '竖向标准储罐', value: 1}],
  // deviceTypeFieldMap: {
  //   0: [],
  //   1: [],
  //   2: [],
  //   3: [],
  //   4: [],
  //   5: ['appId', 'cameraId', 'isFocus'],
  //   6: ['lockId']
  // },
  // deviceTypeTextFieldMap: {
  //   '压力表': [],
  //   '液位计': [],
  //   '温度计': [],
  //   '流量计': [],
  //   '地磅': [],
  //   '视频设备': ['appId', 'cameraId', 'isFocus'],
  //   '智能锁': ['keyId']
  // },
  selectionOptions: {
    user: {
      url: '',
      data: [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}, {id: 3, name: 'test3'}]
    },
    company: {
      url: '',
      data: [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}, {id: 3, name: 'test3'}]
    },
    site: {
      url: '/api/sites'
    },
    role: {
      data: [
        {
          code: 'ROLE_PLATFORM_SUPER_ADMIN',
          value: 0,
          name: '平台超级管理员',
          deviceUrl: '/devicePlatform',
          platform: true,
          roleSelections: [
            {code: 'ROLE_PLATFORM_ADMIN', value: 1, name: '平台管理员'},
            {code: 'ROLE_COMPANY_SUPER_ADMIN', value: 2, name: '运营商超级管理员'}
          ]
        },
        {
          code: 'ROLE_PLATFORM_ADMIN',
          value: 1,
          name: '平台管理员',
          deviceUrl: '/devicePlatform',
          platform: true,
          roleSelections: [
            {code: 'ROLE_COMPANY_SUPER_ADMIN', value: 2, name: '运营商超级管理员'}
          ]
        },
        {
          code: 'ROLE_COMPANY_SUPER_ADMIN',
          value: 2,
          name: '运营商超级管理员',
          deviceUrl: '/deviceCompany',
          siteOperate: true,
          siteModule: true,
          roleSelections: [
            {code: 'ROLE_COMPANY_ADMIN', value: 3, name: '运营商管理员'},
            {code: 'ROLE_SITE_SUPER_ADMIN', value: 4, name: '站点超级管理员'},
            {code: 'ROLE_SITE_ADMIN', value: 5, name: '站点管理员'}
          ]
        },
        {
          code: 'ROLE_COMPANY_ADMIN',
          value: 3,
          name: '运营商管理员',
          deviceUrl: '/deviceCompany',
          siteOperate: true,
          siteModule: true,
          roleSelections: [
            {code: 'ROLE_SITE_SUPER_ADMIN', value: 4, name: '站点超级管理员'},
            {code: 'ROLE_SITE_ADMIN', value: 5, name: '站点管理员'}
          ]
        },
        {
          code: 'ROLE_SITE_SUPER_ADMIN',
          value: 4,
          name: '站点超级管理员',
          deviceUrl: '/deviceCompany',
          warnModule: true,
          siteOperate: true,
          siteModule: true,
          roleSelections: [
            {code: 'ROLE_SITE_ADMIN', value: 5, name: '站点管理员'}
          ]
        },
        {
          code: 'ROLE_SITE_ADMIN',
          value: 5,
          name: '站点管理员',
          deviceUrl: '/deviceCompany',
          warnModule: true,
          siteModule: true,
          siteOperate: false,
          roleSelections: []
        }
      ]
    },
    device: {
      url: 'api/company/device/infos'
    },
    deviceType: {
      data: [
        {id: 'MANOMETER', name: '压力', deviceDataType: 'RTU'},
        {id: 'LIQUIDOMETER', name: '液位', deviceDataType: 'RTU'},
        {id: 'THERMOMETER', name: '温度', deviceDataType: 'RTU'},
        {id: 'FLOWMETER', name: '流量', deviceDataType: 'RTU'},
        {id: 'WEIGHT', name: '重量', deviceDataType: 'RTU'},
        {id: 'VIDEO', name: '视频流', deviceDataType: 'CAMERA'},
        {id: 'SMARTLOCK', name: '智能锁', deviceDataType: 'SMARTLOCK'}
      ]
    },
    deviceDataType: {
      data: [
        {id: 'RTU', name: 'RTU'},
        {id: 'CAMERA', name: '智能摄像头'},
        {id: 'SMARTLOCK', name: '智能锁'}
      ]
    },
    companySuper: {
      url: 'api/companys/superAdminList'
    },
    siteSuper: {
      url: 'api/sites/superAdminList'
    },
    rtuPortType: {
      data: [
        {id: 0, name: '模拟'},
        {id: 1, name: '数字'},
        {id: 2, name: '串行'}
      ]
    },
    brand: {
      data: [{id: 1, name: 'test1'}, {id: 2, name: 'test2'}, {id: 3, name: 'test3'}]
    },
    alarmRulesContent: {
      data: [
        {id: 'LT', name: '<'},
        {id: 'LE', name: '<='},
        {id: 'E', name: '='},
        {id: 'GE', name: '>='},
        {id: 'GT', name: '>'}
      ]
    },
    tankType: {
      data: [{name: '横向标准储罐', id: 0}, {name: '竖向标准储罐', id: 1}]
    },
    siteAdmins: {
      url: 'api/user/site/admin'
    },
    rtuProtocols: {
      url: 'api/common/rtu/protocols'
    }
  }
}
