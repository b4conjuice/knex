import { useState } from 'react'
import { Main, Title } from '@bacondotbuild/ui'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
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

import Layout from '@/components/layout'
import Modal from '@/components/modal'
import useLocalStorage from '@/lib/useLocalStorage'

const defaultWords = [
  'central',
  'critical',
  'key',
  'vital',
  'henry',
  'tired',
  'paper',
  'tempo',
  'assignment',
  'rock',
  'jennifer',
  'defeat',
  'glass',
  'kate',
  'plastic',
  'metal',
]

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

export default function Home() {
  const [savedWords, setSavedWords] = useLocalStorage<string[]>(
    'knex-savedWords',
    [...defaultWords]
  )
  const [showModal, setShowModal] = useState(false)
  const items = savedWords || []

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (active.id !== over?.id) {
      setSavedWords(newItems => {
        if (newItems) {
          const oldIndex = newItems.indexOf(active?.id as string)
          const newIndex = newItems.indexOf(over?.id as string)

          return arrayMove(newItems, oldIndex, newIndex)
        } else {
          return newItems
        }
      })
    }
  }

  return (
    <Layout>
      <Main className='flex flex-col p-4'>
        <div className='flex justify-end space-x-4'>
          <button
            type='button'
            onClick={() => {
              setShowModal(true)
            }}
          >
            <Cog6ToothIcon className='h-6 w-6' />
          </button>
        </div>
        <div className='flex flex-grow flex-col items-center space-y-4'>
          <Title>knex</Title>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items} strategy={rectSortingStrategy}>
              <ul className='grid grid-cols-4 gap-4'>
                {items
                  .map(item => ({ id: item, item }))
                  .map((item, index) => (
                    <SortableItem key={item.id} id={item.id}>
                      <div
                        key={index}
                        className='max-w-xs flex-col gap-4 rounded-xl bg-white/10 px-2 py-4 text-center text-white hover:bg-white/20'
                      >
                        {item.item}
                      </div>
                    </SortableItem>
                  ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
        {/* <div className='flex justify-evenly gap-4'>
          <Button>shuffle</Button>
          <Button>deselect all</Button>
          <Button>submit</Button>
        </div> */}
        <Modal isOpen={showModal} setIsOpen={setShowModal} title='settings'>
          <textarea
            className='bg-cobalt w-full flex-grow p-4'
            value={(savedWords || []).join('\n')}
            onChange={e => setSavedWords(e.target.value.split('\n'))}
          />
        </Modal>
      </Main>
    </Layout>
  )
}
