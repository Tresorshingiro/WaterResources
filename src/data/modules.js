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
        url: "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=fd3e190aa14c4c8c82611b7acd72b997&draft=true",
        year: "Year 2",
      },
      {
        // Formerly "Water Resources Quality Monitoring". Its route id is keyed
        // by URL in config.js, so the rename leaves existing links working.
        name: "Water Quality Dashboard",
        url: "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=91de3570e4074737b251b3c23b3928d5",
        year: "Year 2",
      },
      {
        name: "Water Quality Analytics",
        url: "https://gh.space.gov.rw/portal/apps/experiencebuilder/experience/?id=4f89698380e2414bbb7fdfa264833ca5",
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
