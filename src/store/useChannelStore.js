import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 使用 Zustand 创建渠道状态管理
export const useChannelStore = create()(
    persist(
        (set) => ({
            currentChannel: 'mobile',
            setChannel: (channel) => set({ currentChannel: channel }),
        }),
        {
            name: 'channel-storage', // localStorage key
        }
    )
);
