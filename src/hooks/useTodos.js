import { useState, useEffect, useCallback } from 'react'

// src/hooks/useTodos.js
const API_BASE = import.meta.env.VITE_API_URL || '/api'
const FILTERS = ['all', 'active', 'completed']

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'API error')
  return data
}

export function useTodos() {
  const [todos, setTodos]       = useState([])
  const [stats, setStats]       = useState({ total: 0, active: 0, completed: 0 })
  const [filter, setFilter]     = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  // ── Fetch todos from server ────────────────────────────────────────────────
  const fetchTodos = useCallback(async (currentFilter) => {
    try {
      setError(null)
      const data = await apiFetch(`/todos?filter=${currentFilter}`)
      setTodos(data.todos)
      setStats(data.stats)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTodos(filter)
  }, [filter, fetchTodos])

  // ── Add ───────────────────────────────────────────────────────────────────
  const addTodo = useCallback(async (text) => {
    if (!text.trim()) return
    try {
      const todo = await apiFetch('/todos', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
      setTodos(prev => [todo, ...prev])
      setStats(prev => ({ ...prev, total: prev.total + 1, active: prev.active + 1 }))
    } catch (err) {
      setError(err.message)
    }
  }, [])

  // ── Toggle completed ──────────────────────────────────────────────────────
  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    try {
      const updated = await apiFetch(`/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ completed: !todo.completed }),
      })
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
      setStats(prev => ({
        ...prev,
        active:    prev.active    + (updated.completed ? -1 : 1),
        completed: prev.completed + (updated.completed ?  1 : -1),
      }))
    } catch (err) {
      setError(err.message)
    }
  }, [todos])

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteTodo = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    try {
      await apiFetch(`/todos/${id}`, { method: 'DELETE' })
      setTodos(prev => prev.filter(t => t.id !== id))
      setStats(prev => ({
        total:     prev.total - 1,
        active:    prev.active    - (todo.completed ? 0 : 1),
        completed: prev.completed - (todo.completed ? 1 : 0),
      }))
    } catch (err) {
      setError(err.message)
    }
  }, [todos])

  // ── Update text ───────────────────────────────────────────────────────────
  const updateTodo = useCallback(async (id, text) => {
    if (!text.trim()) { deleteTodo(id); return }
    try {
      const updated = await apiFetch(`/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ text }),
      })
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }, [deleteTodo])

  // ── Cycle priority ────────────────────────────────────────────────────────
  const cyclePriority = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const priorities = ['normal', 'medium', 'high']
    const next = priorities[(priorities.indexOf(todo.priority) + 1) % priorities.length]
    try {
      const updated = await apiFetch(`/todos/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ priority: next }),
      })
      setTodos(prev => prev.map(t => t.id === id ? updated : t))
    } catch (err) {
      setError(err.message)
    }
  }, [todos])

  // ── Clear completed ───────────────────────────────────────────────────────
  const clearCompleted = useCallback(async () => {
    try {
      await apiFetch('/todos/completed/clear', { method: 'DELETE' })
      await fetchTodos(filter)
    } catch (err) {
      setError(err.message)
    }
  }, [filter, fetchTodos])

  return {
    todos,
    filter,
    setFilter,
    filters: FILTERS,
    editingId,
    setEditingId,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    cyclePriority,
    clearCompleted,
    stats,
    loading,
    error,
  }
}
