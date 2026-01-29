import React, { useEffect, useRef, useState } from 'react';
import { Card, Typography, Empty } from 'antd';
import type { Floor, Channel } from '../../types';
import { FLOOR_TYPE_OPTIONS } from '../../types';
import { useFloorStore } from '../../store/useFloorStore';
import NavbarRenderer from './NavbarRenderer';
import './FloorRenderer.css';

const { Text } = Typography;

interface FloorRendererProps {
    floor: Floor;
    channel: Channel;
}

const FloorRenderer: React.FC<FloorRendererProps> = ({ floor }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const shouldShowImage = useFloorStore((state) => state.shouldShowImage);

    const floorTypeOption = FLOOR_TYPE_OPTIONS.find((opt) => opt.value === floor.type);

    // 如果是导航栏类型,直接渲染导航栏
    if (floor.type === 'navbar') {
        return <NavbarRenderer floor={floor} />;
    }

    // 过滤出应该显示的图片
    const visibleImages = floor.images.filter(shouldShowImage);

    // 自动轮播
    useEffect(() => {
        if (visibleImages.length > 1) {
            intervalRef.current = setInterval(() => {
                setCurrentImageIndex((prev) => (prev + 1) % visibleImages.length);
            }, 3000); // 每3秒切换一次

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [visibleImages.length]);

    // 重置索引如果超出范围
    useEffect(() => {
        if (currentImageIndex >= visibleImages.length && visibleImages.length > 0) {
            setCurrentImageIndex(0);
        }
    }, [visibleImages.length, currentImageIndex]);

    if (visibleImages.length === 0) {
        return (
            <Card
                size="small"
                title={
                    <Text strong>
                        {floorTypeOption?.icon} {floor.name}
                    </Text>
                }
                style={{ marginBottom: 8 }}
            >
                <Empty
                    description="暂无符合条件的图片"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    style={{ padding: '20px 0' }}
                />
            </Card>
        );
    }

    const currentImage = visibleImages[currentImageIndex];

    return (
        <div className="floor-renderer">
            <div className="floor-renderer-carousel">
                {!currentImage.action || currentImage.action.type === 'none' ? (
                    <img
                        src={currentImage.url}
                        alt={currentImage.alt}
                        className="floor-renderer-image"
                    />
                ) : (
                    <a
                        href={currentImage.action.targetUrl || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="floor-renderer-link"
                    >
                        <img
                            src={currentImage.url}
                            alt={currentImage.alt}
                            className="floor-renderer-image"
                        />
                    </a>
                )}

                {visibleImages.length > 1 && (
                    <div className="floor-renderer-indicators">
                        {visibleImages.map((_, index) => (
                            <span
                                key={index}
                                className={`floor-renderer-indicator ${index === currentImageIndex ? 'active' : ''
                                    }`}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloorRenderer;
