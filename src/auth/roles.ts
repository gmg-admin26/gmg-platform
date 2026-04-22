export type ArtistOSRole = 'artist_manager' | 'label_partner' | 'admin_team';

export type SystemRole = 'ADMIN' | 'ARTIST' | 'CATALOG_CLIENT' | 'INTERNAL_OPERATOR';

export const SYSTEM_ACCESS: Record<SystemRole, {
  canAccessAdminOS: boolean;
  canAccessArtistOS: boolean;
  canAccessCatalogOS: boolean;
  canAccessRocksteady: boolean;
}> = {
  ADMIN: {
    canAccessAdminOS: true,
    canAccessArtistOS: true,
    canAccessCatalogOS: true,
    canAccessRocksteady: true,
  },
  ARTIST: {
    canAccessAdminOS: false,
    canAccessArtistOS: true,
    canAccessCatalogOS: false,
    canAccessRocksteady: false,
  },
  CATALOG_CLIENT: {
    canAccessAdminOS: false,
    canAccessArtistOS: false,
    canAccessCatalogOS: true,
    canAccessRocksteady: false,
  },
  INTERNAL_OPERATOR: {
    canAccessAdminOS: true,
    canAccessArtistOS: true,
    canAccessCatalogOS: true,
    canAccessRocksteady: true,
  },
};

export type CatalogOSRole = 'catalog_owner' | 'catalog_admin' | 'catalog_team';

export interface CatalogOSUser {
  email: string;
  password: string;
  role: CatalogOSRole;
  displayName: string;
  clientId?: string;
}

export const CATALOG_OS_USERS: CatalogOSUser[] = [
  {
    email: 'catalog@gmg.ai',
    password: 'GMGcatalog123!',
    role: 'catalog_admin',
    displayName: 'GMG Catalog Admin',
  },
  {
    email: 'catalog@gmg.ai',
    password: 'catalogos123',
    role: 'catalog_admin',
    displayName: 'GMG Catalog Admin',
  },
  {
    email: 'client@bassnectar.net',
    password: 'bassnectar123',
    role: 'catalog_owner',
    displayName: 'Bassnectar Catalog',
    clientId: 'a1000000-0000-0000-0000-000000000001',
  },
  {
    email: 'client@santigold.com',
    password: 'santigold123',
    role: 'catalog_owner',
    displayName: 'Santigold Catalog',
    clientId: 'a2000000-0000-0000-0000-000000000002',
  },
  {
    email: 'client@artist03.com',
    password: 'artist03123',
    role: 'catalog_owner',
    displayName: 'Virgin Catalog Artist',
    clientId: 'a3000000-0000-0000-0000-000000000003',
  },
  // Marketing team restricted logins
  {
    email: 'marketing+bassnectar@gmg.ai',
    password: 'team-bassnectar123',
    role: 'catalog_team',
    displayName: 'Bassnectar Team',
    clientId: 'a1000000-0000-0000-0000-000000000001',
  },
  {
    email: 'marketing+santigold@gmg.ai',
    password: 'team-santigold123',
    role: 'catalog_team',
    displayName: 'Santigold Team',
    clientId: 'a2000000-0000-0000-0000-000000000002',
  },
  {
    email: 'marketing+virgincatalog@gmg.ai',
    password: 'team-virgin123',
    role: 'catalog_team',
    displayName: 'Virgin Catalog Team',
    clientId: 'a3000000-0000-0000-0000-000000000003',
  },
];

export interface RoleUser {
  email: string;
  password: string;
  role: ArtistOSRole;
  displayName: string;
  artistIds?: string[];
  labelId?: string;
}

