import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { DragEndEvent } from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Button,
    Space,
    Input,
    Image,
    Popconfirm,
    Empty,
    message,
    Card,
    Select,
    DatePicker,
    Form,
    Tag,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    HolderOutlined,
    SaveOutlined,
    CloseOutlined,
} from '@ant-design/icons';
import { useFloorStore } from '../../../store/useFloorStore';
import { Channel, FloorImage, FloorImageFormData } from '../../../types';
import { ACTION_TYPE_OPTIONS, USER_TAG_OPTIONS } from '../../../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface ImageManagerProps {
    channel: Channel;
    floorId: string;
}

interface ImageItemProps {
    image: FloorImage;
    onEdit: (image: FloorImage) => void;
    onDelete: (imageId: string) => void;
}

const ImageItem = ({ image, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: image.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const actionTypeLabel = ACTION_TYPE_OPTIONS.find(opt => opt.value === image.action?.type)?.label || '未知';

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`image-manager-item ${isDragging ? 'dragging' : ''}`}
        >
            <div
                className="floor-item-drag-handle"
                {...attributes}
                {...listeners}
            >
                <HolderOutlined />
            </div>
            <Image
                src={image.url}
                alt={image.alt}
                className="image-manager-item-preview"
                preview={{
                    mask: <div>预览</div>,
                }}
            />
            <div className="image-manager-item-info">
                <div style={{ marginBottom: 4 }}>
                    <Tag color="blue">{actionTypeLabel}</Tag>
                    {image.action?.type !== 'none' && (
                        <span style={{ fontSize: 12, color: '#666' }}>
                            {image.action?.targetUrl}
                        </span>
                    )}
                </div>
                {image.strategy?.targetTags && image.strategy.targetTags.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                        {image.strategy.targetTags.map(tag => (
                            <Tag key={tag} color="gold" style={{ fontSize: 11 }}>
                                {USER_TAG_OPTIONS.find(opt => opt.value === tag)?.label || tag}
                            </Tag>
                        ))}
                    </div>
                )}
                <div style={{ color: '#999', fontSize: 12 }}>
                    {image.alt || '无描�?}
                </div>
            </div>
            <div className="image-manager-item-actions">
                <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(image)}
                >
                    编辑
                </Button>
                <Popconfirm
                    title="确定删除此图片吗�?
                    onConfirm={() => onDelete(image.id)}
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
            </div>
        </div>
    );
};

