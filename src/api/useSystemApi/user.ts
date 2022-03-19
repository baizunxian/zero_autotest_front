import request from '/@/utils/request';

/**
 * 用户接口
 * @method getUserList 获取用户列表
 * @method allMenu 获取菜单接口，平铺
 * @method saveOrUpdateMenu 更新保存菜单
 */
export function useUserApi() {
  return {
    getUserList: (data?: object) => {
      return request({
        url: '/user/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdateUser(data?: object) {
      return request({
        url: '/user/saveOrUpdateUser',
        method: 'post',
        data
      })
    },
    delUser(data?: object) {
      return request({
        url: '/user/delUser',
        method: 'post',
        data
      })
    }
  };
}