export const ROLE_USERS: RoleUser[] = [
  {
    email: 'manager@gmg.ai',
    password: 'artistos123',
    role: 'artist_manager',
    displayName: 'Artist Manager',
    artistIds: [
      'AOS-079',
      'AOS-001','AOS-002','AOS-003','AOS-004','AOS-005','AOS-006','AOS-007',
      'AOS-008','AOS-009','AOS-010','AOS-011','AOS-012','AOS-013','AOS-014',
      'AOS-015','AOS-016','AOS-017','AOS-018','AOS-019','AOS-020','AOS-021',
      'AOS-022','AOS-023','AOS-024','AOS-025','AOS-026','AOS-027','AOS-028',
      'AOS-029','AOS-030','AOS-031','AOS-032','AOS-033','AOS-034','AOS-035',
    ],
  },
  {
    email: 'label@gmg.ai',
    password: 'artistos123',
    role: 'label_partner',
    displayName: 'Label Partner',
    labelId: 'LABEL-001',
    artistIds: [
      'AOS-001','AOS-002','AOS-003','AOS-004','AOS-007','AOS-010','AOS-011',
      'AOS-016','AOS-021','AOS-022','AOS-024','AOS-025',
    ],
  },
  {
    email: 'admin@gmg.ai',
    password: 'artistos123',
    role: 'admin_team',
    displayName: 'GMG Admin',
    artistIds: [
      'AOS-001','AOS-002','AOS-003','AOS-004','AOS-005','AOS-006','AOS-007',
      'AOS-008','AOS-009','AOS-010','AOS-011','AOS-012','AOS-013','AOS-014',
      'AOS-015','AOS-016','AOS-017','AOS-018','AOS-019','AOS-020','AOS-021',
      'AOS-022','AOS-023','AOS-024','AOS-025','AOS-026','AOS-027','AOS-028',
      'AOS-029','AOS-030','AOS-031','AOS-032','AOS-033','AOS-034','AOS-035',
    ],
  },
  {
    email: 'admin@gmg.ai',
    password: 'rocksteady123',
    role: 'admin_team',
    displayName: 'GMG Admin',
  },
  {
    email: 'admin@gmgtest.com',
    password: 'GMGadmin123!',
    role: 'admin_team',
    displayName: 'GMG Test Admin',
    artistIds: [
      'AOS-001','AOS-002','AOS-003','AOS-004','AOS-005','AOS-006','AOS-007',
      'AOS-008','AOS-009','AOS-010','AOS-011','AOS-012','AOS-013','AOS-014',
      'AOS-015','AOS-016','AOS-017','AOS-018','AOS-019','AOS-020',
    ],
  },
  {
    email: 'artist@gmgtest.com',
    password: 'GMGartist123!',
    role: 'artist_manager',
    displayName: 'GMG Test Artist',
    artistIds: ['AOS-001','AOS-002','AOS-003'],
  },
  {
    email: 'operator@gmgtest.com',
    password: 'GMGoperator123!',
    role: 'admin_team',
    displayName: 'GMG Test Operator',
    artistIds: [
      'AOS-001','AOS-002','AOS-003','AOS-004','AOS-005','AOS-006','AOS-007',
      'AOS-008','AOS-009','AOS-010',
    ],
  },
];

export const ROLE_META: Record<ArtistOSRole, {
  label: string;
  shortLabel: string;
  color: string;
  bg: string;
  border: string;
  description: string;
}> = {
  artist_manager: {
    label: 'Artist / Management',
    shortLabel: 'Artist Mgmt',
    color: '#06B6D4',
    bg: 'bg-[#06B6D4]/10',
    border: 'border-[#06B6D4]/25',
    description: 'View your artist performance, financials, campaigns, and team support.',
  },
  label_partner: {
    label: 'Label View',
    shortLabel: 'Label',
    color: '#10B981',
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/25',
    description: 'Monitor your label roster, economics, and release pipeline.',
  },
  admin_team: {
    label: 'Admin / Team',
    shortLabel: 'Admin',
    color: '#F59E0B',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/25',
    description: 'Full system access — manage all artists, labels, campaigns, and assignments.',
  },
};

