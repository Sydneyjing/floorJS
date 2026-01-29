import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 导入 dayjs 中文语言包
import relativeTime from 'dayjs/plugin/relativeTime'; // 相对时间插件
import updateLocale from 'dayjs/plugin/updateLocale'; // 自定义 locale 插件
import App from './App.jsx';
import './index.css';

// 配置 dayjs 全局中文化
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.locale('zh-cn'); // 设置全局 locale 为中文

// 可选: 自定义相对时间文案
dayjs.updateLocale('zh-cn', {
    relativeTime: {
        future: '%s后',
        past: '%s前',
        s: '几秒',
        m: '1分钟',
        mm: '%d分钟',
        h: '1小时',
        hh: '%d小时',
        d: '1天',
        dd: '%d天',
        M: '1个月',
        MM: '%d个月',
        y: '1年',
        yy: '%d年',
    },
});


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ConfigProvider locale={zhCN}>
            <App />
        </ConfigProvider>
    </StrictMode>
);
