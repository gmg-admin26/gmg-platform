import { SIGNED_ARTISTS, type SignedArtist } from '../data/artistRosterData';
import { useRole } from '../../auth/RoleContext';

const ADMIN_DEMO_ARTIST_ID = 'AOS-079';

/**
 * Resolves the active artist for the current user session.
 *
 * Rules:
 * - admin_team: sees the demo artist (AOS-079) — they have global access
 * - artist_manager / label_partner: must have artistIds assigned; first ID is used
 * - No artistIds assigned → returns null (no cross-artist fallback ever)
 * - Artist ID not found in roster → returns null
 */
export function useActiveArtist(): SignedArtist | null {
  const { roleState } = useRole();
  const role = roleState.role;
  const artistIds = roleState.user?.artistIds;

  if (role === 'admin_team') {
    return SIGNED_ARTISTS.find(a => a.id === ADMIN_DEMO_ARTIST_ID) ?? null;
  }

  if (!artistIds || artistIds.length === 0) return null;

  const artistId = artistIds[0];
  return SIGNED_ARTISTS.find(a => a.id === artistId) ?? null;
}

export function useActiveArtistId(): string | null {
  return useActiveArtist()?.id ?? null;
}

/**
 * Returns the list of all artists accessible to the current user.
 * Admin sees all; others see only their assigned artists.
 */
export function useAccessibleArtists(): SignedArtist[] {
  const { roleState } = useRole();
  const role = roleState.role;
  const artistIds = roleState.user?.artistIds;

  if (role === 'admin_team') {
    return SIGNED_ARTISTS;
  }

  if (!artistIds || artistIds.length === 0) return [];
  return SIGNED_ARTISTS.filter(a => artistIds.includes(a.id));
}
