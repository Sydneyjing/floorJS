import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Channel } from '../types';

interface ChannelState {
    currentChannel: Channel;
    setChannel: (channel: Channel) => void;
}

// 使用 Zustand 创建渠道状态管理
export const useChannelStore = create<ChannelState>()(
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
