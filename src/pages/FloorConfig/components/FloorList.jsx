import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Empty } from 'antd';
import { useFloorStore } from '../../../store/useFloorStore';
import FloorItem from './FloorItem';

const FloorList = ({
    channel,
    selectedSegment,
    onEditFloor,
}) => {
    const { getFloorsBySegment, reorderFloors } = useFloorStore();
    const floors = getFloorsBySegment(channel, selectedSegment);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = floors.findIndex((floor) => floor.id === active.id);
            const newIndex = floors.findIndex((floor) => floor.id === over.id);

            const reorderedFloors = arrayMove(floors, oldIndex, newIndex);
            const floorIds = reorderedFloors.map((floor) => floor.id);
            reorderFloors(channel, floorIds);
        }
    };

    if (floors.length === 0) {
        return (
            <Empty
                description="暂无楼层配置"
                style={{ marginTop: 48 }}
            />
        );
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={floors.map((floor) => floor.id)}
                strategy={verticalListSortingStrategy}
            >
                {floors.map((floor) => (
                    <FloorItem
                        key={floor.id}
                        floor={floor}
                        channel={channel}
                        onEdit={() => onEditFloor(floor.id)}
                    />
                ))}
            </SortableContext>
        </DndContext>
    );
};

export default FloorList;
