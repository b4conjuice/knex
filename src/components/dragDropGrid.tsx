import { type Dispatch, type SetStateAction } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface DragDropGridItemType {
  id: string
}

function SortableItem({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export default function useDragDropGrid<T extends DragDropGridItemType>({
  items,
  setItems,
  renderItem,
  listContainerClassName,
}: {
  items: Array<T>
  // setItems: (items: Array<T>) => void
  setItems: Dispatch<SetStateAction<T>>
  renderItem: (item: T, index: number) => React.ReactNode
  listContainerClassName?: string
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      // setItems(newItems => {
      //   const oldIndex = newItems.indexOf(active.id)
      //   const newIndex = newItems.indexOf(over.id)
      //   return arrayMove(newItems, oldIndex, newIndex)
      // })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={rectSortingStrategy}>
        <ul className={listContainerClassName}>
          {items.map((item, index) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item, index)}
            </SortableItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
