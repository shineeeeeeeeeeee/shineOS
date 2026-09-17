import React from 'react'
import './BasicButton.css'

interface BasicButtonProps {
  onClick?: () => void
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  fullWidth?: boolean
}

const BasicButton: React.FC<BasicButtonProps> = ({
  onClick,
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <button
      type="button"
      className={[
        'basic-button',
        `basic-button--${variant}`,
        `basic-button--${size}`,
        fullWidth ? 'basic-button--full' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default BasicButton
