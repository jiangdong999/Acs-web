import store from '@/store'

export default function(user_role){
  const roles = store.getters && store.getters.roles
  
  if (user_role && user_role instanceof Array && user_role.length > 0) {

    const hasPermission = roles.some(role => {
      return user_role.includes(role)
    })

    return hasPermission;
  } else {
    throw new Error(`need roles!`)
  }
}
