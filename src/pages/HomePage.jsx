import { portal } from '../data/config'

export default function HomePage() {
  return (
    <section
      className="welcome"
      style={{ backgroundImage: `url(${portal.hero})` }}
      aria-label="Welcome"
    >
      <div className="welcome__scrim" />
      <div className="contours" aria-hidden="true" />
      <div className="welcome__body">
        <h1 className="welcome__title">{portal.homeTitle}</h1>
        <p className="welcome__tagline">{portal.tagline}</p>
        <p className="welcome__hint">
          Open a module on the left, then choose a solution. It will load in this pane.
        </p>
      </div>
    </section>
  )
}
