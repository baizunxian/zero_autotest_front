import request from '/@/utils/request';

/**
 * 项目使用接口
 * @method getProjectList 获取项目列表
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
export function useModuleApi() {
  return {
    getModuleList: (data?: object) => {
      return request({
        url: '/project/list',
        method: 'POST',
        data,
      });
    },
    allMenu: (params?: object) => {
      return request({
        url: '/menu/allMenu',
        method: 'post',
        params,
      });
    },
    saveOrUpdateMenu(data?: object) {
      return request({
        url: '/menu/saveOrUpdateMenu',
        method: 'post',
        data
      })
    }
  };
}
