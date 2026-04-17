import { useRole } from '../../auth/RoleContext';
import ArtistOS from './ArtistOS';
import ArtistOSLabelView from './ArtistOSLabelView';
import ArtistOSAdminView from './ArtistOSAdminView';

export default function ArtistOSOverview() {
  const { roleState } = useRole();
  const role = roleState.role ?? 'artist_manager';

  if (role === 'label_partner') return <ArtistOSLabelView />;
  if (role === 'admin_team') return <ArtistOSAdminView />;
  return <ArtistOS />;
}
