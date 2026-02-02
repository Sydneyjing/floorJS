import React, { useState } from 'react';
import { Upload, Image, Button, message, Space, Progress } from 'antd';
import { UploadOutlined, DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * 图片上传公共组件
 * 支持限制图片宽度、高度、文件大小，传 null 表示不限制
 * 
 * @param {Object} props
 * @param {string} props.value - 当前图片URL
 * @param {function} props.onChange - 图片URL变更回调
 * @param {number|null} props.maxWidth - 最大宽度限制(px)，null表示不限制
 * @param {number|null} props.maxHeight - 最大高度限制(px)，null表示不限制
 * @param {number|null} props.maxSize - 最大文件大小(KB)，null表示不限制，默认500KB
 * @param {string} props.placeholder - 提示文字
 * @param {boolean} props.disabled - 是否禁用
 */
const ImageUpload = ({
    value,
    onChange,
    maxWidth = null,
    maxHeight = null,
    maxSize = 500,
    placeholder = '点击上传图片',
    disabled = false,
}) => {
    const [loading, setLoading] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);

    /**
     * 获取图片尺寸
     * @param {File} file 
     * @returns {Promise<{width: number, height: number}>}
     */
    const getImageDimensions = (file) => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.onload = () => {
                resolve({ width: img.width, height: img.height });
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    };

    /**
     * 上传前校验
     */
    const beforeUpload = async (file) => {
        // 检查文件类型
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('只能上传图片文件！');
            return Upload.LIST_IGNORE;
        }

        // 检查文件大小
        if (maxSize !== null) {
            const isLtMaxSize = file.size / 1024 <= maxSize;
            if (!isLtMaxSize) {
                message.error(`图片大小不能超过 ${maxSize}KB！`);
                return Upload.LIST_IGNORE;
            }
        }

        // 检查图片尺寸
        if (maxWidth !== null || maxHeight !== null) {
            try {
                const dimensions = await getImageDimensions(file);

                if (maxWidth !== null && dimensions.width > maxWidth) {
                    message.error(`图片宽度不能超过 ${maxWidth}px！当前宽度: ${dimensions.width}px`);
                    return Upload.LIST_IGNORE;
                }

                if (maxHeight !== null && dimensions.height > maxHeight) {
                    message.error(`图片高度不能超过 ${maxHeight}px！当前高度: ${dimensions.height}px`);
                    return Upload.LIST_IGNORE;
                }
            } catch (error) {
                console.error('获取图片尺寸失败:', error);
                message.error('图片读取失败，请重试');
                return Upload.LIST_IGNORE;
            }
        }

        return true;
    };

    /**
     * 自定义上传处理 - 本地模拟
     * 将文件转换为 Base64 URL 作为模拟上传结果
     */
    const customUpload = async ({ file, onSuccess, onError }) => {
        setLoading(true);

        try {
            // 模拟上传延迟
            await new Promise(resolve => setTimeout(resolve, 500));

            // 将文件转换为 Base64 URL
            const reader = new FileReader();
            reader.onload = () => {
                const base64Url = reader.result;
                onChange?.(base64Url);
                onSuccess?.({ url: base64Url });
                setLoading(false);
                message.success('上传成功');
            };
            reader.onerror = () => {
                onError?.(new Error('读取文件失败'));
                setLoading(false);
                message.error('上传失败');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('上传失败:', error);
            onError?.(error);
            setLoading(false);
            message.error('上传失败');
        }
    };

    /**
     * 删除图片
     */
    const handleRemove = () => {
        onChange?.(undefined);
    };

    /**
     * 生成限制提示文字
     */
    const getLimitHint = () => {
        const hints = [];
        if (maxSize !== null) {
            hints.push(`≤${maxSize}KB`);
        }
        if (maxWidth !== null && maxHeight !== null) {
            hints.push(`≤${maxWidth}×${maxHeight}px`);
        } else if (maxWidth !== null) {
            hints.push(`宽≤${maxWidth}px`);
        } else if (maxHeight !== null) {
            hints.push(`高≤${maxHeight}px`);
        }
        return hints.length > 0 ? hints.join('，') : null;
    };

    const limitHint = getLimitHint();

    // 已有图片时显示预览
    if (value) {
        return (
            <div className="image-upload-preview">
                <Space direction="vertical" size="small">
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <Image
                            src={value}
                            alt="已上传图片"
                            style={{
                                maxWidth: 200,
                                maxHeight: 150,
                                objectFit: 'contain',
                                border: '1px solid #d9d9d9',
                                borderRadius: 4,
                                padding: 4,
                            }}
                            preview={{
                                visible: previewVisible,
                                onVisibleChange: setPreviewVisible,
                            }}
                        />
                    </div>
                    {!disabled && (
                        <Space>
                            <Upload
                                accept="image/*"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                customRequest={customUpload}
                            >
                                <Button
                                    size="small"
                                    icon={loading ? <LoadingOutlined /> : <UploadOutlined />}
                                    disabled={loading}
                                >
                                    重新上传
                                </Button>
                            </Upload>
                            <Button
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={handleRemove}
                            >
                                删除
                            </Button>
                        </Space>
                    )}
                </Space>
            </div>
        );
    }

    // 未上传图片时显示上传区域
    return (
        <div className="image-upload-container">
            <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={beforeUpload}
                customRequest={customUpload}
                disabled={disabled || loading}
            >
                <div
                    style={{
                        width: 150,
                        height: 100,
                        border: '1px dashed #d9d9d9',
                        borderRadius: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        background: disabled ? '#f5f5f5' : '#fafafa',
                        transition: 'border-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                        if (!disabled) {
                            e.currentTarget.style.borderColor = '#1677ff';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#d9d9d9';
                    }}
                >
                    {loading ? (
                        <LoadingOutlined style={{ fontSize: 24, color: '#1677ff' }} />
                    ) : (
                        <PlusOutlined style={{ fontSize: 24, color: '#999' }} />
                    )}
                    <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                        {placeholder}
                    </div>
                    {limitHint && (
                        <div style={{ marginTop: 4, color: '#999', fontSize: 11 }}>
                            {limitHint}
                        </div>
                    )}
                </div>
            </Upload>
        </div>
    );
};

export default ImageUpload;
