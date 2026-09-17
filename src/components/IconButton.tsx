import React from 'react'
import './IconButton.css'

interface IconButtonProps {
  onClick?: () => void
  label: string
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  label,
  children,
  variant = 'default',
  size = 'md',
  disabled = false,
}) => {
  return (
    <button
      type="button"
      className={`icon-button icon-button--${variant} icon-button--${size}`}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  )
}

export default IconButton
