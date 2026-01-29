import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Card,
    Space,
    Tag,
    Button,
    Popconfirm,
    Typography,
    Image,
    Collapse,
    message,
} from 'antd';
import {
    HolderOutlined,
    EditOutlined,
    DeleteOutlined,
    CopyOutlined,
    PictureOutlined,
} from '@ant-design/icons';
import { useFloorStore } from '../../../store/useFloorStore';
import type { Floor, Channel } from '../../../types';
import { CUSTOMER_SEGMENT_OPTIONS, FLOOR_TYPE_OPTIONS } from '../../../types';
import dayjs from 'dayjs';

const { Text } = Typography;
const { Panel } = Collapse;

interface FloorItemProps {
    floor: Floor;
    channel: Channel;
    onEdit: () => void;
}

const FloorItem: React.FC<FloorItemProps> = ({ floor, channel, onEdit }) => {
    const { deleteFloor, duplicateFloor } = useFloorStore();
    const [expanded, setExpanded] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: floor.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = () => {
        deleteFloor(channel, floor.id);
        message.success('删除成功');
    };

    const handleDuplicate = () => {
        duplicateFloor(channel, floor.id);
        message.success('复制成功');
    };

    const floorTypeOption = FLOOR_TYPE_OPTIONS.find((opt) => opt.value === floor.type);
    const statusColor = floor.status === 'active' ? 'green' : 'red';
    const statusText = floor.status === 'active' ? '启用' : '禁用';

    return (
        <div ref={setNodeRef} style={style} className="floor-item">
            <div className="floor-item-header">
                <Space>
                    <div
                        className="floor-item-drag-handle"
                        {...attributes}
                        {...listeners}
                    >
                        <HolderOutlined />
                    </div>
                    <Text strong style={{ fontSize: 16 }}>
                        {floorTypeOption?.icon} {floor.name}
                    </Text>
                    <Tag color="blue">优先级: {floor.priority}</Tag>
                    <Tag color={statusColor}>{statusText}</Tag>
                </Space>
                <Space>
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={onEdit}
                    >
                        编辑
                    </Button>
                    <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={handleDuplicate}
                    >
                        复制
                    </Button>
                    <Popconfirm
                        title="确定删除此楼层吗？"
                        onConfirm={handleDelete}
                        okText="确定"
                        cancelText="取消"
                    >
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                        >
                            删除
                        </Button>
                    </Popconfirm>
                </Space>
            </div>

            <div className="floor-item-content">
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <Space wrap>
                        <Text type="secondary">类型:</Text>
                        <Tag>{floorTypeOption?.label}</Tag>
                        <Text type="secondary">客群:</Text>
                        {floor.customerSegments.map((segment) => {
                            const option = CUSTOMER_SEGMENT_OPTIONS.find(
                                (opt) => opt.value === segment
                            );
                            return (
                                <Tag key={segment} color={option?.color}>
                                    {option?.label}
                                </Tag>
                            );
                        })}
                    </Space>

                    <Space>
                        <Text type="secondary">
                            时间: {dayjs(floor.startTime).format('YYYY-MM-DD')} ~{' '}
                            {dayjs(floor.endTime).format('YYYY-MM-DD')}
                        </Text>
                    </Space>

                    <Collapse
                        ghost
                        activeKey={expanded ? ['images'] : []}
                        onChange={(keys) => setExpanded(keys.includes('images'))}
                    >
                        <Panel
                            header={
                                <Space>
                                    <PictureOutlined />
                                    <Text>图片列表 ({floor.images.length})</Text>
                                </Space>
                            }
                            key="images"
                        >
                            {floor.images.length > 0 ? (
                                <div className="floor-item-images">
                                    {floor.images.map((image) => (
                                        <Image
                                            key={image.id}
                                            src={image.url}
                                            alt={image.alt}
                                            className="floor-item-image-preview"
                                            preview={{
                                                mask: <div>预览</div>,
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <Text type="secondary">暂无图片</Text>
                            )}
                        </Panel>
                    </Collapse>
                </Space>
            </div>
        </div>
    );
};

export default FloorItem;
