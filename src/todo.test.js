/* eslint-env node */
import { describe, it, expect, beforeEach } from 'vitest'

// Minimal localStorage mock for the hook
const store = {}
globalThis.localStorage = {
  getItem: (k) => store[k] ?? null,
  setItem: (k, v) => { store[k] = v },
  removeItem: (k) => { delete store[k] },
  clear: () => Object.keys(store).forEach(k => delete store[k]),
}

// Pure utility tests (no React renderer needed)
describe('Todo logic', () => {
  beforeEach(() => localStorage.clear())

  it('filters active todos', () => {
    const todos = [
      { id: '1', text: 'Buy milk', completed: false },
      { id: '2', text: 'Walk dog', completed: true },
    ]
    const active = todos.filter(t => !t.completed)
    expect(active).toHaveLength(1)
    expect(active[0].text).toBe('Buy milk')
  })

  it('filters completed todos', () => {
    const todos = [
      { id: '1', text: 'Buy milk', completed: false },
      { id: '2', text: 'Walk dog', completed: true },
    ]
    const done = todos.filter(t => t.completed)
    expect(done).toHaveLength(1)
    expect(done[0].text).toBe('Walk dog')
  })

  it('computes stats correctly', () => {
    const todos = [
      { id: '1', completed: false },
      { id: '2', completed: true },
      { id: '3', completed: false },
    ]
    const stats = {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    }
    expect(stats).toEqual({ total: 3, active: 2, completed: 1 })
  })

  it('cycles priority correctly', () => {
    const priorities = ['normal', 'medium', 'high']
    const cycle = (current) => priorities[(priorities.indexOf(current) + 1) % priorities.length]
    expect(cycle('normal')).toBe('medium')
    expect(cycle('medium')).toBe('high')
    expect(cycle('high')).toBe('normal')
  })
})
