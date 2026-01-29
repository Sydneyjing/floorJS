import React from 'react';
import { Typography, Space, Tag, Divider, DatePicker, Select, Card } from 'antd';
import { ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useFloorStore } from '../../../store/useFloorStore';
import { USER_TAG_OPTIONS } from '../../../types';
import FloorRenderer from '../../../components/Preview/FloorRenderer';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const PreviewPanel = ({ channel, selectedSegment }) => {
    const {
        getFloorsBySegment,
        simulationTime,
        simulationUserTags,
        setSimulationTime,
        setSimulationUserTags,
    } = useFloorStore();

    const floors = getFloorsBySegment(channel, selectedSegment);

    return (
        <div className="preview-panel">
            <div className="preview-panel-header">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Title level={4} style={{ margin: 0 }}>
                        实时预览
                    </Title>
                    <Space>
                        <Text type="secondary">渠道:</Text>
                        <Tag color={channel === 'mobile' ? 'blue' : 'green'}>
                            {channel === 'mobile' ? '手机银行' : '网上银行'}
                        </Tag>
                        <Text type="secondary">客群:</Text>
                        <Tag color="purple">{selectedSegment}</Tag>
                    </Space>
                </Space>
            </div>

            <Divider style={{ margin: '12px 0' }} />

            {/* 模拟环境控制 */}
            <Card size="small" title="模拟环境" style={{ marginBottom: 16 }}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <div>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary">
                                <ClockCircleOutlined /> 模拟时间
                            </Text>
                            <DatePicker
                                showTime
                                value={dayjs(simulationTime)}
                                onChange={(date) => {
                                    if (date) {
                                        setSimulationTime(date.format('YYYY-MM-DD HH:mm:ss'));
                                    }
                                }}
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                                placeholder="选择模拟时间"
                            />
                        </Space>
                    </div>

                    <div>
                        <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary">
                                <UserOutlined /> 模拟用户标签
                            </Text>
                            <Select
                                mode="multiple"
                                value={simulationUserTags}
                                onChange={setSimulationUserTags}
                                placeholder="选择用户标签"
                                style={{ width: '100%' }}
                                options={USER_TAG_OPTIONS.map(opt => ({
                                    value: opt.value,
                                    label: opt.label,
                                }))}
                            />
                        </Space>
                    </div>
                </Space>
            </Card>

            <Divider style={{ margin: '12px 0' }} />

            <div className="preview-panel-content">
                <div className={`preview-device-frame ${channel}`}>
                    {floors.length > 0 ? (
                        floors.map((floor) => (
                            <div key={floor.id} className="preview-floor">
                                <FloorRenderer floor={floor} channel={channel} />
                            </div>
                        ))
                    ) : (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#999' }}>
                            暂无楼层配置
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPanel;
