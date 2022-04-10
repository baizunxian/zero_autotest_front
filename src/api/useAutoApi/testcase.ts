import request from '/@/utils/request';

/**
 * 项目使用接口
 * @method getProjectList 获取项目列表
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
export function useTestCaseApi() {
  return {
    getList: (data?: object) => {
      return request({
        url: '/testcase/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdate(data?: object) {
      return request({
        url: '/testcase/saveOrUpdate',
        method: 'POST',
        data
      })
    },
    deleted: (data?: object) => {
      return request({
        url: '/testcase/deleted',
        method: 'POST',
        data,
      });
    },
    runTestCase: (data?: object) => {
      return request({
        url: '/testcase/runTestCase',
        method: 'POST',
        data,
      });
    },
    debugTestCase: (data?: object) => {
      return request({
        url: '/testcase/debugTestCase',
        method: 'POST',
        data,
      });
    },
    getTestCaseInfo: (data?: object) => {
      return request({
        url: '/testcase/getTestCaseInfo',
        method: 'POST',
        data,
      });
    },
  };
}
