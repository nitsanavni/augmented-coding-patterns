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

jest.mock('@/app/components/RelationshipGraph', () => {
  return {
    __esModule: true,
    default: function RelationshipGraph() {
      return React.createElement('div', { 'data-testid': 'relationship-graph' }, 'RelationshipGraph')
    },
  }
})

jest.mock('next/dynamic', () => ({
  __esModule: true,
  default: (() => {
    const DynamicComponent = (component: any) => component
    DynamicComponent.preload = () => {}
    DynamicComponent.displayName = 'LoadableComponent'
    return DynamicComponent
  })(),
}))