export const ROLE_PERMISSIONS: Record<ArtistOSRole, {
  canEditArtists: boolean;
  canEditLabels: boolean;
  canEditSpend: boolean;
  canSeeAllArtists: boolean;
  canSeeInternalNotes: boolean;
  canBroadcastUpdates: boolean;
  canAssignTeam: boolean;
  canManageSystem: boolean;
  canDropArtists: boolean;
}> = {
  artist_manager: {
    canEditArtists: false,
    canEditLabels: false,
    canEditSpend: false,
    canSeeAllArtists: false,
    canSeeInternalNotes: false,
    canBroadcastUpdates: false,
    canAssignTeam: false,
    canManageSystem: false,
    canDropArtists: false,
  },
  label_partner: {
    canEditArtists: false,
    canEditLabels: false,
    canEditSpend: false,
    canSeeAllArtists: false,
    canSeeInternalNotes: false,
    canBroadcastUpdates: false,
    canAssignTeam: false,
    canManageSystem: false,
    canDropArtists: false,
  },
  admin_team: {
    canEditArtists: true,
    canEditLabels: true,
    canEditSpend: true,
    canSeeAllArtists: true,
    canSeeInternalNotes: true,
    canBroadcastUpdates: true,
    canAssignTeam: true,
    canManageSystem: true,
    canDropArtists: true,
  },
};

export const ARTIST_OS_NAV: Record<ArtistOSRole, { label: string; path: string; end?: boolean }[]> = {
  artist_manager: [
    { label: 'Overview',          path: '/dashboard/artist-os',              end: true  },
    { label: 'Campaign OS',       path: '/dashboard/artist-os/campaigns'              },
    { label: 'Fan Intelligence',  path: '/dashboard/artist-os/audience'               },
    { label: 'Fan OS',            path: '/dashboard/artist-os/fan-os'                 },
    { label: 'Release OS',        path: '/dashboard/artist-os/releases'               },
    { label: 'Requests',          path: '/dashboard/artist-os/requests'               },
    { label: 'Revenue',           path: '/dashboard/artist-os/revenue'                },
    { label: 'Spending',          path: '/dashboard/artist-os/spending'               },
    { label: 'Recoupment',        path: '/dashboard/artist-os/recoupment'             },
    { label: 'Updates',           path: '/dashboard/artist-os/updates'                },
    { label: 'Settings',          path: '/dashboard/artist-os/settings'               },
  ],
  label_partner: [
    { label: 'Overview',      path: '/dashboard/artist-os',              end: true  },
    { label: 'Artists',       path: '/dashboard/artist-os/artists'                 },
    { label: 'Releases',      path: '/dashboard/artist-os/releases'                },
    { label: 'Campaigns',     path: '/dashboard/artist-os/campaigns'               },
    { label: 'Revenue',       path: '/dashboard/artist-os/revenue'                 },
    { label: 'Investments',   path: '/dashboard/artist-os/spending'                },
    { label: 'Requests',      path: '/dashboard/artist-os/requests'                },
    { label: 'Team Updates',  path: '/dashboard/artist-os/updates'                 },
    { label: 'Settings',      path: '/dashboard/artist-os/settings'                },
  ],
  admin_team: [
    { label: 'Overview',            path: '/dashboard/artist-os',                       end: true  },
    { label: 'Roster Intelligence', path: '/dashboard/artist-os/roster'                            },
    { label: 'Artists',             path: '/dashboard/artist-os/artists'                           },
    { label: 'Labels',              path: '/dashboard/artist-os/labels'                            },
    { label: 'Releases',            path: '/dashboard/artist-os/releases'                          },
    { label: 'Campaigns',           path: '/dashboard/artist-os/campaigns'                         },
    { label: 'Revenue',             path: '/dashboard/artist-os/revenue'                           },
    { label: 'Spending',            path: '/dashboard/artist-os/spending'                          },
    { label: 'Recoupment',          path: '/dashboard/artist-os/recoupment'                        },
    { label: 'Requests',            path: '/dashboard/artist-os/requests'                          },
    { label: 'Team',                path: '/dashboard/artist-os/team'                              },
    { label: 'Updates',             path: '/dashboard/artist-os/updates'                           },
    { label: 'Roster Readiness',    path: '/dashboard/artist-os/roster-readiness'                  },
    { label: 'Data Enrichment',     path: '/dashboard/artist-os/data-enrichment'                   },
    { label: 'Data Quality',        path: '/dashboard/artist-os/data-quality'                      },
    { label: 'Pending Updates',     path: '/dashboard/artist-os/pending-updates'                   },
    { label: 'Dropped Queue',       path: '/dashboard/artist-os/dropped-queue'                     },
    { label: 'Settings',            path: '/dashboard/artist-os/settings'                          },
  ],
};
