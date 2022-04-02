import request from '/@/utils/request';

/**
 * 项目使用接口
 * @method getProjectList 获取项目列表
 * @method getMenuTest 获取后端动态路由菜单(test)
 */
export function useDebugTalkApi() {
  return {
    getList: (data?: object) => {
      return request({
        url: '/debugTalk/list',
        method: 'POST',
        data,
      });
    },
    saveOrUpdate(data?: object) {
      return request({
        url: '/debugTalk/saveOrUpdate',
        method: 'post',
        data
      })
    },
    getDebugTalkInfo: (data?: object) => {
      return request({
        url: '/debugTalk/getDebugTalkInfo',
        method: 'post',
        data,
      });
    },

    deleted: (data?: object) => {
      return request({
        url: '/debugTalk/deleted',
        method: 'post',
        data,
      });
    },
  };
}
