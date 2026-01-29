// ==================== 基础类型 ====================
// 已移除类型定义,仅保留常量导出

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
