import '@testing-library/jest-dom'
import React from 'react'

jest.mock('react-markdown', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: string }) => {
      return React.createElement('div', null, children)
    },
  }
})

jest.mock('remark-gfm', () => {
  return {
    __esModule: true,
    default: () => {},
  }
})
