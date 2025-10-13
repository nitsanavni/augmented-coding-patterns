import { renderHook, act } from '@testing-library/react'
import { useTheme } from '@/app/hooks/useTheme'

describe('useTheme', () => {
  it('returns dark theme when system prefers dark and no stored preference', () => {
    const matchMediaNullable = {
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('returns light theme when system prefers light and no stored preference', () => {
    const matchMediaNullable = {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('returns stored theme preference over system preference', () => {
    const matchMediaNullable = {
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue('light'),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('toggleTheme switches from light to dark', () => {
    const matchMediaNullable = {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
  })

  it('toggleTheme switches from dark to light', () => {
    const matchMediaNullable = {
      matches: true,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('light')
  })

  it('theme change updates localStorage', () => {
    const matchMediaNullable = {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const setItemSpy = jest.fn()
    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: setItemSpy,
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark')
  })

  it('theme change applies class to HTML element', () => {
    const matchMediaNullable = {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {}
    }
    window.matchMedia = jest.fn().mockReturnValue(matchMediaNullable)

    const localStorageNullable = {
      getItem: jest.fn().mockReturnValue(null),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      key: jest.fn(),
      length: 0
    }
    Object.defineProperty(window, 'localStorage', {
      value: localStorageNullable,
      writable: true
    })

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})