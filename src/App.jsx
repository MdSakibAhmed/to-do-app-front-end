import { useTodos } from './hooks/useTodos'
import { TodoInput } from './components/TodoInput'
import { TodoItem } from './components/TodoItem'
import { FilterBar } from './components/FilterBar'
import { EmptyState } from './components/EmptyState'
import styles from './App.module.css'

export default function App() {
  const {
    todos,
    filter,
    setFilter,
    filters,
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
  } = useTodos()
console.log(error,"error");
  return (
    <div className={styles.page}>
      <div className={styles.noise} />
      <main className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect width="24" height="24" rx="7" fill="var(--accent)"/>
              <polyline points="6,12 10,16 18,8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className={styles.logoText}>taskr</span>
          </div>
          <div className={styles.statsRow}>
            <span className={styles.stat}>
              <span className={styles.statNum}>{stats.active}</span>
              <span className={styles.statLabel}>remaining</span>
            </span>
            <span className={styles.dot} />
            <span className={styles.stat}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>total</span>
            </span>
          </div>
        </header>

        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%' }}
          />
        </div>

        {error && (
          <div className={styles.error}>
            <span>⚠ {error}</span>
          </div>
        )}

        <div className={styles.inputSection}>
          <TodoInput onAdd={addTodo} />
        </div>

        <FilterBar
          filters={filters}
          active={filter}
          onChange={setFilter}
          stats={stats}
          onClearCompleted={clearCompleted}
        />

        <div className={styles.list}>
          {loading ? (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              <span>loading tasks...</span>
            </div>
          ) : todos.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            todos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
                onCyclePriority={cyclePriority}
                isEditing={editingId === todo.id}
                onEdit={setEditingId}
              />
            ))
          )}
        </div>

        <footer className={styles.footer}>
          <span>double-click to edit · click priority badge to cycle</span>
        </footer>
      </main>
    </div>
  )
}
