import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdFloor, AdFloorFormData, Channel } from '../types';
import dayjs from 'dayjs';

interface AdFloorState {
    adFloors: AdFloor[];
    addAdFloor: (data: AdFloorFormData, channel: Channel) => void;
    updateAdFloor: (id: string, data: AdFloorFormData) => void;
    deleteAdFloor: (id: string) => void;
    getAdFloorsByChannel: (channel: Channel) => AdFloor[];
    getAdFloorById: (id: string) => AdFloor | undefined;
}

// 使用 Zustand 创建广告楼层状态管理
export const useAdFloorStore = create<AdFloorState>()(
    persist(
        (set, get) => ({
            adFloors: [
                // 初始化一些示例数据
                {
                    id: '1',
                    channel: 'mobile',
                    title: '春节大促',
                    imageUrl: 'https://via.placeholder.com/800x400?text=Spring+Festival',
                    linkUrl: 'https://example.com/spring-festival',
                    priority: 1,
                    startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    endTime: dayjs().add(30, 'day').format('YYYY-MM-DD HH:mm:ss'),
                    status: 'active',
                    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                },
                {
                    id: '2',
                    channel: 'web',
                    title: '理财产品推荐',
                    imageUrl: 'https://via.placeholder.com/1200x400?text=Financial+Products',
                    linkUrl: 'https://example.com/financial-products',
                    priority: 1,
                    startTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    endTime: dayjs().add(60, 'day').format('YYYY-MM-DD HH:mm:ss'),
                    status: 'active',
                    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                },
            ],

            addAdFloor: (data, channel) => {
                const newAdFloor: AdFloor = {
                    id: Date.now().toString(),
                    channel,
                    ...data,
                    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                };
                set((state) => ({
                    adFloors: [...state.adFloors, newAdFloor],
                }));
            },

            updateAdFloor: (id, data) => {
                set((state) => ({
                    adFloors: state.adFloors.map((floor) =>
                        floor.id === id
                            ? {
                                ...floor,
                                ...data,
                                updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
                            }
                            : floor
                    ),
                }));
            },

            deleteAdFloor: (id) => {
                set((state) => ({
                    adFloors: state.adFloors.filter((floor) => floor.id !== id),
                }));
            },

            getAdFloorsByChannel: (channel) => {
                return get().adFloors.filter((floor) => floor.channel === channel);
            },

            getAdFloorById: (id) => {
                return get().adFloors.find((floor) => floor.id === id);
            },
        }),
        {
            name: 'adfloor-storage', // localStorage key
        }
    )
);
