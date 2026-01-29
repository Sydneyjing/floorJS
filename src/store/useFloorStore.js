import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    generateId,
    getCurrentTimeString,
    reorderItems,
    sortByPriority,
    sortByOrder,
} from '../utils/dataTransform';
import { DEFAULT_NAVBAR_CONFIG } from '../types';
import dayjs from 'dayjs';

// 创建初始页面配置
const createInitialPageConfig = (channel) => ({
    id: generateId(),
    channel,
    pageName: channel === 'mobile' ? '手机银行首页' : '网上银行首页',
    floors: [
        {
            id: generateId(),
            name: channel === 'mobile' ? '春节大促' : '理财产品推荐',
            type: 'banner',
            images: [
                {
                    id: generateId(),
                    url: `https://via.placeholder.com/${channel === 'mobile' ? '800x400' : '1200x400'}?text=${channel === 'mobile' ? 'Mobile+Banner' : 'Web+Banner'}`,
                    alt: '促销活动',
                    order: 1,
                    action: {
                        type: 'h5',
                        targetUrl: 'https://example.com/promotion',
                    },
                    strategy: {
                        priority: 1,
                        timeRange: null,
                        targetTags: [],
                    },
                },
            ],
            customerSegments: ['all'],
            priority: 1,
            startTime: getCurrentTimeString(),
            endTime: dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
            status: 'active',
            createdAt: getCurrentTimeString(),
            updatedAt: getCurrentTimeString(),
        },
    ],
    createdAt: getCurrentTimeString(),
    updatedAt: getCurrentTimeString(),
});

