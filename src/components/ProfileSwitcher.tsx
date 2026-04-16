import type { Profile } from '../types'
import styles from './ProfileSwitcher.module.css'

type ProfileSwitcherProps = {
  readonly profiles: readonly Profile[]
  readonly activeId: number
  readonly onSwitch: (id: number) => void
}

export function ProfileSwitcher({
  profiles,
  activeId,
  onSwitch,
}: ProfileSwitcherProps) {
  return (
    <select
      className={styles.select}
      value={activeId}
      onChange={(e) => onSwitch(Number(e.target.value))}
      aria-label="Switch profile"
    >
      {profiles.map((p) => (
        <option key={p.id} value={p.id}>
          {p.display_name}
        </option>
      ))}
    </select>
  )
}
