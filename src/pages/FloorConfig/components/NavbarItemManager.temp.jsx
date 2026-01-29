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
import { Channel, NavbarItem } from '../../../types';
import { ACTION_TYPE_OPTIONS } from '../../../types';

interface NavbarItemManagerProps {
    channel: Channel;
    floorId: string;
}

interface NavbarItemProps {
    item: NavbarItem;
    onEdit: (item: NavbarItem) => void;
    onDelete: (itemId: string) => void;
}

const NavbarItemComponent = ({ item, onEdit, onDelete }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const actionTypeLabel = ACTION_TYPE_OPTIONS.find(opt => opt.value === item.action.type)?.label || '未知';

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
                src={item.icon}
                alt={item.text}
                className="image-manager-item-preview"
                preview={{
                    mask: <div>预览</div>,
                }}
            />
            <div className="image-manager-item-info">
                <div style={{ marginBottom: 4 }}>
                    <Tag color="blue">{item.text}</Tag>
                    <Tag color="green">{actionTypeLabel}</Tag>
                </div>
                {item.action.type !== 'none' && (
                    <div style={{ color: '#666', fontSize: 12 }}>
                        {item.action.targetUrl}
                    </div>
                )}
            </div>
            <div className="image-manager-item-actions">
                <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => onEdit(item)}
                >
                    编辑
                </Button>
                <Popconfirm
                    title="确定删除此导航项吗？"
                    onConfirm={() => onDelete(item.id)}
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

const NavbarItemManager = ({ channel, floorId }) => {
    const {
        getFloorById,
        addNavbarItem,
        updateNavbarItem,
        deleteNavbarItem,
        reorderNavbarItems,
    } = useFloorStore();

    const floor = getFloorById(channel, floorId);
    const items = floor?.navbarConfig?.items || [];

    const [isAdding, setIsAdding] = useState(false);
    const [editingItem, setEditingItem] = useState<NavbarItem | null>(null);
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
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            const reorderedItems = arrayMove(items, oldIndex, newIndex);
            const itemIds = reorderedItems.map((item) => item.id);
            reorderNavbarItems(channel, floorId, itemIds);
        }
    };

    const handleAdd = () => {
        if (items.length >= 5) {
            message.warning('导航项数量已达上限（5个）');
            return;
        }
        setIsAdding(true);
        setEditingItem(null);
        form.resetFields();
        form.setFieldsValue({
            actionType: 'none',
        });
    };

    const handleEdit = (item: NavbarItem) => {
        setEditingItem(item);
        setIsAdding(false);
        form.setFieldsValue({
            icon: item.icon,
            activeIcon: item.activeIcon,
            text: item.text,
            actionType: item.action.type,
            targetUrl: item.action.targetUrl,
        });
    };

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            const itemData = {
                icon: values.icon,
                activeIcon: values.activeIcon,
                text: values.text,
                action: {
                    type: values.actionType,
                    targetUrl: values.actionType !== 'none' ? values.targetUrl : undefined,
                },
            };

            if (editingItem) {
                updateNavbarItem(channel, floorId, editingItem.id, itemData);
                message.success('更新成功');
            } else {
                addNavbarItem(channel, floorId, itemData);
                message.success('添加成功');
            }

            setIsAdding(false);
            setEditingItem(null);
            form.resetFields();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingItem(null);
        form.resetFields();
    };

    const handleDelete = (itemId: string) => {
        deleteNavbarItem(channel, floorId, itemId);
        message.success('删除成功');
    };

    const actionType = Form.useWatch('actionType', form);

    return (
        <div className="image-manager">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                {(isAdding || editingItem) && (
                    <Card size="small" title={editingItem ? '编辑导航�? : '添加导航�?}>
                        <Form
                            form={form}
                            layout="vertical"
                            autoComplete="off"
                        >
                            <Form.Item
                                label="导航项文�?
                                name="text"
                                rules={[{ required: true, message: '请输入导航项文字' }]}
                            >
                                <Input placeholder="例如：首�? maxLength={4} />
                            </Form.Item>

                            <Form.Item
                                label="图标URL"
                                name="icon"
                                rules={[{ required: true, message: '请输入图标地址' }]}
                            >
                                <Input placeholder="https://..." />
                            </Form.Item>

                            <Form.Item
                                label="选中态图标URL（可选）"
                                name="activeIcon"
                            >
                                <Input placeholder="https://..." />
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

                {!isAdding && !editingItem && (
                    <Button
                        type="dashed"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        block
                        disabled={items.length >= 5}
                    >
                        添加导航�?({items.length}/5)
                    </Button>
                )}

                {items.length > 0 ? (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={items.map((item) => item.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="image-manager-list">
                                {items.map((item) => (
                                    <NavbarItemComponent
                                        key={item.id}
                                        item={item}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                ) : (
                    !isAdding && <Empty description="暂无导航�? />
                )}
            </Space>
        </div>
    );
};

export default NavbarItemManager;
