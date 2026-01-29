import React, { useEffect } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    DatePicker,
    Select,
    message,
} from 'antd';
import { useChannelStore } from '../../../store/useChannelStore';
import { useAdFloorStore } from '../../../store/useAdFloorStore';
import dayjs from 'dayjs';

const AdFloorModal = ({
    open,
    editingFloor,
    onClose,
}) => {
    const [form] = Form.useForm();
    const { currentChannel } = useChannelStore();
    const { addAdFloor, updateAdFloor } = useAdFloorStore();

    useEffect(() => {
        if (open) {
            if (editingFloor) {
                // 编辑模式：填充表单数据
                form.setFieldsValue({
                    title: editingFloor.title,
                    imageUrl: editingFloor.imageUrl,
                    linkUrl: editingFloor.linkUrl,
                    priority: editingFloor.priority,
                    startTime: dayjs(editingFloor.startTime),
                    endTime: dayjs(editingFloor.endTime),
                    status: editingFloor.status,
                });
            } else {
                // 新增模式：重置表单
                form.resetFields();
            }
        }
    }, [open, editingFloor, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formData = {
                title: values.title,
                imageUrl: values.imageUrl,
                linkUrl: values.linkUrl,
                priority: values.priority,
                startTime: values.startTime.format('YYYY-MM-DD HH:mm:ss'),
                endTime: values.endTime.format('YYYY-MM-DD HH:mm:ss'),
                status: values.status,
            };

            if (editingFloor) {
                updateAdFloor(editingFloor.id, formData);
                message.success('更新成功');
            } else {
                addAdFloor(formData, currentChannel);
                message.success('新增成功');
            }

            onClose();
        } catch (error) {
            console.error('表单验证失败:', error);
        }
    };

    const handleCancel = () => {
        onClose();
    };

    return (
        <Modal
            title={editingFloor ? '编辑广告楼层' : '新增广告楼层'}
            open={open}
            onOk={handleOk}
            onCancel={handleCancel}
            width={600}
            okText="确定"
            cancelText="取消"
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    priority: 1,
                    status: 'active',
                }}
            >
                <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: '请输入标题' }]}
                >
                    <Input placeholder="请输入广告标题" />
                </Form.Item>

                <Form.Item
                    label="图片地址"
                    name="imageUrl"
                    rules={[
                        { required: true, message: '请输入图片地址' },
                        { type: 'url', message: '请输入有效的URL地址' },
                    ]}
                >
                    <Input placeholder="https://example.com/image.jpg" />
                </Form.Item>

                <Form.Item
                    label="链接地址"
                    name="linkUrl"
                    rules={[
                        { required: true, message: '请输入链接地址' },
                        { type: 'url', message: '请输入有效的URL地址' },
                    ]}
                >
                    <Input placeholder="https://example.com/page" />
                </Form.Item>

                <Form.Item
                    label="优先级"
                    name="priority"
                    rules={[{ required: true, message: '请输入优先级' }]}
                    tooltip="数字越小优先级越高"
                >
                    <InputNumber min={1} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="开始时间"
                    name="startTime"
                    rules={[{ required: true, message: '请选择开始时间' }]}
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
                >
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

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
        </Modal>
    );
};

export default AdFloorModal;
