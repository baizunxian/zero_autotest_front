import request from '/@/utils/request';

/**
 * 项目使用接口
 * @method getProjectList 获取项目列表
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
export function useProjectApi() {
  return {
    getProjectList: (data?: object) => {
      return request({
        url: '/project/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdateProject(data?: object) {
      return request({
        url: '/project/saveOrUpdateProject',
        method: 'post',
        data
      })
    },
    delProject: (data?: object) => {
      return request({
        url: '/project/delProject',
        method: 'post',
        data,
      });
    },
  };
}
