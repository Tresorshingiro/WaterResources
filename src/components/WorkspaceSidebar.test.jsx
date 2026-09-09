import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import WorkspaceSidebar from './WorkspaceSidebar'
import { AuthProvider } from '../auth/AuthContext'
import { modules, portal } from '../data/config'

// The sidebar now carries the account block in its foot, so it needs the auth
// provider standing behind it. The provider's session probe fails harmlessly
// under jsdom and settles on "signed out", which is all these tests need.
const renderAt = (path = '/') =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <WorkspaceSidebar />
      </MemoryRouter>
    </AuthProvider>,
  )

// Each module is a labelled <section>, so it is addressable as a region. Queries
// are scoped through it because a label can legitimately repeat across levels —
// the water module and its first solution are both "Water Resources Mapping".
// For the same reason rows are found by their link role, not by their text: in
// that portal the group title and the row carry identical words.
const group = (mod) => within(screen.getByRole('region', { name: mod.name }))
const row = (mod, solution) => group(mod).getByRole('link', { name: solution.name })

// Mirrors the component: a portal whose only module is the portal itself shows
// no module header, because the brand above it already carries that name.
const soleModule = modules.length === 1 && modules[0].name === portal.name

describe('WorkspaceSidebar', () => {
  it('publishes only solutions that have an embedUrl', () => {
    expect(modules.length).toBeGreaterThan(0)
    for (const mod of modules) {
      expect(mod.solutions.length).toBeGreaterThan(0)
      for (const solution of mod.solutions) {
        expect(solution.embedUrl).toBeTruthy()
        // Same-origin only — never a Portal URL, which would be frame-refused.
        expect(solution.embedUrl.startsWith('/')).toBe(true)
      }
    }
  })

  it('heads the list for what it lists and names each category by its full catalog name', () => {
    renderAt()
    const heading = soleModule ? 'Solutions' : 'Modules'
    expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument()
    for (const mod of modules) {
      expect(screen.getByRole('region', { name: mod.name })).toBeInTheDocument()
    }
  })

  it('counts solutions with the singular/plural rule, wherever a module is headed', () => {
    renderAt()
    for (const mod of modules) {
      const n = mod.solutions.length
      const label = `${n} ${n === 1 ? 'solution' : 'solutions'}`
      if (soleModule) {
        // The header is one block carrying both the title and the count, so the
        // count's absence is the header's absence. Asserting on the title
        // instead would be ambiguous: in Water Resources the module and its
        // first application are the same words, and the row still renders them.
        expect(group(mod).queryByText(label)).not.toBeInTheDocument()
      } else {
        expect(group(mod).getByText(label)).toBeInTheDocument()
      }
    }
  })

  it('shows every solution without any disclosure to open', () => {
    renderAt()
    for (const mod of modules) {
      for (const solution of mod.solutions) {
        expect(row(mod, solution)).toBeInTheDocument()
      }
    }
    // No category disclosures: the only buttons are collapse and sign out.
    expect(
      screen.queryByRole('button', { name: /environmental|water|parks/i }),
    ).not.toBeInTheDocument()
  })

  it('labels items with the full catalog name, never an abbreviation', () => {
    renderAt()
    for (const mod of modules) {
      for (const solution of mod.solutions) {
        const link = row(mod, solution)
        // The label is complete on screen, so there is nothing for a title
        // tooltip to reveal and no second copy for a screen reader to repeat.
        expect(link).not.toHaveAttribute('title')
        expect(link).toHaveTextContent(solution.name)
      }
    }
  })

  it('links items to /module/:moduleId/app/:solutionId', () => {
    renderAt()
    for (const mod of modules) {
      for (const solution of mod.solutions) {
        expect(row(mod, solution)).toHaveAttribute(
          'href',
          `/module/${mod.id}/app/${solution.id}`,
        )
      }
    }
  })

  it('carries each module accent down to its group', () => {
    renderAt()
    for (const mod of modules) {
      const region = screen.getByRole('region', { name: mod.name })
      expect(region).toHaveStyle({
        '--accent': mod.accent,
        '--accent-text': mod.accentText,
        '--accent-dark': mod.accentDark,
      })
    }
  })

  it('takes both accents straight from the guarded catalog', async () => {
    // check-data.mjs asserts every accentText clears 4.5:1 on the paper ground.
    // That guard is only worth anything if these are the values that render, so
    // the presentation layer must not substitute its own.
    const { modules: catalog } = await import('../data/modules.js')
    for (const mod of modules) {
      const source = catalog.find((m) => m.id === mod.id)
      expect(mod.accent).toBe(source.accent)
      expect(mod.accentText).toBe(source.accentText)
      // The rail, icon and active row all render --accent-dark. On the light
      // chrome that IS the guarded value, so the 4.5:1 check in check-data.mjs
      // now covers the pixels the user actually sees. While the chrome was
      // basalt this was a lifted derivative instead, and the guard only ever
      // applied indirectly.
      expect(mod.accentDark).toBe(source.accentText)
    }
  })
})
