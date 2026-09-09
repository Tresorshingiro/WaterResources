import { Navigate, useParams } from 'react-router-dom'
import ArcGisDashboardFrame from '../components/ArcGisDashboardFrame'
import { getModule, getSolution } from '../data/config'

export default function AppViewer() {
  const { moduleId, solutionId } = useParams()
  const current = getModule(moduleId)
  const solution = getSolution(current, solutionId)

  if (!current || !solution || !solution.embedUrl) return <Navigate to="/" replace />

  return (
    <article className="viewer viewer--pane">
      {/* No title strip: the sidebar already names the open solution, and the
          dashboard carries its own heading. */}
      <ArcGisDashboardFrame src={solution.embedUrl} title={solution.name} />
    </article>
  )
}
