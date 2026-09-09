import { useAuth } from '../auth/AuthContext'

/**
 * Who is signed in, and the way out. Pinned to the foot of the sidebar.
 *
 * Its own component so the sidebar's module list stays testable without an
 * auth provider standing behind it.
 */
export default function SidebarAccount() {
  const { user, signOut } = useAuth()

  return (
    <div className="sidebar__foot">
      <span className="userpill">{user?.fullName || user?.username}</span>
      <button type="button" className="linkbtn" onClick={signOut}>
        Sign out
      </button>
    </div>
  )
}
