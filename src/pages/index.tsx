import { useState } from 'react'
import { Main } from '@bacondotbuild/ui'
import {
  ArrowsUpDownIcon,
  CheckCircleIcon,
  Cog6ToothIcon,
  TrashIcon,
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

const shuffle = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]!
    array[j] = temp!
  }
  return array
}

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

interface Submission {
  word: string
  color: string
}

type Map = Record<string, string | undefined>

const colorToBackgroundColorClass: Map = {
  yellow: 'bg-yellow-500',
  green: 'bg-green-600',
  blue: 'bg-blue-700',
  purple: 'bg-purple-800',
}

export default function Home() {
  const [savedWords, setSavedWords] = useLocalStorage<string[]>(
    'knex-savedWords',
    [...defaultWords]
  )
  const [selectedWords, setSelectedWords] = useLocalStorage<string[]>(
    'knex-selectedWords',
    []
  )
  const [history, setHistory] = useLocalStorage<Submission[][]>(
    'knex-history',
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
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showDeleteHistoryModal, setShowDeleteHistoryModal] = useState(false)
  const [showSetColorModal, setShowSetColorModal] = useState(false)
  const [isSortMode, setIsSortMode] = useState(true)
  const [selectedSubmissionWordPosition, setSelectedSubmissionWordPosition] =
    useState<[number, number] | null>(null)
  const items = savedWords || []
  const selectedSubmissionIndex = selectedSubmissionWordPosition
    ? selectedSubmissionWordPosition[0]
    : null
  const selectedSubmissionWordIndex = selectedSubmissionWordPosition
    ? selectedSubmissionWordPosition[1]
    : null
  const selectedSubmission =
    selectedSubmissionIndex !== null &&
    selectedSubmissionWordIndex !== null &&
    history !== undefined &&
    history?.length > 0 &&
    history[selectedSubmissionIndex] !== undefined
      ? history[selectedSubmissionIndex]
      : null
  const selectedSubmissionWord =
    selectedSubmission !== null &&
    selectedSubmission !== undefined &&
    typeof selectedSubmissionWordIndex === 'number'
      ? selectedSubmission[selectedSubmissionWordIndex]
      : null

  const setColor = (color: string) => {
    if (
      history?.length > 0 &&
      typeof selectedSubmissionIndex === 'number' &&
      typeof selectedSubmissionWordIndex === 'number'
    ) {
      const newSubmissions = [...history]
      const submissionArray = newSubmissions[selectedSubmissionIndex]
      if (
        submissionArray?.[selectedSubmissionWordIndex] !== undefined &&
        submissionArray[selectedSubmissionWordIndex] !== undefined
      ) {
        const submission = submissionArray[selectedSubmissionWordIndex]
        if (submission) {
          submission.color = color
        }
      }
      setHistory(newSubmissions)
      setSelectedSubmissionWordPosition(null)
      setShowSetColorModal(false)
    }
  }

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
      <Main className='flex flex-col space-y-4 p-4'>
        <div className='flex justify-between space-x-4'>
          <h1 className='text-cb-light-blue font-bold tracking-wider'>knex</h1>
          <div className='space-x-4'>
            <label
              htmlFor='checked'
              className='inline-flex cursor-pointer items-center justify-center space-x-1'
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
            <button
              type='button'
              onClick={() => {
                setShowSettingsModal(true)
              }}
            >
              <Cog6ToothIcon className='h-6 w-6' />
            </button>
          </div>
        </div>
        <div className='flex flex-grow flex-col items-center space-y-4'>
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
          {/* {selectedWords?.length > 0 && (
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
          )} */}

          <div className='flex w-full justify-between'>
            <h2>history</h2>
            <button
              type='button'
              onClick={() => {
                setShowDeleteHistoryModal(true)
              }}
              className='disabled:pointer-events-none disabled:opacity-25'
              disabled={history?.length === 0}
            >
              <TrashIcon className='h-6 w-6 text-red-700' />
            </button>
          </div>
          {history?.length > 0 && (
            <ul className='grid w-full gap-4'>
              {history?.map((submission, submissionIndex) => (
                <ul
                  key={submissionIndex}
                  className='grid w-full grid-cols-4 gap-4'
                >
                  {submission.map((word, index) => (
                    <button
                      key={index}
                      className={classNames(
                        word.color
                          ? colorToBackgroundColorClass[word.color]
                          : 'bg-white/10',
                        'rounded-xl px-2 py-4 text-center text-white'
                      )}
                      type='button'
                      onClick={() => {
                        setSelectedSubmissionWordPosition([
                          submissionIndex,
                          index,
                        ])
                        setShowSetColorModal(true)
                      }}
                    >
                      {word.word}
                    </button>
                  ))}
                </ul>
              ))}
            </ul>
          )}
        </div>
        <div className='flex justify-evenly gap-4'>
          <Button
            type='button'
            onClick={() => {
              setSavedWords(shuffle([...savedWords]))
            }}
          >
            shuffle
          </Button>
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
            onClick={() => {
              setHistory([
                selectedWords.map(word => ({ word, color: '' })),
                ...history,
              ])
              setSelectedWords([])
            }}
          >
            submit
          </Button>
        </div>
        <Modal
          isOpen={showSettingsModal}
          setIsOpen={setShowSettingsModal}
          title='settings'
        >
          <textarea
            className='bg-cobalt w-full flex-grow p-4'
            value={(savedWords || []).join('\n')}
            onChange={e => setSavedWords(e.target.value.split('\n'))}
          />
        </Modal>
        <Modal
          isOpen={showDeleteHistoryModal}
          setIsOpen={setShowDeleteHistoryModal}
          title='delete history?'
          isFullScreen={false}
        >
          <Button
            onClick={() => {
              setHistory([])
              setShowDeleteHistoryModal(false)
            }}
            backgroundColorClassName='bg-red-700'
          >
            <TrashIcon className='h-6 w-full' />
          </Button>
        </Modal>
        <Modal
          isOpen={showSetColorModal}
          setIsOpen={setShowSetColorModal}
          title={
            selectedSubmissionWord?.word
              ? `set color of '${selectedSubmissionWord?.word}'`
              : ''
          }
          isFullScreen={false}
        >
          <ul className='grid w-full grid-cols-4 gap-4'>
            {Object.entries(colorToBackgroundColorClass).map(
              ([color, backgroundColorClass]) => (
                <button
                  key={color}
                  className={classNames(
                    backgroundColorClass,
                    'gap-4 rounded-xl bg-white/10 px-2 py-4 text-center text-white'
                  )}
                  onClick={() => {
                    setColor(color)
                  }}
                >
                  {color}
                </button>
              )
            )}
          </ul>
          <button
            className={classNames(
              'gap-4 rounded-xl bg-white/10 px-2 py-4 text-center text-white'
            )}
            onClick={() => {
              setColor('')
            }}
          >
            reset
          </button>
        </Modal>
      </Main>
    </Layout>
  )
}
