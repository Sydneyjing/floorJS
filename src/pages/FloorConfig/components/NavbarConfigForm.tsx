import React from 'react';
import { Form, Input, InputNumber, Select, ColorPicker, Space, Card } from 'antd';
import type { NavbarConfig, NavbarPosition, Channel } from '../../../types';
import { useFloorStore } from '../../../store/useFloorStore';
import type { Color } from 'antd/es/color-picker';

interface NavbarConfigFormProps {
    channel: Channel;
    floorId: string;
}

const NavbarConfigForm: React.FC<NavbarConfigFormProps> = ({ channel, floorId }) => {
    const { getFloorById, updateNavbarConfig } = useFloorStore();
    const floor = getFloorById(channel, floorId);
    const navbarConfig = floor?.navbarConfig;

    if (!navbarConfig) {
        return null;
    }

    const handleConfigChange = (field: keyof NavbarConfig, value: any) => {
        updateNavbarConfig(channel, floorId, { [field]: value });
    };

    const handleColorChange = (field: 'backgroundColor' | 'textColor' | 'activeColor', color: Color) => {
        handleConfigChange(field, color.toHexString());
    };

    const positionOptions = [
        { value: 'top' as NavbarPosition, label: '顶部' },
        { value: 'bottom' as NavbarPosition, label: '底部' },
    ];

    return (
        <Card size="small" title="导航栏基础配置" style={{ marginBottom: 16 }}>
            <Form layout="vertical">
                <Form.Item label="位置">
                    <Select
                        value={navbarConfig.position}
                        options={positionOptions}
                        onChange={(value) => handleConfigChange('position', value)}
                    />
                </Form.Item>

                <Form.Item label="高度（px）">
                    <InputNumber
                        value={navbarConfig.height}
                        min={40}
                        max={100}
                        style={{ width: '100%' }}
                        onChange={(value) => handleConfigChange('height', value || 56)}
                    />
                </Form.Item>

                <Form.Item label="背景颜色">
                    <ColorPicker
                        value={navbarConfig.backgroundColor}
                        onChange={(color) => handleColorChange('backgroundColor', color)}
                        showText
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="背景图URL（可选）">
                    <Input
                        value={navbarConfig.backgroundImage}
                        placeholder="https://..."
                        onChange={(e) => handleConfigChange('backgroundImage', e.target.value)}
                        allowClear
                    />
                </Form.Item>

                <Space direction="horizontal" style={{ width: '100%' }} size="large">
                    <Form.Item label="文字颜色" style={{ marginBottom: 0 }}>
                        <ColorPicker
                            value={navbarConfig.textColor}
                            onChange={(color) => handleColorChange('textColor', color)}
                            showText
                        />
                    </Form.Item>

                    <Form.Item label="选中态颜色" style={{ marginBottom: 0 }}>
                        <ColorPicker
                            value={navbarConfig.activeColor}
                            onChange={(color) => handleColorChange('activeColor', color)}
                            showText
                        />
                    </Form.Item>
                </Space>

                <Form.Item label="图标大小（px）">
                    <InputNumber
                        value={navbarConfig.iconSize}
                        min={16}
                        max={48}
                        style={{ width: '100%' }}
                        onChange={(value) => handleConfigChange('iconSize', value || 24)}
                    />
                </Form.Item>
            </Form>
        </Card>
    );
};

export default NavbarConfigForm;
