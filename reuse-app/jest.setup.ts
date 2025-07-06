/* eslint-disable */
import '@testing-library/jest-dom';
import React from 'react';

Object.defineProperty(window, 'alert', {
  configurable: true,
  writable: true,
  value: jest.fn(),
});

afterEach(() => {
  (window.alert as jest.Mock).mockClear();
});

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams()
}));

// postNext mocking
jest.mock('@/utils/nextApiClient', () => ({
  postNext: jest.fn()
}));

// next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return React.createElement('img', props);
  },
}));

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
      return React.createElement(
        'button',
        {
          ref,
          type,
          disabled,
          onClick: onClick,
          ...rest
        },
        children
      );
    }
  );

  return { __esModule: true, Button };
});



let originalLocation: Location & string;

beforeAll(() => {
  global.alert = jest.fn();
  global.console.error = jest.fn();

  originalLocation = window.location as Location & string;
  delete (window as any).location;
  (window as any).location = {
    hash: '',
    href: 'http://localhost/',
    pathname: '/',
    search: '',
    hostname: 'localhost',
    origin: 'http://localhost',
    port: '',
    protocol: 'http:',
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
  };
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  });
});

afterAll(() => {
  (global.alert as jest.Mock).mockRestore();
  (global.console.error as jest.Mock).mockRestore();

  delete (window as any).location;
  window.location = originalLocation;
});

afterEach(() => {
  (window.alert as jest.Mock).mockClear();
  (global.console.error as jest.Mock).mockClear();
});