import { useState } from 'react'
import { Main, Title } from '@bacondotbuild/ui'
import {
  ArrowsUpDownIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid'
import classNames from 'classnames'
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
import Button from '@/components/button'
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

const MAX_SELECTED_WORDS = 4

export default function Home() {
  const [savedWords, setSavedWords] = useLocalStorage<string[]>(
    'knex-savedWords',
    [...defaultWords]
  )
  const [selectedWords, setSelectedWords] = useLocalStorage<string[]>(
    'knex-selectedWords',
    []
  )
  const selectWord = (selectedWord: string) => {
    const selectedWordIndex = selectedWords.findIndex(s => s === selectedWord)
    if (selectedWordIndex > -1) {
      const newSelectedWords = [...selectedWords]
      newSelectedWords.splice(selectedWordIndex, 1)
      setSelectedWords(newSelectedWords)
    } else if (selectedWords?.length < MAX_SELECTED_WORDS) {
      setSelectedWords([...selectedWords, selectedWord])
    }
  }
  const [showModal, setShowModal] = useState(false)
  const [isSortMode, setIsSortMode] = useState(false)
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
              {isSortMode ? (
                <ul className='grid w-full grid-cols-4 gap-4'>
                  {items
                    .map(item => ({ id: item, item }))
                    .map((item, index) => (
                      <SortableItem key={item.id} id={item.id}>
                        <div
                          key={index}
                          className='flex-col gap-4 rounded-xl border border-white/10 bg-white/10 px-2 py-4 text-center text-white'
                        >
                          {item.item}
                        </div>
                      </SortableItem>
                    ))}
                </ul>
              ) : (
                <ul className='grid w-full grid-cols-4 gap-4'>
                  {items.map((item, index) => (
                    <button
                      key={index}
                      className={classNames(
                        selectedWords.includes(item)
                          ? 'border-cb-yellow'
                          : 'border-white/10',
                        'gap-4 rounded-xl border bg-white/10 px-2 py-4 text-center text-white'
                      )}
                      type='button'
                      onClick={() => {
                        selectWord(item)
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </ul>
              )}
            </SortableContext>
          </DndContext>
          <label
            htmlFor='checked'
            className='inline-flex w-full cursor-pointer items-center justify-center space-x-3'
          >
            <span className={isSortMode ? 'text-cb-yellow' : ''}>
              <ArrowsUpDownIcon className='h-6 w-6' />
            </span>
            <span className='relative'>
              <span className='block h-6 w-10 rounded-full bg-gray-400 shadow-inner' />
              <span
                className={`focus-within:shadow-outline bg-cb-yellow absolute inset-y-0 left-0 ml-1 mt-1 block h-4 w-4 rounded-full shadow transition-transform duration-300 ease-in-out ${
                  !isSortMode ? 'translate-x-full transform' : ''
                }`}
              >
                <input
                  id='checked'
                  type='checkbox'
                  checked
                  onChange={() => setIsSortMode(!isSortMode)}
                  className='absolute h-0 w-0 opacity-0'
                />
              </span>
            </span>
            <span className={!isSortMode ? 'text-cb-yellow' : ''}>
              <CheckCircleIcon className='h-6 w-6' />
            </span>
          </label>
          {selectedWords?.length > 0 && (
            <ul className='grid w-full grid-cols-4 gap-4'>
              {selectedWords.map((word, index) => (
                <div
                  key={index}
                  className='max-w-xs flex-col gap-4 rounded-xl bg-white/10 px-2 py-4 text-center text-white'
                >
                  {word}
                </div>
              ))}
            </ul>
          )}
        </div>
        <div className='flex justify-evenly gap-4'>
          <Button>shuffle</Button>
          <Button
            type='button'
            onClick={() => {
              setSelectedWords([])
            }}
            disabled={selectedWords?.length === 0}
            className='disabled:pointer-events-none disabled:opacity-25'
            textSizeClassName='text-sm'
          >
            deselect all
          </Button>
          <Button
            disabled={selectedWords?.length !== MAX_SELECTED_WORDS}
            className='disabled:pointer-events-none disabled:opacity-25'
          >
            submit
          </Button>
        </div>
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
