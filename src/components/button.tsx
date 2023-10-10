import React from 'react'
import classnames from 'classnames'

// based on: https://www.joshwcomeau.com/animation/3d-button/
export default function Button({
  className,
  onClick,
  href,
  type,
  disabled,
  textSizeClassName = 'text-lg',
  backgroundColorClassName = 'bg-[#5a3e84]',
  children,
}: {
  className?: string
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  href?: string
  type?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
  textSizeClassName?: string
  backgroundColorClassName?: string
  children?: React.ReactNode
}) {
  if (href) {
    const anchorProps = {
      href,
      target: '_blank',
      rel: 'noopener noreferrer',
    }
    return (
      <a
        className={classnames(
          textSizeClassName,
          'bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center',
          className
        )}
        {...anchorProps}
      >
        <span
          className={classnames(
            backgroundColorClassName,
            'block translate-y-[-4px] transform rounded-lg p-3 duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms]'
          )}
        >
          {children}
        </span>
      </a>
    )
  }
  const buttonProps = {
    onClick,
    disabled: disabled ?? false,
    type: type ?? 'button',
  }
  return (
    <button
      className={classnames(
        textSizeClassName,
        'bg-cb-dark-blue group w-full cursor-pointer rounded-lg border-none text-center',
        className
      )}
      {...buttonProps}
    >
      <span
        className={classnames(
          backgroundColorClassName,
          'block translate-y-[-4px] transform rounded-lg p-3 duration-[600ms] ease-[cubic-bezier(.3,.7,.4,1)] hover:ease-[cubic-bezier(.3,.7,.4,1.5)] group-hover:translate-y-[-6px] group-hover:duration-[250ms] group-active:translate-y-[-2px] group-active:duration-[34ms]'
        )}
      >
        {children}
      </span>
    </button>
  )
}
