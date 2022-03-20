import request from '/@/utils/request';

/**
 * 菜单接口
 * @method getAllMenus 获取菜单接口，路由格式
 * @method allMenu 获取菜单接口，平铺
 * @method saveOrUpdateMenu 更新保存菜单
 */
export function useMenuApi() {
  return {
    // 获取所有菜单，嵌套
    getAllMenus: (data?: object) => {
      return request({
        url: '/menu/getAllMenus',
        method: 'POST',
        data,
      });
    },
    //后去所有菜单，平铺
    allMenu: (params?: object) => {
      return request({
        url: '/menu/allMenu',
        method: 'post',
        params,
      });
    },
    // 新增修改
    saveOrUpdate(data?: object) {
      return request({
        url: '/menu/saveOrUpdateMenu',
        method: 'post',
        data
      })
    }
  };
}
