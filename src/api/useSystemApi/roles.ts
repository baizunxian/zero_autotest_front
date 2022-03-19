import request from '/@/utils/request';

/**
 * 用户接口
 * @method getUserList 获取用户列表
 * @method allMenu 获取菜单接口，平铺
 * @method saveOrUpdateMenu 更新保存菜单
 */
export function useRolesApi() {
  return {
    getRoleList: (data?: object) => {
      return request({
        url: '/roles/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdateRole(data?: object) {
      return request({
        url: '/roles/saveOrUpdateRole',
        method: 'post',
        data
      })
    },
    deleteRole(data?: object) {
      return request({
        url: '/roles/deleteRole',
        method: 'post',
        data
      })
    }
  };
}
