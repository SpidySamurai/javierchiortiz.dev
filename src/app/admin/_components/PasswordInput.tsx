'use client';

import { useState } from 'react';

interface PasswordInputProps {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  focused?: boolean;
  leftIcon?: string;
  required?: boolean;
}

export default function PasswordInput({
  placeholder = '••••••••',
  value,
  onChange,
  onFocus,
  onBlur,
  focused = false,
  leftIcon = 'lock',
  required = false,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <span
        className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          fontSize: 18,
          color: focused ? 'var(--ds-primary-container)' : 'var(--ds-outline)',
          fontVariationSettings: "'FILL' 0",
          transition: 'color 0.15s',
        }}
      >
        {leftIcon}
      </span>
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        className="pl-10 pr-10 py-3 rounded-[10px] border-none text-sm w-full box-border transition-[outline-color] duration-150"
        style={{
          outline: focused ? '2px solid var(--ds-primary-container)' : '2px solid var(--ds-surface-high)',
          background: 'var(--ds-surface)',
          color: 'var(--ds-on-surface)',
        }}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0 flex items-center"
        tabIndex={-1}
        style={{ color: 'var(--ds-outline)' }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, fontVariationSettings: "'FILL' 0" }}
        >
          {visible ? 'visibility_off' : 'visibility'}
        </span>
      </button>
    </div>
  );
}
