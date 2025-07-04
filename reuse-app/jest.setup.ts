/* eslint-disable */
import '@testing-library/jest-dom';

Object.defineProperty(window, 'alert', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

afterEach(() => {
  (window.alert as jest.Mock).mockClear();
});

jest.mock('@/components/ui/checkbox', () => {
  const React = require('react');

  const Checkbox = React.forwardRef(
    ({ onCheckedChange, disabled, ...rest }: any, ref: any) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return;                    
        onCheckedChange?.(e.target.checked);
      };

      return React.createElement('input', {
        type: 'checkbox',
        ref,
        disabled,
        onChange: handleChange,
        ...rest,
      });
    }
  );

  return { __esModule: true, Checkbox };
});

jest.mock('@/components/ui/button', () => {
  const React = require('react');

  const Button = React.forwardRef(
    (
      {
        children,
        type = 'button',
        disabled,
        onClick,
        ...rest
      }: any,
      ref: any
    ) => {
      const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);

        if (type === 'submit') {
          const form = (e.target as HTMLElement).closest('form');
          if (form) {
            form.dispatchEvent(
              new Event('submit', { bubbles: true, cancelable: true })
            );
          }
        }
      };

      return React.createElement(
        'button',
        { ref, type, disabled, onClick: handleClick, ...rest },
        children
      );
    }
  );

  return { __esModule: true, Button };
});

