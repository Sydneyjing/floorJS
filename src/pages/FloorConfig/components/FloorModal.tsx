import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    Tabs,
    Space,
    message,
} from 'antd';
import type { Channel, FloorFormData } from '../../../types';
import { FLOOR_TYPE_OPTIONS, CUSTOMER_SEGMENT_OPTIONS } from '../../../types';
import { useFloorStore } from '../../../store/useFloorStore';
import ImageManager from './ImageManager';
import NavbarConfigForm from './NavbarConfigForm';
import NavbarItemManager from './NavbarItemManager';
import dayjs from 'dayjs';

interface FloorModalProps {
    open: boolean;
    channel: Channel;
    floorId?: string;
    onClose: () => void;
}

const FloorModal: React.FC<FloorModalProps> = ({
    open,
    channel,
    floorId,
    onClose,
}) => {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('basic');
    const { getFloorById, addFloor, updateFloor } = useFloorStore();
    const floor = floorId ? getFloorById(channel, floorId) : undefined;
    const isEdit = !!floorId;

    useEffect(() => {
        if (open) {
            if (floor) {
                // 编辑模式
                form.setFieldsValue({
                    name: floor.name,
                    type: floor.type,
                    customerSegments: floor.customerSegments,
                    startTime: dayjs(floor.startTime),
                    endTime: dayjs(floor.endTime),
                    status: floor.status,
                });
                setActiveTab('basic');
            } else {
                // 新增模式
                form.resetFields();
                setActiveTab('basic');
            }
        }
    }, [open, floor, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData: FloorFormData = {
                name: values.name,
                type: values.type,
                customerSegments: values.customerSegments,
                startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
                status: values.status,
            };

            if (isEdit && floorId) {
                updateFloor(channel, floorId, formData);
                message.success('更新成功');
            } else {
                addFloor(channel, formData);
                message.success('新增成功');
            }

            onClose();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const tabItems = [
        {
            key: 'basic',
            label: '基本信息',
            children: (
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        type: 'banner',
                        customerSegments: ['all'],
                        status: 'active',
                    }}
                >
                    <Form.Item
                        label="楼层名称"
                        name="name"
                        rules={[{ required: true, message: '请输入楼层名称' }]}
                    >
                        <Input placeholder="请输入楼层名称" />
                    </Form.Item>

                    <Form.Item
                        label="楼层类型"
                        name="type"
                        rules={[{ required: true, message: '请选择楼层类型' }]}
                    >
                        <Select placeholder="请选择楼层类型">
                            {FLOOR_TYPE_OPTIONS.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.icon} {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="目标客群"
                        name="customerSegments"
                        rules={[{ required: true, message: '请选择目标客群' }]}
                    >
                        <Select
                            mode="multiple"
                            placeholder="请选择目标客群"
                            maxTagCount="responsive"
                        >
                            {CUSTOMER_SEGMENT_OPTIONS.map((option) => (
                                <Select.Option key={option.value} value={option.value}>
                                    {option.label}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Space style={{ width: '100%' }} size="large">
                        <Form.Item
                            label="开始时间"
                            name="startTime"
                            rules={[{ required: true, message: '请选择开始时间' }]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            label="结束时间"
                            name="endTime"
                            rules={[
                                { required: true, message: '请选择结束时间' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || !getFieldValue('startTime')) {
                                            return Promise.resolve();
                                        }
                                        if (value.isAfter(getFieldValue('startTime'))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('结束时间必须晚于开始时间'));
                                    },
                                }),
                            ]}
                            style={{ flex: 1 }}
                        >
                            <DatePicker
                                showTime
                                format="YYYY-MM-DD HH:mm:ss"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                    </Space>

                    <Form.Item
                        label="状态"
                        name="status"
                        rules={[{ required: true, message: '请选择状态' }]}
                    >
                        <Select>
                            <Select.Option value="active">启用</Select.Option>
                            <Select.Option value="inactive">禁用</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            ),
        },
        // 根据楼层类型动态添加第二个tab
        ...(floor && floor.type === 'navbar' ? [{
            key: 'navbar',
            label: `导航栏配置`,
            children: isEdit && floorId ? (
                <>
                    <NavbarConfigForm channel={channel} floorId={floorId} />
                    <NavbarItemManager channel={channel} floorId={floorId} />
                </>
            ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    请先保存楼层基本信息后再配置导航栏
                </div>
            ),
            disabled: !isEdit,
        }] : []),
        // 非导航栏类型或新建楼层时显示图片管理
        ...(!floor || floor.type !== 'navbar' ? [{
            key: 'images',
            label: `图片管理${floor ? ` (${floor.images.length})` : ''} `,
            children: isEdit && floorId ? (
                <ImageManager channel={channel} floorId={floorId} />
            ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                    请先保存楼层基本信息后再添加图片
                </div>
            ),
            disabled: !isEdit,
        }] : []),
    ];


    return (
        <Modal
            title={isEdit ? '编辑楼层' : '新增楼层'}
            open={open}
            onOk={handleOk}
            onCancel={onClose}
            width={700}
            okText="确定"
            cancelText="取消"
        >
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                items={tabItems}
            />
        </Modal>
    );
};

export default FloorModal;
