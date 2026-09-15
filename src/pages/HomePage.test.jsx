import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'
import AppViewer from './AppViewer'
import WorkspaceSidebar from '../components/WorkspaceSidebar'
import { AuthProvider } from '../auth/AuthContext'

// The sidebar is rendered alongside so "first" is checked against the row the
// user actually sees at the top, not against the catalog's internal order.
const renderAt = (path) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <WorkspaceSidebar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/module/:moduleId/app/:solutionId" element={<AppViewer />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )

describe('HomePage', () => {
  it('has no welcome page: it opens the first dashboard in the sidebar', () => {
    const { container } = renderAt('/')
    const firstRow = container.querySelector('.workspace-sidebar a.modlist__item')
    expect(firstRow).toBeTruthy()

    expect(container.querySelector('.welcome')).toBeNull()
    expect(screen.queryByText(/Open a module on the left/)).toBeNull()
    expect(container.querySelector('.app-frame')).toHaveAttribute('title', firstRow.textContent)
    expect(firstRow).toHaveClass('is-active')
  })

  it('sends an unknown solution to the first dashboard too', () => {
    const { container } = renderAt('/module/nope/app/nothing')
    const firstRow = container.querySelector('.workspace-sidebar a.modlist__item')
    expect(container.querySelector('.app-frame')).toHaveAttribute('title', firstRow.textContent)
  })
})
