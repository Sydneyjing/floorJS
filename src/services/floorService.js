import { get, post, put, del } from '@/utils/request';

/**
 * 楼层配置相关 API
 * 注意：接口路径为示例，对接后端时请替换为实际路径
 */
export const floorService = {
    /**
     * 获取楼层列表
     * @param {string} channel - 渠道 ('mobile' | 'web')
     */
    getFloorList(channel) {
        return get('/floors', { channel });
    },

    /**
     * 获取楼层详情
     * @param {string} id - 楼层 ID
     */
    getFloorDetail(id) {
        return get(`/floors/${id}`);
    },

    /**
     * 创建楼层
     * @param {object} data - 楼层数据
     */
    createFloor(data) {
        return post('/floors', data);
    },

    /**
     * 更新楼层
     * @param {string} id - 楼层 ID
     * @param {object} data - 更新数据
     */
    updateFloor(id, data) {
        return put(`/floors/${id}`, data);
    },

    /**
     * 删除楼层
     * @param {string} id - 楼层 ID
     */
    deleteFloor(id) {
        return del(`/floors/${id}`);
    },

    /**
     * 发布楼层
     * @param {string} id - 楼层 ID
     */
    publishFloor(id) {
        return post(`/floors/${id}/publish`);
    },

    /**
     * 批量排序楼层
     * @param {string} channel - 渠道
     * @param {string[]} floorIds - 排序后的楼层 ID 数组
     */
    reorderFloors(channel, floorIds) {
        return put('/floors/reorder', { channel, floorIds });
    },
};
