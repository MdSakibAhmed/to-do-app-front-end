import styles from './EmptyState.module.css'

export function EmptyState({ filter }) {
  const messages = {
    all: { icon: '◎', text: 'no tasks yet', sub: 'add one above to get started' },
    active: { icon: '✓', text: 'all done!', sub: 'nothing left to work on' },
    completed: { icon: '○', text: 'nothing completed', sub: 'finish a task to see it here' },
  }
  const { icon, text, sub } = messages[filter] || messages.all

  return (
    <div className={styles.empty}>
      <span className={styles.icon}>{icon}</span>
      <p className={styles.text}>{text}</p>
      <p className={styles.sub}>{sub}</p>
    </div>
  )
}
