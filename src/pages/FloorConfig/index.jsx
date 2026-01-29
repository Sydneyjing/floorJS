import React, { useState } from 'react';
import { Layout, Typography, Space, Button, Select, Tag } from 'antd';
import { PlusOutlined, MobileOutlined, LaptopOutlined } from '@ant-design/icons';
import { useChannelStore } from '../../store/useChannelStore';
import { useFloorStore } from '../../store/useFloorStore';
import { CUSTOMER_SEGMENT_OPTIONS } from '../../types';
import FloorList from './components/FloorList';
import FloorModal from './components/FloorModal';
import PreviewPanel from './components/PreviewPanel';
import './styles.css';

const { Title } = Typography;
const { Sider, Content } = Layout;

const FloorConfig = () => {
    const { currentChannel } = useChannelStore();
    const { getFloors } = useFloorStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFloorId, setEditingFloorId] = useState();
    const [selectedSegment, setSelectedSegment] = useState('all');

    const floors = getFloors(currentChannel);

    const handleAddFloor = () => {
        setEditingFloorId(undefined);
        setIsModalOpen(true);
    };

    const handleEditFloor = (floorId) => {
        setEditingFloorId(floorId);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingFloorId(undefined);
    };

    return (
        <div className="floor-config-container">
            <div className="floor-config-header">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Title level={3} style={{ margin: 0 }}>
                            楼层配置 -{' '}
                            {currentChannel === 'mobile' ? (
                                <Space>
                                    <MobileOutlined />
                                    手机银行
                                </Space>
                            ) : (
                                <Space>
                                    <LaptopOutlined />
                                    网上银行
                                </Space>
                            )}
                        </Title>
                        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFloor}>
                            新增楼层
                        </Button>
                    </div>
                    <Space>
                        <span>客群筛选：</span>
                        <Select
                            value={selectedSegment}
                            onChange={setSelectedSegment}
                            style={{ width: 150 }}
                        >
                            {CUSTOMER_SEGMENT_OPTIONS.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    <Tag color={option.color}>{option.label}</Tag>
                                </Select.Option>
                            ))}
                        </Select>
                        <Tag color="blue">共 {floors.length} 个楼层</Tag>
                    </Space>
                </Space>
            </div>

            <Layout className="floor-config-layout">
                <Content className="floor-config-content">
                    <FloorList
                        channel={currentChannel}
                        selectedSegment={selectedSegment}
                        onEditFloor={handleEditFloor}
                    />
                </Content>
                <Sider width={400} theme="light" className="floor-config-sider">
                    <PreviewPanel channel={currentChannel} selectedSegment={selectedSegment} />
                </Sider>
            </Layout>

            <FloorModal
                open={isModalOpen}
                channel={currentChannel}
                floorId={editingFloorId}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default FloorConfig;
