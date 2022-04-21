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
        method: 'POST',
        data
      })
    },
    getDebugTalkInfo: (data?: object) => {
      return request({
        url: '/debugTalk/getDebugTalkInfo',
        method: 'POST',
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
    getFuncList: (data?: object) => {
      return request({
        url: '/debugTalk/getFuncList',
        method: 'post',
        data,
      });
    },
    debugFunc: (data?: object) => {
      return request({
        url: '/debugTalk/debugFunc',
        method: 'post',
        data,
      });
    },
  };
}
