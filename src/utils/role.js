

export default {
  ADMIN: 'ADMIN_ROLE',            //超管
  PROPERTY: 'PROPERTY_ROLE',       //？帐号
  COMMUNITY: 'COMMUNITY_ROLE',    //小区帐号
  OPEN: 'OPEN_ACCOUNT',           //运营帐号 
  DEMO: 'DEMO_ROLE',              //带indexMap首页
  OTHER: 'OTHER_ROLE',            //特定角色1
  SJF: 'SJF_ROLE'                 //特定角色2，三间房项目
};
export const sensitiveOptions = [
  { value: '0', label: '不脱敏' },
  { value: '1', label: '全部脱敏' },
  { value: '2', label: '部分脱敏' },
]
export const sensitiveOptionsNew = [
  { value: '1', label: '全部脱敏' },
  { value: '2', label: '部分脱敏(手机号可见)' },
  { value: '0', label: '不脱敏' },
]
export const accountOptions = [
  { value: '10', label: '物业帐号' },
  { value: '20', label: '政府帐号' },
]

export const healthStateOptions = [
  { value: '正常', label: '正常' },
  { value: '异常', label: '异常' },
]