const ImageManager = ({ channel, floorId }) => {
    const {
        getFloorById,
        addImageToFloor,
        updateFloorImage,
        deleteFloorImage,
        reorderFloorImages,
    } = useFloorStore();

    const floor = getFloorById(channel, floorId);
    const images = floor?.images || [];

    const [isAdding, setIsAdding] = useState(false);
    const [editingImage, setEditingImage] = useState<FloorImage | null>(null);
    const [form] = Form.useForm();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = images.findIndex((img) => img.id === active.id);
            const newIndex = images.findIndex((img) => img.id === over.id);

            const reorderedImages = arrayMove(images, oldIndex, newIndex);
            const imageIds = reorderedImages.map((img) => img.id);
            reorderFloorImages(channel, floorId, imageIds);
        }
    };

    const handleAdd = () => {
        setIsAdding(true);
        setEditingImage(null);
        form.resetFields();
        form.setFieldsValue({
            actionType: 'none',
            targetTags: [],
        });
    };

    const handleEdit = (image: FloorImage) => {
        setEditingImage(image);
        setIsAdding(false);
        form.setFieldsValue({
            url: image.url,
            alt: image.alt,
            actionType: image.action.type,
            targetUrl: image.action.targetUrl,
            timeRange: image.strategy.timeRange ? [
                dayjs(image.strategy.timeRange[0]),
                dayjs(image.strategy.timeRange[1])
            ] : null,
            targetTags: image.strategy.targetTags,
            clickId: image.tracking?.clickId,
            exposureId: image.tracking?.exposureId,
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            const formData: FloorImageFormData = {
                url: values.url,
                alt: values.alt || '',
                action: {
                    type: values.actionType,
                    targetUrl: values.actionType !== 'none' ? values.targetUrl : undefined,
                },
                strategy: {
                    priority: 1,
                    timeRange: values.timeRange ? [
                        values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
                        values.timeRange[1].format('YYYY-MM-DD HH:mm:ss')
                    ] : null,
                    targetTags: values.targetTags || [],
                },
                tracking: (values.clickId || values.exposureId) ? {
                    clickId: values.clickId,
                    exposureId: values.exposureId,
                } : undefined,
            };

            if (editingImage) {
                updateFloorImage(channel, floorId, editingImage.id, formData);
                message.success('更新成功');
            } else {
                addImageToFloor(channel, floorId, formData);
                message.success('添加成功');
            }

            setIsAdding(false);
            setEditingImage(null);
            form.resetFields();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingImage(null);
        form.resetFields();
    };

    const handleDelete = (imageId: string) => {
        deleteFloorImage(channel, floorId, imageId);
        message.success('删除成功');
    };

    const actionType = Form.useWatch('actionType', form);

    return (
        <div className="image-manager">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {(isAdding || editingImage) && (
                    <Card size="small" title={editingImage ? '编辑图片' : '添加图片'}>
                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                        >
                            <Form.Item
                                label="图片地址"
                                name="url"
                                rules={[{ required: true, message: '请输入图片地址' }]}
                            >
                                <Input placeholder="https://..." />
                            </Form.Item>

                            <Form.Item
                                label="图片描述"
                                name="alt"
                            >
                                <Input placeholder="图片描述（可选）" />
                            </Form.Item>

                            <Form.Item
                                label="跳转类型"
                                name="actionType"
                                rules={[{ required: true, message: '请选择跳转类型' }]}
                            >
                                <Select
                                    options={ACTION_TYPE_OPTIONS.map(opt => ({
                                        value: opt.value,
                                        label: opt.label,
                                    }))}
                                />
                            </Form.Item>

                            {actionType && actionType !== 'none' && (
                                <Form.Item
                                    label="跳转地址"
                                    name="targetUrl"
                                    rules={[
                                        { required: true, message: '请输入跳转地址' },
                                        {
                                            pattern: actionType === 'h5' ? /^https?:\/\/.+/ : undefined,
                                            message: 'H5跳转必须以http://或https://开�?,
                                        },
                                    ]}
                                >
                                    <Input placeholder={actionType === 'h5' ? 'https://...' : '跳转地址'} />
                                </Form.Item>
                            )}

                            <Form.Item
                                label="生效时间"
                                name="timeRange"
                            >
                                <RangePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    style={{ width: '100%' }}
                                    placeholder={['开始时�?, '结束时间']}
                                />
                            </Form.Item>

                            <Form.Item
                                label="目标客群标签"
                                name="targetTags"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="选择目标客群（可选）"
                                    options={USER_TAG_OPTIONS.map(opt => ({
                                        value: opt.value,
                                        label: opt.label,
                                    }))}
                                />
                            </Form.Item>

                            <Form.Item
                                label="埋点配置（可选）"
                            >
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Form.Item
                                        name="clickId"
                                        noStyle
                                    >
                                        <Input placeholder="点击监测ID" />
                                    </Form.Item>
                                    <Form.Item
                                        name="exposureId"
                                        noStyle
                                    >
                                        <Input placeholder="曝光监测ID" />
                                    </Form.Item>
                                </Space>
                            </Form.Item>

                            <Form.Item>
                                <Space>
                                    <Button
                                        type="primary"
                                        icon={<SaveOutlined />}
                                        onClick={handleSave}
                                    >
                                        保存
                                    </Button>
                                    <Button icon={<CloseOutlined />} onClick={handleCancel}>
                                        取消
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Form>
                    </Card>
                )}

                {!isAdding && !editingImage && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        block
                    >
                        添加图片
                    </Button>
                )}

                {images.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={images.map((img) => img.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="image-manager-list">
                                {images.map((image) => (
                                    <ImageItem
                                        key={image.id}
                                        image={image}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    !isAdding && <Empty description="暂无图片" />
                )}
            </Space>
        </div>
    );
};

export default ImageManager;
