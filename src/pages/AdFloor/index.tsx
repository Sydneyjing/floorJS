import React, { useState } from 'react';
import {
    Table,
    Button,
    Space,
    Tag,
    Popconfirm,
    Typography,
    Image,
    message,
} from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    MobileOutlined,
    LaptopOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useChannelStore } from '../../store/useChannelStore';
import { useAdFloorStore } from '../../store/useAdFloorStore';
import type { AdFloor } from '../../types';
import AdFloorModal from './components/AdFloorModal';
import dayjs from 'dayjs';

const { Title } = Typography;

const AdFloorPage: React.FC = () => {
    const { currentChannel } = useChannelStore();
    const { getAdFloorsByChannel, deleteAdFloor } = useAdFloorStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFloor, setEditingFloor] = useState<AdFloor | undefined>();

    const adFloors = getAdFloorsByChannel(currentChannel);

    const handleAdd = () => {
        setEditingFloor(undefined);
        setIsModalOpen(true);
    };

    const handleEdit = (record: AdFloor) => {
        setEditingFloor(record);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        deleteAdFloor(id);
        message.success('删除成功');
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingFloor(undefined);
    };

    const columns: ColumnsType<AdFloor> = [
        {
            title: '优先级',
            dataIndex: 'priority',
            key: 'priority',
            width: 80,
            sorter: (a, b) => a.priority - b.priority,
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
            width: 200,
        },
        {
            title: '图片',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 120,
            render: (url: string) => (
                <Image src={url} width={80} height={40} style={{ objectFit: 'cover' }} />
            ),
        },
        {
            title: '链接地址',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
            ellipsis: true,
            render: (url: string) => (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                </a>
            ),
        },
        {
            title: '开始时间',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 180,
            render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '结束时间',
            dataIndex: 'endTime',
            key: 'endTime',
            width: 180,
            render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status === 'active' ? '启用' : '禁用'}
                </Tag>
            ),
        },
        {
            title: '操作',
            key: 'action',
            width: 150,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                    >
                        编辑
                    </Button>
                    <Popconfirm
                        title="确定删除吗？"
                        onConfirm={() => handleDelete(record.id)}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button type="link" danger icon={<DeleteOutlined />}>
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space
                direction="vertical"
                size="large"
                style={{ width: '100%', marginBottom: 16 }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Title level={3} style={{ margin: 0 }}>
                        广告楼层配置 -{' '}
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
                    <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                        新增广告楼层
                    </Button>
                </div>
            </Space>

            <Table
                columns={columns}
                dataSource={adFloors}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `共 ${total} 条`,
                }}
                scroll={{ x: 1200 }}
            />

            <AdFloorModal
                open={isModalOpen}
                editingFloor={editingFloor}
                onClose={handleModalClose}
            />
        </div>
    );
};

export default AdFloorPage;
