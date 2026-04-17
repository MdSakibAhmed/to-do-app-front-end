import { useState, useRef } from 'react'
import styles from './TodoInput.module.css'

export function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) return
    onAdd(value)
    setValue('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputWrap}>
        <span className={styles.prompt}>›</span>
        <input
          ref={inputRef}
          className={styles.input}
          type="text"
          placeholder="add a new task..."
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <button
          className={styles.addBtn}
          type="submit"
          disabled={!value.trim()}
          aria-label="Add task"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </form>
  )
}
