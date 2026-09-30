export const sectionGroups = {
  technologies: {
    label: 'Technologies',
    description: 'IA, Microsoft 365, Power Platform, agents, innovation et expérimentations technologiques.',
    categories: ['Article', 'Innovation', 'Astuce', 'Trouvaille', 'Projet'],
  },
  communautes: {
    label: 'Communautés',
    description: 'Conférences, cours, sessions, engagements communautaires et transmission.',
    categories: ['Engagement', 'Conférence', 'Cours', 'Session', 'Annonce'],
  },
  'carnets-personnels': {
    label: 'Carnets personnels',
    description: 'Textes plus individuels : réflexions, voyages, santé, goûts et détours hors technologie.',
    categories: ['Personnel', 'Guide', 'Santé', 'Cocktails', 'Horse-Ball', 'Idée'],
  },
} as const;

export type SectionKey = keyof typeof sectionGroups;

export const categorySlug = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
