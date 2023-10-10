import type { Dispatch, SetStateAction } from 'react'
import { Fragment } from 'react'
import classNames from 'classnames'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/solid'

export default function Modal({
  isOpen,
  setIsOpen,
  title,
  isFullScreen = true,
  children,
}: {
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  title?: string
  isFullScreen?: boolean
  children: React.ReactNode
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        onClose={setIsOpen}
        className='fixed inset-0 flex flex-col justify-end overflow-y-auto p-4'
      >
        <Transition.Child
          enter='duration-300 ease-out'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='duration-200 ease-in'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='bg-cobalt/90 fixed inset-0' />
        </Transition.Child>
        <Transition.Child
          className={classNames(isFullScreen && 'h-full', 'flex flex-col')}
          enter='duration-300 ease-out'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='duration-200 ease-in'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          <Dialog.Panel
            className={classNames(
              isFullScreen && 'flex-grow',
              'dark:bg-cb-dusty-blue relative z-10 flex flex-col rounded-lg p-4 dark:text-gray-100'
            )}
          >
            <button
              type='button'
              onClick={() => setIsOpen(false)}
              className='absolute right-4 top-4'
            >
              <XMarkIcon className='text-cb-yellow h-6 w-6' />
            </button>
            <div className='flex flex-grow flex-col space-y-3'>
              {title && (
                <Dialog.Title className='mt-4 text-center text-xl'>
                  {title}
                </Dialog.Title>
              )}
              {children}
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}
