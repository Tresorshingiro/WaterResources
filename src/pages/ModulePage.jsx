import { Navigate, useParams } from 'react-router-dom'
import { getModule } from '../data/config'

/** A module has no page of its own — it opens its first live solution. */
export default function ModulePage() {
  const { moduleId } = useParams()
  const current = getModule(moduleId)

  if (!current) return <Navigate to="/" replace />

  const first = current.solutions[0]
  if (first) {
    return <Navigate to={`/module/${current.id}/app/${first.id}`} replace />
  }

  // Unreachable while publishedModules() drops empty modules, but a module that
  // loses its last live solution should degrade to a welcome, not a blank pane.
  return (
    <section
      className="welcome"
      style={{ backgroundImage: `url(${current.image})` }}
      aria-label={`${current.name} Module`}
    >
      <div className="welcome__scrim" />
      <div className="contours" aria-hidden="true" />
      <div className="welcome__body">
        <p className="eyebrow light">{current.name} Module</p>
        <h1 className="welcome__title">No live solutions yet</h1>
        <p className="welcome__tagline">{current.description}</p>
      </div>
    </section>
  )
}
