/**
 * Presentation config for the workspace.
 *
 * `src/data/modules.js` stays the single source of truth for content — it is
 * what `scripts/check-data.mjs` guards on every build. This file derives the
 * catalog from it and adds only what the UI needs: stable solution ids for the
 * routes, icons, and a same-origin `embedUrl`.
 */
import { modules as catalogSource } from './modules.js'
import { srcSet } from '../config/images.js'
import { embedUrl as sameOriginEmbed } from '../lib/portal.js'

export const portal = {
  name: "Water Resources Mapping",
  homeTitle: "Water Resources Mapping",
  tagline: "National water inventory with satellite water quality.",
  /*
   * The ArcGIS Enterprise this portal signs into and embeds from.
   *
   * Named here rather than written into the components, because it is not the
   * same system for every portal — Parks & Tourism runs on RDB's Enterprise,
   * the rest on GeoHub. Hardcoding it meant the sign-in prompt and the privacy
   * note told the user to enter credentials for the wrong organisation.
   */
  identity: { name: 'GeoHub', host: 'gh.space.gov.rw' },

  // This portal's own module photograph, not a shared one — each split portal
  // is visually its own thing.
  hero: srcSet("water-hero").src,
}

/**
 * Stable route ids for each application.
 *
 * Keyed by the application URL so a rename does not silently
 * repoint a link, and so a reorder cannot change a URL.
 */
const SOLUTION_IDS = {
  "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=456bc830d1ba4d26801607f3c1be44f3": "water-resources",
  "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=91de3570e4074737b251b3c23b3928d5": "water-quality",
}

const MODULE_ICONS = {
  water: "droplet",
}

const SOLUTION_ICONS = {
  "water-resources": "layers",
  "water-quality": "activity",
}

/*
 * Module accent for the light chrome.
 *
 * The catalog's `accentText` is the value drawn for this exact ground and
 * guarded at 4.5:1 on #FBFAF7 by scripts/check-data.mjs, so the sidebar uses it
 * directly. One palette, guarded in one place.
 */

/** The same accent at low alpha, for the active row's tint. */
function softAccent(hex, alpha) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const catalog = catalogSource.map((mod) => ({
  id: mod.id,
  name: mod.name,
  description: mod.description,
  icon: MODULE_ICONS[mod.id] || 'map',
  accent: mod.accent,
  accentText: mod.accentText,
  // Named for its role in the CSS (the rail, icon and active row), which is a
  // dark accent on light chrome — the guarded, contrast-checked catalog value.
  accentDark: mod.accentText,
  accentSoft: softAccent(mod.accent, 0.12),
  image: srcSet(mod.heroSlug).src,
  solutions: mod.apps.map((app) => {
    const id = SOLUTION_IDS[app.url]
    return {
      id,
      name: app.name,
      year: app.year,
      icon: SOLUTION_ICONS[id] || 'map',
      // Same-origin only. The Portal sends X-Frame-Options, so a frame pointed
      // straight at gh.space.gov.rw is refused; this routes through the access
      // server, which attaches the signed-in user's token.
      embedUrl: id ? sameOriginEmbed(app.url) : null,
    }
  }),
}))

function publishedModules(source) {
  return source
    .map((mod) => ({ ...mod, solutions: mod.solutions.filter((app) => Boolean(app.embedUrl)) }))
    .filter((mod) => mod.solutions.length > 0)
}

export const modules = publishedModules(catalog)

export const getModule = (id) => modules.find((m) => m.id === id)
export const getSolution = (mod, solutionId) =>
  mod ? mod.solutions.find((s) => s.id === solutionId) : undefined

export const stats = {
  modules: modules.length,
  solutions: modules.reduce((n, m) => n + m.solutions.length, 0),
}

export const footer = {
  agency: '',
  blurb:
    'National environmental and natural resource intelligence, built on Earth observation and national field reporting.',
  contact: { email: '', phone: '' },
  quickLinks: [
    { label: 'Home', to: '/' },
    ...modules.flatMap((mod) =>
      mod.solutions.map((s) => ({ label: s.name, to: `/module/${mod.id}/app/${s.id}` })),
    ),
  ],
}
