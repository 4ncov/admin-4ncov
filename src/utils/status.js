export default {
  PENDING: {
    type: 'info',
    description: '待审核'
  },
  PUBLISHED: {
    type: '',
    description: '已发布'
  },
  PROCESSING: {
    type: 'warning',
    description: '处理中'
  },
  COMPLETED: {
    type: 'success',
    description: '已完成'
  }
}

export const USER_STATUS = {
  PENDING: {
    type: 'info',
    description: '待认证'
  },
  VERIFIED: {
    type: 'success',
    description: '已认证'
  },
  SUSPENDED: {
    type: 'warning',
    description: '已注销'
  }
}
