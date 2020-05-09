import { param2Obj } from '@/utils'
const timestamp = new Date().getTime()
const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3891611881,3506945797&fm=27&gp=0.jpg',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://thumb1.shutterstock.com/thumb_large/2664172/298731920/stock-photo-female-hands-in-the-form-of-heart-against-the-sky-pass-sun-beams-hands-in-shape-of-love-heart-298731920.jpg',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { username } = JSON.parse(config.body)
    return {
      return_code: '2000',
      return_message: 'suc',
      return_result: {
        userInfo: userMap[username]
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return {
        return_code: '2000',
        return_message: 'suc',
        return_result: {
          userInfo: userMap[token]
        },
        signature: '',
        timestamp: timestamp
      }
    } else {
      return false
    }
  },
  logout: () => {
    return {
      return_code: '2000',
      return_message: 'suc',
      return_result: {},
      signature: '',
      timestamp: timestamp
    }
  }
}
