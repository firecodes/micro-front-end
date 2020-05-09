import Mock from 'mockjs'

const List = []
const List1 = []
const listBrand = []
const listChannel = []
const listStore = []
const listStaff = []
const count = 100
const timestamp = new Date().getTime()
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    dictionary_code: '@id',
    dictionary_name: '@name'
  }))
}
for (let i = 0; i < count; i++) {
  List1.push(Mock.mock({
    dictionary_code: '@id',
    dictionary_name: '@name'
  }))
}
for (let i = 0; i < 5; i++) {
  listBrand.push(Mock.mock({
    brand_code: '@id',
    brand_name: '@name'
  }))
}
for (let i = 0; i < 30; i++) {
  listChannel.push(Mock.mock({
    channel_code: '@id',
    channel_name: '@name'
  }))
}
for (let i = 0; i < 30; i++) {
  listStore.push(Mock.mock({
    store_code: '@id',
    store_name: '@word'
  }))
}

for (let i = 0; i < 200; i++) {
  listStaff.push(Mock.mock({
    employee_code: '@id',
    full_name: '@word'
  }))
}

export default {
  getDictionaryListByType: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(List.length / 10),
        total_count: List.length,
        dictionaries: List.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  getChildDictionaryList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(List1.length / 10),
        total_count: List1.length,
        dictionaries: List1.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  queryBrandList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(listBrand.length / 10),
        total_count: listBrand.length,
        dictionaries: listBrand.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  queryChannelList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(listChannel.length / 10),
        total_count: listChannel.length,
        dictionaries: listChannel.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  queryStoreList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(listStore.length / 10),
        total_count: listStore.length,
        dictionaries: listStore.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  },
  queryEmployeeList: config => {
    const { page_no = 1, page_size = 20 } = JSON.parse(config.body).bu_content
    return {
      code: '2000',
      msg: 'suc',
      result: {
        total_page: Math.ceil(listStaff.length / 10),
        total_count: listStaff.length,
        dictionaries: listStaff.slice((page_no - 1) * page_size + 1, page_no * page_size)
      },
      signature: '',
      timestamp: timestamp
    }
  }
}
