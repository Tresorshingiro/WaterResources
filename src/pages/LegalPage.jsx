import { Link, Navigate, useParams } from 'react-router-dom'
import IconMark from '../components/IconMark'
import { portal } from '../data/config'

const PAGES = {
  disclaimer: {
    title: 'Data Disclaimer',
    body: [
      'The mapping applications in this portal present data as it is held by the source systems at Rwanda Space Agency and its partner institutions. Data is provided as-is, without warranty of accuracy, completeness, or fitness for a particular purpose.',
      'Each application carries its own refresh cycle and its own collection methodology. Confirm currency and provenance with the owning institution before relying on any figure for regulatory, legal, or operational decisions.',
    ],
  },
  privacy: {
    title: 'Privacy',
    body: [
      `This portal does not maintain its own user accounts. You sign in with your ${portal.identity.name} credentials, and your session is held in a signed, HttpOnly cookie used solely to authorise the mapping applications you open here.`,
      `Do not share your password with anyone, and do not enter it into any page that is not served from this portal or from ${portal.identity.host}. Sign out when you are finished on a shared machine.`,
    ],
  },
  terms: {
    title: 'Terms of Use',
    body: [
      'Access is granted for lawful use in support of environmental and natural resource work in Rwanda. Do not attempt to circumvent access controls, extract data in bulk without authorisation, or redistribute restricted content.',
      'Content and data remain the property of Rwanda Space Agency and the contributing institutions. Attribute the source when you reproduce any map, figure, or extract.',
    ],
  },
  accessibility: {
    title: 'Accessibility',
    body: [
      'This portal is operable by keyboard throughout: the modules menu, every category, and every solution can be reached and activated without a pointer, and focus is always visible.',
      'The mapping applications themselves are ArcGIS products rendered inside this workspace, so their accessibility is governed by the source application. If a specific application presents a barrier, report it so it can be raised with the owning institution.',
    ],
  },
}

export default function LegalPage() {
  const { page } = useParams()
  const content = PAGES[page]
  if (!content) return <Navigate to="/" replace />

  return (
    <article className="legal">
      <nav className="legal__crumbs" aria-label="Breadcrumb">
        <Link to="/">
          <IconMark name="arrowLeft" size={14} />
          <span>Home</span>
        </Link>
      </nav>
      <h1 className="legal__title">{content.title}</h1>
      {content.body.map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="legal__para">
          {paragraph}
        </p>
      ))}
    </article>
  )
}
