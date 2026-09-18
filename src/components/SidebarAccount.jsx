import { useAuth } from '../auth/AuthContext'
import IconMark from './IconMark'

/**
 * The way out, pinned to the foot of the sidebar.
 *
 * The signed-in user's name is deliberately not shown: the sibling portals'
 * foot carries Logout alone, and this one matches them.
 *
 * Its own component so the sidebar's module list stays testable without an
 * auth provider standing behind it.
 */
export default function SidebarAccount() {
  const { signOut } = useAuth()

  return (
    <div className="sidebar__foot">
      <button type="button" className="logout" onClick={signOut}>
        <IconMark name="logout" size={16} />
        <span>Logout</span>
      </button>
    </div>
  )
}
