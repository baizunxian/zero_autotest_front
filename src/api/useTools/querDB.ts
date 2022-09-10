import request from '/@/utils/request';

/**
 * 数据库查询
 */
export function useQueryDBApi() {
  return {
    // 获取数据库连接列表
    getSourceList: (data?: object) => {
      return request({
        url: '/queryDB/getSourceList',
        method: 'POST',
        data,
      });
    },
    // 获取数数据库表
    getDBList: (data?: object) => {
      return request({
        url: '/queryDB/getDBList',
        method: 'POST',
        data,
      });
    },
    // 获取数数据库表
    getTableList: (data?: object) => {
      return request({
        url: '/queryDB/getTableList',
        method: 'POST',
        data,
      });
    },
    // 新增修改
    saveOrUpdate(data?: object) {
      return request({
        url: '/menu/saveOrUpdate',
        method: 'POST',
        data
      })
    },
    // 删除
    deleted(data?: object) {
      return request({
        url: '/menu/deleted',
        method: 'POST',
        data
      })
    }
  };
}
