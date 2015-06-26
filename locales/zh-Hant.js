var _ = require('lodash');

module.exports = _.merge({}, require('./en'), {
  common: {
    ok: '確定',
    cancel: '取消',
    delete: '刪除',
    update: '更新',
    name: '名稱',
    title: '標題',
    email: '電子信箱',
    password: '密碼',
    settings: '設定',
    create: '建立',
    login: '登入',
    logout: '登出',
    signup: '註冊',
    on: '開',
    off: '關',
    yes: '是',
    no: '否'
  },
  dashboard: {
    projects: '專案',
    account: '帳號',
    profile: '個人資料'
  },
  home: {
    my_projects: '我的專案'
  },
  login: {
    login_link_hint: '已經有帳號了？',
    signup_link_hint: '第一次使用？'
  },
  profile: {
    edit_profile: '編輯個人資料',
    new_project: '新增專案',
    projects: '專案',
    no_projects: '沒有專案'
  },
  project: {
    new_screen: '新增螢幕',
    screens: '螢幕',
    components: '元件',
    text: '文字',
    layout: '布局',
    button: '按鈕',
    input: '輸入框',
    link: '連結',
    image: '圖片',
    list: '清單',
    no_screens: '沒有螢幕',
    description: '描述',
    delete_project: '刪除專案',
    delete_project_prompt: '您確定要刪除此專案嗎？'
  },
  settings: {
    profile: '個人資料',
    change_password: '變更密碼',
    delete_account: '刪除帳號',
    current_password: '目前密碼',
    new_password: '新密碼',
    delete_account_prompt: '您確定要刪除此帳號嗎？您的所有專案都會被刪除且無法復原。'
  }
});
