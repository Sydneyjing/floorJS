import React from 'react';
import { Card, Row, Col, Statistic, Typography, Space, Button } from 'antd';
import {
    PictureOutlined,
    MobileOutlined,
    LaptopOutlined,
    RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useChannelStore } from '../../store/useChannelStore';
import { useAdFloorStore } from '../../store/useAdFloorStore';

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
    const navigate = useNavigate();
    const { currentChannel } = useChannelStore();
    const { adFloors } = useAdFloorStore();

    const mobileFloors = adFloors.filter((f) => f.channel === 'mobile');
    const webFloors = adFloors.filter((f) => f.channel === 'web');
    const activeFloors = adFloors.filter((f) => f.status === 'active');

    return (
        <div>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                    <Title level={2}>欢迎使用楼层配置管理系统</Title>
                    <Paragraph type="secondary">
                        当前渠道：
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
                    </Paragraph>
                </div>

                <Row gutter={16}>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="手机银行楼层"
                                value={mobileFloors.length}
                                prefix={<MobileOutlined />}
                                suffix="个"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="网上银行楼层"
                                value={webFloors.length}
                                prefix={<LaptopOutlined />}
                                suffix="个"
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card>
                            <Statistic
                                title="活跃楼层"
                                value={activeFloors.length}
                                prefix={<PictureOutlined />}
                                suffix="个"
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Card title="快捷入口" bordered={false}>
                    <Space size="middle">
                        <Button
                            type="primary"
                            icon={<PictureOutlined />}
                            onClick={() => navigate('/adfloor')}
                        >
                            广告楼层配置
                            <RightOutlined />
                        </Button>
                    </Space>
                </Card>
            </Space>
        </div>
    );
};

export default Home;
