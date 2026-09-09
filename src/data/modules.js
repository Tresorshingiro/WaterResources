import { features } from './features.generated.js'

/**
 * This portal carries ONE module. It was split out of the combined
 * Environmental and Natural Resource portal so each module ships, deploys and
 * is access-controlled on its own.
 *
 * The shape is unchanged from the parent — same fields, same guard — so a
 * module can be moved back or across without touching any component.
 */
export const modules = [
  {
    id: "water",
    index: '01',
    name: "Water Resources Mapping",
    accent: "#1BA5C4",
    accentText: "#157D95",
    description: "National water inventory with satellite water quality.",
    cardSlug: "water-card",
    heroSlug: "water-hero",
    cardAlt: "A misty lake with a rocky island",
    apps: [
      {
        name: "Water Resources Mapping",
        url: "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=456bc830d1ba4d26801607f3c1be44f3",
        year: "Year 2",
      },
      {
        name: "Water Resources Quality Monitoring",
        url: "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=91de3570e4074737b251b3c23b3928d5",
        year: "Year 2",
      },
    ],
    features: features.water,
  },
]

// Derived, never typed.
export const totals = {
  modules: modules.length,
  apps: modules.reduce((n, m) => n + m.apps.length, 0),
  features: modules.reduce((n, m) => n + m.features.length, 0),
}

export const getModule = (id) => modules.find((m) => m.id === id)
