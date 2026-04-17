import { useState, useRef, useEffect } from 'react'
import styles from './TodoItem.module.css'

const PRIORITY_COLORS = {
  normal: null,
  medium: '#f5c542',
  high: '#ff5e2c',
}

const PRIORITY_LABELS = {
  normal: 'P3',
  medium: 'P2',
  high: 'P1',
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate, onCyclePriority, isEditing, onEdit }) {
  const [editValue, setEditValue] = useState(todo.text)
  const editRef = useRef(null)

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus()
      editRef.current.select()
    }
  }, [isEditing])

  const handleEditSubmit = () => {
    onUpdate(todo.id, editValue)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditSubmit()
    if (e.key === 'Escape') {
      setEditValue(todo.text)
      onEdit(null)
    }
  }

  const priorityColor = PRIORITY_COLORS[todo.priority]

  return (
    <div
      className={`${styles.item} ${todo.completed ? styles.completed : ''} ${isEditing ? styles.editing : ''}`}
      style={priorityColor ? { '--priority-color': priorityColor } : {}}
    >
      {priorityColor && <div className={styles.priorityBar} />}

      <button
        className={`${styles.checkbox} ${todo.completed ? styles.checked : ''}`}
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {todo.completed && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className={styles.content}>
        {isEditing ? (
          <input
            ref={editRef}
            className={styles.editInput}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span
            className={styles.text}
            onDoubleClick={() => onEdit(todo.id)}
            title="Double-click to edit"
          >
            {todo.text}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <button
          className={styles.priority}
          onClick={() => onCyclePriority(todo.id)}
          title="Cycle priority"
          style={priorityColor ? { color: priorityColor } : {}}
        >
          {PRIORITY_LABELS[todo.priority]}
        </button>
        <button
          className={styles.editBtn}
          onClick={() => onEdit(isEditing ? null : todo.id)}
          title="Edit task"
          aria-label="Edit task"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M9.5 1.5l2 2-8 8H1.5v-2l8-8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(todo.id)}
          title="Delete task"
          aria-label="Delete task"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 2l9 9M11 2l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
