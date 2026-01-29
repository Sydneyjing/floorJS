import type { AdFloor, Floor, FloorImage } from '../types';
import dayjs from 'dayjs';

/**
 * 将旧版 AdFloor 数据迁移到新版 Floor 格式
 */
export function migrateAdFloorToFloor(adFloor: AdFloor): Floor {
    return {
        id: adFloor.id,
        name: adFloor.title,
        type: 'ad',
        images: [
            {
                id: `${adFloor.id}-img-1`,
                url: adFloor.imageUrl,
                linkUrl: adFloor.linkUrl,
                alt: adFloor.title,
                order: 1,
            },
        ],
        customerSegments: ['all'],
        priority: adFloor.priority,
        startTime: adFloor.startTime,
        endTime: adFloor.endTime,
        status: adFloor.status,
        createdAt: adFloor.createdAt,
        updatedAt: adFloor.updatedAt,
    };
}

/**
 * 将新版 Floor 数据转换为旧版 AdFloor 格式（用于向后兼容）
 */
export function convertFloorToAdFloor(floor: Floor, channel: 'mobile' | 'web'): AdFloor {
    const firstImage = floor.images[0];
    return {
        id: floor.id,
        channel,
        title: floor.name,
        imageUrl: firstImage?.url || '',
        linkUrl: firstImage?.linkUrl || '',
        priority: floor.priority,
        startTime: floor.startTime,
        endTime: floor.endTime,
        status: floor.status,
        createdAt: floor.createdAt,
        updatedAt: floor.updatedAt,
    };
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 获取当前时间字符串
 */
export function getCurrentTimeString(): string {
    return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 重新排序数组项的 order 字段
 */
export function reorderItems<T extends { order: number }>(items: T[]): T[] {
    return items.map((item, index) => ({
        ...item,
        order: index + 1,
    }));
}

/**
 * 按 order 字段排序
 */
export function sortByOrder<T extends { order: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.order - b.order);
}

/**
 * 按 priority 字段排序
 */
export function sortByPriority<T extends { priority: number }>(items: T[]): T[] {
    return [...items].sort((a, b) => a.priority - b.priority);
}
