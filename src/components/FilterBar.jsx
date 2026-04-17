import styles from './FilterBar.module.css'

export function FilterBar({ filters, active, onChange, stats, onClearCompleted }) {
  return (
    <div className={styles.bar}>
      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f}
            className={`${styles.filter} ${active === f ? styles.active : ''}`}
            onClick={() => onChange(f)}
          >
            {f}
            {f === 'active' && stats.active > 0 && (
              <span className={styles.badge}>{stats.active}</span>
            )}
            {f === 'completed' && stats.completed > 0 && (
              <span className={`${styles.badge} ${styles.done}`}>{stats.completed}</span>
            )}
          </button>
        ))}
      </div>
      {stats.completed > 0 && (
        <button className={styles.clear} onClick={onClearCompleted}>
          clear done
        </button>
      )}
    </div>
  )
}
