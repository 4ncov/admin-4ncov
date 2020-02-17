export default {
  HOSPITAL: {
    description: '寻求方'
  },
  SUPPLIER: {
    description: '供应方'
  },
  SYSADMIN: {
    description: '管理员'
  }
}

export const isHospital = role => role === 'HOSPITAL'

export const isSupplier = role => role === 'SUPPLIER'

export const isSysadmin = role => role === 'SYSADMIN'