export const useFloorStore = create()(
    persist(
        (set, get) => ({
            pageConfigs: [
                createInitialPageConfig('mobile'),
                createInitialPageConfig('web'),
            ],

            getPageConfig: (channel) => {
                return get().pageConfigs.find((config) => config.channel === channel);
            },

            getFloors: (channel) => {
                const config = get().getPageConfig(channel);
                return config ? sortByPriority(config.floors) : [];
            },

            getFloorsBySegment: (channel, segment) => {
                const floors = get().getFloors(channel);
                if (segment === 'all') {
                    return floors;
                }
                return floors.filter((floor) =>
                    floor.customerSegments.includes(segment) ||
                    floor.customerSegments.includes('all')
                );
            },

            addFloor: (channel, data) => {
                const newFloor = {
                    id: generateId(),
                    name: data.name,
                    type: data.type,
                    images: [],
                    customerSegments: data.customerSegments,
                    priority: get().getFloors(channel).length + 1,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    status: data.status,
                    createdAt: getCurrentTimeString(),
                    updatedAt: getCurrentTimeString(),
                    // 如果是导航栏类型,初始化默认配置
                    navbarConfig: data.type === 'navbar' ? { ...DEFAULT_NAVBAR_CONFIG } : undefined,
                };

                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: [...config.floors, newFloor],
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            updateFloor: (channel, floorId, data) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) =>
                                    floor.id === floorId
                                        ? {
                                            ...floor,
                                            name: data.name,
                                            type: data.type,
                                            customerSegments: data.customerSegments,
                                            startTime: data.startTime,
                                            endTime: data.endTime,
                                            status: data.status,
                                            updatedAt: getCurrentTimeString(),
                                        }
                                        : floor
                                ),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            deleteFloor: (channel, floorId) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.filter((floor) => floor.id !== floorId),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            duplicateFloor: (channel, floorId) => {
                const floor = get().getFloorById(channel, floorId);
                if (!floor) return;

                const duplicatedFloor = {
                    ...floor,
                    id: generateId(),
                    name: `${floor.name} (副本)`,
                    images: floor.images.map((img) => ({
                        ...img,
                        id: generateId(),
                    })),
                    priority: get().getFloors(channel).length + 1,
                    createdAt: getCurrentTimeString(),
                    updatedAt: getCurrentTimeString(),
                };

                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: [...config.floors, duplicatedFloor],
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            reorderFloors: (channel, floorIds) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) => {
                        if (config.channel !== channel) return config;

                        const floorsMap = new Map(config.floors.map((f) => [f.id, f]));
                        const reorderedFloors = floorIds
                            .map((id) => floorsMap.get(id))
                            .filter((f) => f !== undefined)
                            .map((floor, index) => ({
                                ...floor,
                                priority: index + 1,
                                updatedAt: getCurrentTimeString(),
                            }));

                        return {
                            ...config,
                            floors: reorderedFloors,
                            updatedAt: getCurrentTimeString(),
                        };
                    }),
                }));
            },

            addImageToFloor: (channel, floorId, imageData) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId) return floor;

                                    const newImage = {
                                        id: generateId(),
                                        url: imageData.url,
                                        alt: imageData.alt,
                                        order: floor.images.length + 1,
                                        action: imageData.action,
                                        strategy: imageData.strategy,
                                        tracking: imageData.tracking,
                                    };

                                    return {
                                        ...floor,
                                        images: [...floor.images, newImage],
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            updateFloorImage: (channel, floorId, imageId, imageData) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId) return floor;

                                    return {
                                        ...floor,
                                        images: floor.images.map((img) =>
                                            img.id === imageId
                                                ? {
                                                    ...img,
                                                    url: imageData.url,
                                                    alt: imageData.alt,
                                                    action: imageData.action,
                                                    strategy: imageData.strategy,
                                                    tracking: imageData.tracking,
                                                }
                                                : img
                                        ),
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            deleteFloorImage: (channel, floorId, imageId) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId) return floor;

                                    const updatedImages = floor.images.filter(
                                        (img) => img.id !== imageId
                                    );

                                    return {
                                        ...floor,
                                        images: reorderItems(updatedImages),
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            reorderFloorImages: (channel, floorId, imageIds) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) => {
                        if (config.channel !== channel) return config;

                        return {
                            ...config,
                            floors: config.floors.map((floor) => {
                                if (floor.id !== floorId) return floor;

                                const imagesMap = new Map(floor.images.map((img) => [img.id, img]));
                                const reorderedImages = imageIds
                                    .map((id) => imagesMap.get(id))
                                    .filter((img) => img !== undefined);

                                return {
                                    ...floor,
                                    images: reorderItems(reorderedImages),
                                    updatedAt: getCurrentTimeString(),
                                };
                            }),
                            updatedAt: getCurrentTimeString(),
                        };
                    }),
                }));
            },

            getFloorById: (channel, floorId) => {
                const config = get().getPageConfig(channel);
                return config?.floors.find((floor) => floor.id === floorId);
            },

            // 模拟环境初始值
            simulationTime: getCurrentTimeString(),
            simulationUserTags: [],

            // 设置模拟时间
            setSimulationTime: (time) => {
                set({ simulationTime: time });
            },

            // 设置模拟用户标签
            setSimulationUserTags: (tags) => {
                set({ simulationUserTags: tags });
            },

            // 获取模拟环境上下文
            getSimulationContext: () => {
                const state = get();
                return {
                    currentTime: state.simulationTime,
                    userTags: state.simulationUserTags,
                };
            },

            // 判断图片是否应该显示
            shouldShowImage: (image) => {
                // 数据兼容性检查:如果旧数据没有strategy属性,默认显示
                if (!image.strategy) {
                    return true;
                }

                const { currentTime, userTags } = get().getSimulationContext();

                // 1. 时间校验
                if (image.strategy.timeRange) {
                    const [startTime, endTime] = image.strategy.timeRange;
                    const now = dayjs(currentTime);
                    const start = dayjs(startTime);
                    const end = dayjs(endTime);

                    if (now.isBefore(start) || now.isAfter(end)) {
                        return false;
                    }
                }

                // 2. 标签校验
                if (image.strategy.targetTags && image.strategy.targetTags.length > 0) {
                    // 如果图片配置了标签,则要求用户必须拥有其中至少一个标签
                    const hasIntersection = image.strategy.targetTags.some(tag =>
                        userTags.includes(tag)
                    );
                    if (!hasIntersection) {
                        return false;
                    }
                }

                return true;
            },

            // ==================== 导航栏相关 ====================

            // 更新导航栏配置
            updateNavbarConfig: (channel, floorId, config) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((pageConfig) =>
                        pageConfig.channel === channel
                            ? {
                                ...pageConfig,
                                floors: pageConfig.floors.map((floor) =>
                                    floor.id === floorId
                                        ? {
                                            ...floor,
                                            navbarConfig: {
                                                ...floor.navbarConfig,
                                                ...config,
                                            },
                                            updatedAt: getCurrentTimeString(),
                                        }
                                        : floor
                                ),
                                updatedAt: getCurrentTimeString(),
                            }
                            : pageConfig
                    ),
                }));
            },

            // 添加导航项
            addNavbarItem: (channel, floorId, item) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId || !floor.navbarConfig) return floor;

                                    // 限制最多5个导航项
                                    if (floor.navbarConfig.items.length >= 5) {
                                        console.warn('导航项数量已达上限(5个)');
                                        return floor;
                                    }

                                    const newItem = {
                                        id: generateId(),
                                        ...item,
                                        order: floor.navbarConfig.items.length + 1,
                                    };

                                    return {
                                        ...floor,
                                        navbarConfig: {
                                            ...floor.navbarConfig,
                                            items: [...floor.navbarConfig.items, newItem],
                                        },
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            // 更新导航项
            updateNavbarItem: (channel, floorId, itemId, item) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId || !floor.navbarConfig) return floor;

                                    return {
                                        ...floor,
                                        navbarConfig: {
                                            ...floor.navbarConfig,
                                            items: floor.navbarConfig.items.map((navItem) =>
                                                navItem.id === itemId
                                                    ? { ...navItem, ...item }
                                                    : navItem
                                            ),
                                        },
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            // 删除导航项
            deleteNavbarItem: (channel, floorId, itemId) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) =>
                        config.channel === channel
                            ? {
                                ...config,
                                floors: config.floors.map((floor) => {
                                    if (floor.id !== floorId || !floor.navbarConfig) return floor;

                                    const updatedItems = floor.navbarConfig.items.filter(
                                        (item) => item.id !== itemId
                                    );

                                    return {
                                        ...floor,
                                        navbarConfig: {
                                            ...floor.navbarConfig,
                                            items: reorderItems(updatedItems),
                                        },
                                        updatedAt: getCurrentTimeString(),
                                    };
                                }),
                                updatedAt: getCurrentTimeString(),
                            }
                            : config
                    ),
                }));
            },

            // 重新排序导航项
            reorderNavbarItems: (channel, floorId, itemIds) => {
                set((state) => ({
                    pageConfigs: state.pageConfigs.map((config) => {
                        if (config.channel !== channel) return config;

                        return {
                            ...config,
                            floors: config.floors.map((floor) => {
                                if (floor.id !== floorId || !floor.navbarConfig) return floor;

                                const itemsMap = new Map(
                                    floor.navbarConfig.items.map((item) => [item.id, item])
                                );
                                const reorderedItems = itemIds
                                    .map((id) => itemsMap.get(id))
                                    .filter((item) => item !== undefined);

                                return {
                                    ...floor,
                                    navbarConfig: {
                                        ...floor.navbarConfig,
                                        items: reorderItems(reorderedItems),
                                    },
                                    updatedAt: getCurrentTimeString(),
                                };
                            }),
                            updatedAt: getCurrentTimeString(),
                        };
                    }),
                }));
            },
        }),
        {
            name: 'floor-storage',
        }
    )
);
