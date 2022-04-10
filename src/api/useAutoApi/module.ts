import request from '/@/utils/request';

/**
 * 项目使用接口
 * @method getProjectList 获取项目列表
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
export function useModuleApi() {
  return {
    getList: (data?: object) => {
      return request({
        url: '/module/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdate(data?: object) {
      return request({
        url: '/module/saveOrUpdateModule',
        method: 'POST',
        data
      })
    },
    deleted: (params?: object) => {
      return request({
        url: '/module/deleteModule',
        method: 'POST',
        params,
      });
    },
  };
}
