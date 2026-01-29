import React from 'react';
import { Layout, Menu, Select, Typography, Space } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
    HomeOutlined,
    PictureOutlined,
    MobileOutlined,
    LaptopOutlined,
} from '@ant-design/icons';
import { useChannelStore } from '../store/useChannelStore';
import type { Channel } from '../types';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentChannel, setChannel } = useChannelStore();

    const menuItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: '首页',
        },
        {
            key: '/floor-config',
            icon: <PictureOutlined />,
            label: '楼层配置（新）',
        },
        {
            key: '/adfloor',
            icon: <PictureOutlined />,
            label: '广告楼层（旧）',
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    const handleChannelChange = (value: Channel) => {
        setChannel(value);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: '#001529',
                    padding: '0 24px',
                }}
            >
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    楼层配置管理系统
                </Title>
                <Space>
                    <span style={{ color: 'rgba(255, 255, 255, 0.65)' }}>当前渠道：</span>
                    <Select
                        value={currentChannel}
                        onChange={handleChannelChange}
                        style={{ width: 120 }}
                        options={[
                            {
                                value: 'mobile',
                                label: (
                                    <Space>
                                        <MobileOutlined />
                                        手机银行
                                    </Space>
                                ),
                            },
                            {
                                value: 'web',
                                label: (
                                    <Space>
                                        <LaptopOutlined />
                                        网上银行
                                    </Space>
                                ),
                            },
                        ]}
                    />
                </Space>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        style={{ height: '100%', borderRight: 0 }}
                    />
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content
                        style={{
                            background: '#fff',
                            padding: 24,
                            margin: 0,
                            minHeight: 280,
                            borderRadius: 8,
                        }}
                    >
                        <Outlet />
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
