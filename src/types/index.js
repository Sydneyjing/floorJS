// ==================== 基础类型 ====================
// 已移除类型定义,仅保留常量导出

// ==================== 导航栏相关 ====================

/**
 * 导航栏位置选项
 * @type {Array<{value: string, label: string}>}
 */
export const NAVBAR_POSITION_OPTIONS = [
    { value: 'top', label: '顶部' },
    { value: 'bottom', label: '底部' },
];

/**
 * 导航项配置结构
 * @typedef {Object} NavbarItem
 * @property {string} id - 唯一标识
 * @property {string} icon - 图标URL
 * @property {string} activeIcon - 选中态图标URL (可选)
 * @property {string} text - 文字
 * @property {Object} action - 跳转配置
 * @property {string} action.type - 跳转类型: 'none' | 'h5' | 'native_schema' | 'program'
 * @property {string} [action.targetUrl] - 目标URL (type != 'none' 时必填)
 * @property {Object} [action.params] - 埋点或透传参数
 * @property {number} order - 排序
 */

/**
 * 导航栏配置结构
 * @typedef {Object} NavbarConfig
 * @property {string} position - 位置: 'top' | 'bottom'
 * @property {number} height - 高度 (px)
 * @property {string} backgroundColor - 背景颜色
 * @property {string} [backgroundImage] - 背景图 (可选)
 * @property {string} textColor - 文字颜色
 * @property {string} activeColor - 选中态颜色
 * @property {number} iconSize - 图标大小 (px)
 * @property {NavbarItem[]} items - 导航项列表 (最多5个)
 */

/**
 * 默认导航栏配置
 */
export const DEFAULT_NAVBAR_CONFIG = {
    position: 'bottom',
    height: 56,
    backgroundColor: '#FFFFFF',
    textColor: '#666666',
    activeColor: '#1890ff',
    iconSize: 24,
    items: [],
};


// ==================== 客群选项 ====================

export const CUSTOMER_SEGMENT_OPTIONS = [
    { value: 'all', label: '全部客户', color: 'blue' },
    { value: 'vip', label: 'VIP客户', color: 'gold' },
    { value: 'regular', label: '普通客户', color: 'green' },
    { value: 'new', label: '新客户', color: 'cyan' },
    { value: 'custom', label: '自定义', color: 'purple' },
];

// ==================== 用户标签选项 ====================

export const USER_TAG_OPTIONS = [
    { value: 'vip', label: 'VIP客户', color: 'gold' },
    { value: 'new_user', label: '新用户', color: 'cyan' },
    { value: 'regular', label: '普通客户', color: 'green' },
    { value: 'high_value', label: '高价值客户', color: 'red' },
    { value: 'active', label: '活跃用户', color: 'blue' },
];

// ==================== 跳转类型选项 ====================

export const ACTION_TYPE_OPTIONS = [
    { value: 'none', label: '无跳转', description: '仅展示,不跳转' },
    { value: 'h5', label: 'H5跳转', description: '跳转到H5页面' },
    { value: 'native_schema', label: 'Native Schema', description: '原生页面跳转' },
    { value: 'program', label: '小程序', description: '跳转到小程序' },
];

// ==================== 楼层类型选项 ====================

export const FLOOR_TYPE_OPTIONS = [
    { value: 'banner', label: '轮播广告', icon: '🎠' },
    { value: 'product', label: '产品推荐', icon: '📦' },
    { value: 'ad', label: '营销广告', icon: '📢' },
    { value: 'promotion', label: '促销活动', icon: '🎉' },
    { value: 'navbar', label: '导航栏', icon: '📱' },
];
