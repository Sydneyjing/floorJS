1. 项目概述
本项目旨在开发一个基于 React 19 + Antd v5 + Vite 的银行营销活动配置中台。 核心目标：实现“楼层化”页面搭建。客户经理可配置广告楼层，支持多张图片轮播、千人千面策略、多端（App/PC）差异化展示，并具备字段级联动和楼层互斥逻辑。 当前阶段：本地 Demo 原型开发（无后端交互，图片本地预览，策略前端模拟）。

2. 系统架构与技术栈
框架：React 19 (利用 Hooks 如 useTransition 优化复杂表单性能)

UI 库：Ant Design v5 (使用 Form, Form.List, App 包裹组件)

构建工具：Vite

拖拽库：dnd-kit (用于楼层排序及图片排序)

状态管理：React Context 或 Zustand (管理全局 Page Schema)

3. 核心数据结构 (JSON Schema)
这是前后端交互的标准。为了支持你提到的 “互斥需求” 和 “字段联动”，Schema 设计如下：

TypeScript
/**
 * 页面总结构
 */
interface PageSchema {
  pageId: string;
  title: string;
  floors: FloorConfig[]; // 楼层数组
}

/**
 * 单个楼层配置 (广告轮播)
 */
interface FloorConfig {
  id: string;        // 唯一标识 (UUID)
  type: 'carousel';  // 组件类型
  
  // 1. 基础容器配置
  style: {
    deviceTarget: 'mobile' | 'pc' | 'responsive'; // 投放端
    heightMode: 'fixed' | 'aspectRatio';          // 高度策略
    aspectRatio?: number;     // 宽高比 (如 2.35)
    fixedHeight?: number;     // 固定高度 (px)
    padding: [number, number, number, number]; // 上右下左
    backgroundColor: string;
  };

  // 2. 楼层级高级配置 (互斥逻辑)
  advanced: {
    mutexGroupId?: string; // 互斥组ID。若多个楼层配置相同ID，前端渲染时仅展示优先级最高的一个。
  };

  // 3. 轮播内容列表
  content: CarouselItem[];
}

/**
 * 单张轮播图配置
 */
interface CarouselItem {
  uid: string;
  title: string;       // 图片标题/Alt
  imageUrl: string;    // Demo阶段为 Base64 或 Blob URL
  
  // 交互与跳转 (字段联动关键区域)
  action: {
    type: 'none' | 'h5' | 'native_schema' | 'program'; 
    targetUrl?: string;    // 当 type != 'none' 时必填
    params?: Record<string, string>; // 埋点或透传参数
  };

  // 投放策略 (千人千面)
  strategy: {
    priority: number;      // 排序优先级
    timeRange: [string, string] | null; // ISO 字符串 [开始, 结束]
    targetTags: string[];  // 目标客群标签 ['vip', 'new_user']
  };
  
  // 埋点配置
  tracking: {
    clickId?: string;      // 点击监测ID
    exposureId?: string;   // 曝光监测ID
  };
}
4. 功能模块详细设计
4.1 界面布局 (Layout)
采用经典的 左-中-右 低代码编辑器布局：

左侧 (Component Library)：提供“广告轮播”组件，支持拖拽入画布。

中间 (Canvas & Preview)：

头部：设备切换 (Mobile/PC)、模拟环境配置栏。

主体：渲染页面楼层，支持楼层选中、拖拽排序、删除。

右侧 (Property Panel)：选中楼层后，显示配置表单。

4.2 广告楼层配置项 (Property Panel)
使用 Antd Form 实现，需处理复杂的字段联动。

A. 样式与互斥设置
高度策略：

单选框：固定高度 vs 自适应比例。

联动逻辑：选“固定高度”显示 InputNumber (px)；选“自适应”显示 Select (16:9, 2:1, 3:1 等)。

互斥组设置 (响应需求)：

输入框：Mutex Group ID (选填)。

说明：输入诸如 "top_banner_group"，用于指示该楼层与其他同名楼层互斥。

B. 内容列表配置 (Form.List)
此处为核心操作区，每添加一张图片，生成一个折叠面板。

图片上传：

实现：本地 Demo 使用 <input type="file"> 获取 File 对象，通过 URL.createObjectURL(file) 生成本地预览地址存入 Schema。

校验：校验图片比例（如要求 2:1，误差容忍度 5%）。

跳转配置 (字段联动)：

跳转类型 (Select)：选择 H5 / App Schema / 无跳转。

跳转地址 (Input)：

互斥/显隐逻辑：当 类型 == 无跳转 时，隐藏 此输入框；否则 必填。

校验：当 类型 == H5 时，正则校验 http/https 开头。

埋点与参数：

提供 Key-Value 键值对输入组件，用于配置 URL 后缀参数。

C. 策略配置
生效时间：RangePicker (ShowTime)。

客群标签：Select (Mode="multiple")。

数据源：Demo 阶段本地定义常量 const MOCK_TAGS = [{label: '新用户', value: 'new'}, {label: 'VIP', value: 'vip'}]。

4.3 预览与模拟引擎 (The Simulation Engine)
由于是本地 Demo，不仅要展示 UI，还要“运行”逻辑。

A. 模拟环境条 (顶部)
在 Canvas 顶部提供控制区，模拟不同用户的视角：

时间穿梭机：DatePicker。默认为当前时间。修改后，Canvas 内所有楼层根据配置的 timeRange 重新计算显隐。

用户身份卡：Select (多选)。模拟当前用户身上的标签（如勾选了 "VIP"）。

B. 渲染逻辑 (Canvas 内部)
JavaScript
// 伪代码逻辑：决定某张图片是否显示
const shouldShowImage = (imageConfig, simulationContext) => {
  const { currentTime, userTags } = simulationContext;
  
  // 1. 时间校验
  if (now < imageConfig.startTime || now > imageConfig.endTime) return false;
  
  // 2. 标签校验 (交集逻辑)
  // 如果图片配置了标签，则要求用户必须拥有其中至少一个标签
  if (imageConfig.targetTags.length > 0) {
    const hasIntersection = imageConfig.targetTags.some(tag => userTags.includes(tag));
    if (!hasIntersection) return false;
  }
  
  return true;
};
C. 楼层互斥逻辑实现
在渲染 PageSchema.floors 列表前，进行一次预处理：

按 mutexGroupId 分组。

组内仅保留 index 最小（或配置优先级最高）的那个楼层。

其余互斥楼层在 Canvas 中渲染为“半透明/被折叠”状态，并提示“因互斥规则被隐藏”，方便客户经理理解。

5. 验收标准 (DoD)
配置能力：可以添加一个广告楼层，上传 3 张图片，分别为它们设置不同的跳转链接和生效时间。

校验能力：

如果不填“跳转地址”但选了“H5跳转”，无法保存。

如果配置了PC端，图片必须符合 PC 端比例要求。

预览能力：

切换到 PC 视图，楼层宽度变宽，样式响应式调整。

在顶部修改“模拟时间”为未来时间，已过期的活动图片自动消失。

联动能力：选择“无跳转”时，URL 输入框自动消失。