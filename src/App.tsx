import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import ChefCherylLayout from './chefcheryl/ChefCherylLayout';
import CCHome from './chefcheryl/pages/CCHome';
import CCClasses from './chefcheryl/pages/CCClasses';
import CCReserve from './chefcheryl/pages/CCReserve';
import CCGallery from './chefcheryl/pages/CCGallery';
import CCAbout from './chefcheryl/pages/CCAbout';
import CCFAQ from './chefcheryl/pages/CCFAQ';
import CCContact from './chefcheryl/pages/CCContact';
import { AuthProvider } from './auth/AuthContext';
import { IndustryOSProvider } from './auth/IndustryOSContext';
import { RoleProvider } from './auth/RoleContext';
import { AutopilotProvider } from './dashboard/context/AutopilotContext';
import { HelpProvider } from './dashboard/context/HelpContext';
import { TaskProvider } from './dashboard/context/TaskContext';
import TaskSubmitModal from './dashboard/components/tasks/TaskSubmitModal';
import TaskDetailModal from './dashboard/components/tasks/TaskDetailModal';
import ProtectedRoute from './auth/ProtectedRoute';
import ArtistOSProtectedRoute from './auth/ArtistOSProtectedRoute';
import InternalProtectedRoute from './auth/InternalProtectedRoute';
import CatalogOSProtectedRoute from './auth/CatalogOSProtectedRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import SignalActivityTicker from './components/SignalActivityTicker';
import Home from './pages/Home';
import Platform from './pages/Platform';
import PlatformAITools from './pages/PlatformAITools';
import PlatformOperations from './pages/PlatformOperations';
import PlatformGrowth from './pages/PlatformGrowth';
import PlatformLogin from './pages/PlatformLogin';
import Rocksteady from './pages/Rocksteady';
import Catalog from './pages/Catalog';
import CatalogPartnerships from './pages/CatalogPartnerships';
import Merch from './pages/Merch';
import Shop from './pages/Shop';
import Media from './pages/Media';
import About from './pages/About';
import Contact from './pages/Contact';
import AITools from './pages/AITools';
import Operations from './pages/Operations';
import ArtistGrowth from './pages/ArtistGrowth';
import AIMarketingTools from './pages/AIMarketingTools';
import StartHere from './pages/StartHere';
import GetStarted from './pages/GetStarted';
import IntakeForm from './pages/IntakeForm';
import ThankYou from './pages/ThankYou';
import IndustryOS from './pages/IndustryOS';
import IndustryOSSignup from './pages/IndustryOSSignup';
import IndustryOSLayout from './pages/industryOS/IndustryOSLayout';
import IndustryOSOverview from './pages/industryOS/IndustryOSOverview';
import IndustryOSNetwork from './pages/industryOS/IndustryOSNetwork';
import IndustryOSAICoworkers from './pages/industryOS/IndustryOSAICoworkers';
import IndustryOSProfile from './pages/industryOS/IndustryOSProfile';
import IndustryOSProjectOS from './pages/industryOS/IndustryOSProjectOS';
import IndustryOSBoutique from './pages/industryOS/IndustryOSBoutique';
import ProjectOS from './pages/ProjectOS';
import Press from './pages/Press';
import DashboardLayout from './dashboard/DashboardLayout';
import CommandCenter from './dashboard/pages/CommandCenter';
import RocksteadyLogin from './dashboard/pages/RocksteadyLogin';
import ArtistOSLogin from './dashboard/pages/ArtistOSLogin';
import IndustryOSLogin from './pages/IndustryOSLogin';
import CatalogOSLogin from './pages/CatalogOSLogin';
import CatalogOS from './pages/CatalogOS';
import ArtistOSRoster from './dashboard/pages/ArtistOSRoster';
import ArtistOSArtists from './dashboard/pages/ArtistOSArtists';
import ArtistOSReleases from './dashboard/pages/ArtistOSReleases';
import ArtistOSAudience from './dashboard/pages/ArtistOSAudience';
import ArtistOSRevenue from './dashboard/pages/ArtistOSRevenue';
import ArtistOSSpending from './dashboard/pages/ArtistOSSpending';
import ArtistOSRecoupment from './dashboard/pages/ArtistOSRecoupment';
import ArtistOSCampaigns from './dashboard/pages/ArtistOSCampaigns';
import ArtistOSTeam from './dashboard/pages/ArtistOSTeam';
import ArtistOSSettings from './dashboard/pages/ArtistOSSettings';
import DataQualityAudit from './dashboard/pages/DataQualityAudit';
import RosterReadiness from './dashboard/pages/RosterReadiness';
import DataEnrichment from './dashboard/pages/DataEnrichment';
import RocksteadyDashboard from './dashboard/pages/RocksteadyDashboard';
import ScoutNetwork from './dashboard/pages/ScoutNetwork';
import ScoutDetail from './dashboard/pages/ScoutDetail';
import Heatmaps from './dashboard/pages/Heatmaps';
import CultureMap from './dashboard/pages/CultureMap';
import RocksteadySettings from './dashboard/pages/RocksteadySettings';
import RocksteadyAlerts from './dashboard/pages/RocksteadyAlerts';
import TopDiscoveries from './dashboard/pages/TopDiscoveries';
import DiscoveryRadar from './dashboard/pages/DiscoveryRadar';
import HotArtists from './dashboard/pages/HotArtists';
import RocksteadyReports from './dashboard/pages/RocksteadyReports';
import ArtistRoster from './dashboard/pages/ArtistRoster';
import CampaignEngine from './dashboard/pages/CampaignEngine';
import CatalogIntel from './dashboard/pages/CatalogIntel';
import MerchRevenue from './dashboard/pages/MerchRevenue';
import DashboardReports from './dashboard/pages/DashboardReports';
import DashboardSettings from './dashboard/pages/DashboardSettings';
import AdminOS from './dashboard/pages/AdminOS';
import AdminCommandCenter from './dashboard/admin/pages/CommandCenter';
import ProjectOperations from './dashboard/admin/pages/ProjectOperations';
import ProjectSafeAdmin from './dashboard/admin/pages/ProjectSafeAdmin';
import BusinessAffairs from './dashboard/admin/pages/BusinessAffairs';
import FinanceAccounting from './dashboard/admin/pages/FinanceAccounting';
import AgentWorkspace from './dashboard/admin/pages/AgentWorkspace';
import AgentCategories from './dashboard/admin/pages/AgentCategories';
import AgentAssignments from './dashboard/admin/pages/AgentAssignments';
import AgentActivityLog from './dashboard/admin/pages/AgentActivityLog';
import AdminSectionPage from './dashboard/admin/pages/SectionPage';
import ArtistOS from './dashboard/pages/ArtistOS';
import ArtistOSOverview from './dashboard/pages/ArtistOSOverview';
import ArtistOSUpdates from './dashboard/pages/ArtistOSUpdates';
import ArtistOSRequests from './dashboard/pages/ArtistOSRequests';
import { CatalogAdminLayout, CatalogClientLayout } from './dashboard/pages/catalogOS/CatalogOSLayout';
import COSOverview from './dashboard/pages/catalogOS/COSOverview';
import COSValue from './dashboard/pages/catalogOS/COSValue';
import COSRevenue from './dashboard/pages/catalogOS/COSRevenue';
import COSTasks from './dashboard/pages/catalogOS/COSTasks';
import COSTeamProgress from './dashboard/pages/catalogOS/COSTeamProgress';
import COSTimeline from './dashboard/pages/catalogOS/COSTimeline';
import COSCampaigns from './dashboard/pages/catalogOS/COSCampaigns';
import COSFans from './dashboard/pages/catalogOS/COSFans';
import COSTouring from './dashboard/pages/catalogOS/COSTouring';
import COSBrand from './dashboard/pages/catalogOS/COSBrand';
import COSInventory from './dashboard/pages/catalogOS/COSInventory';
import COSAssets from './dashboard/pages/catalogOS/COSAssets';
import COSRoster from './dashboard/pages/catalogOS/COSRoster';
import COSRights from './dashboard/pages/catalogOS/COSRights';
import COSWorkers from './dashboard/pages/catalogOS/COSWorkers';
import COSMeetings from './dashboard/pages/catalogOS/COSMeetings';
import COSEntities from './dashboard/pages/catalogOS/COSEntities';
import COSFutures from './dashboard/pages/catalogOS/COSFutures';
import COSDroppedQueue from './dashboard/pages/catalogOS/COSDroppedQueue';
import COSAdminView from './dashboard/pages/catalogOS/COSAdminView';
import COSTeamView from './dashboard/pages/catalogOS/COSTeamView';
import DealPipeline from './dashboard/pages/DealPipeline';
import WeeklySignings from './dashboard/pages/WeeklySignings';
import ArtistOSCampaignCenter from './dashboard/pages/ArtistOSCampaignCenter';
import ArtistProfile from './dashboard/pages/ArtistProfile';
import PendingUpdatesQueue from './dashboard/pages/PendingUpdatesQueue';
import DroppedQueue from './dashboard/pages/DroppedQueue';
import LabelsPage from './dashboard/pages/LabelsPage';
import LabelDetailPage from './dashboard/pages/LabelDetailPage';
import FanOS from './dashboard/pages/FanOS';
import SystemHub from './pages/SystemHub';

function CatalogOSIndexDispatch() {
  const cosRole = (() => {
    try { return localStorage.getItem('catalogos_role') || sessionStorage.getItem('catalogos_role') || ''; } catch { return ''; }
  })();
  const cosClientId = (() => {
    try { return localStorage.getItem('catalogos_client_id') || sessionStorage.getItem('catalogos_client_id') || ''; } catch { return ''; }
  })();
  // Admin → internal admin view
  if (cosRole === 'catalog_admin') return <COSAdminView />;
  // No client ID → admin view as fallback
  if (!cosClientId) return <COSAdminView />;
  // Marketing team → restricted team view
  if (cosRole === 'catalog_team') return <Navigate to={`/catalog/app/team/${cosClientId}`} replace />;
  // Client owner → full client page
  return <Navigate to={`/catalog/app/client/${cosClientId}`} replace />;
}

// Slug → UUID map for friendly client URLs
const CLIENT_SLUG_MAP: Record<string, string> = {
  'bassnectar':            'a1000000-0000-0000-0000-000000000001',
  'santigold':             'a2000000-0000-0000-0000-000000000002',
  'virgin-catalog-artist': 'a3000000-0000-0000-0000-000000000003',
};

// Full client view — resolves slug or UUID from URL param
function COSClientRoute() {
  const { clientId } = useParams<{ clientId: string }>();
  const resolvedId = clientId ? (CLIENT_SLUG_MAP[clientId] ?? clientId) : undefined;
  return <COSOverview forceClientId={resolvedId} />;
}

// Restricted team view — identified by URL clientId param
function COSTeamRoute() {
  const { clientId } = useParams<{ clientId: string }>();
  return <COSTeamView forceClientId={clientId} />;
}

function PublicLayout() {
  return (
    <div className="min-h-screen bg-black">
      <PageTransition />
      <SignalActivityTicker />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/platform/login" element={<PlatformLogin />} />
        <Route path="/platform-login" element={<PlatformLogin />} />
        <Route path="/platform/ai-artist-tools" element={<PlatformAITools />} />
        <Route path="/platform/artist-operations" element={<PlatformOperations />} />
        <Route path="/platform/artist-growth" element={<PlatformGrowth />} />
        <Route path="/discovery" element={<Rocksteady />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog-partnerships" element={<CatalogPartnerships />} />
        <Route path="/media" element={<Media />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ai-tools" element={<AITools />} />
        <Route path="/rocksteady" element={<Rocksteady />} />
        <Route path="/operations" element={<Operations />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/artist-growth" element={<ArtistGrowth />} />
        <Route path="/ai-music-marketing-tools" element={<AIMarketingTools />} />
        <Route path="/start-here" element={<StartHere />} />
        <Route path="/intake/:role" element={<IntakeForm />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="/industry-os" element={<IndustryOS />} />
        <Route path="/catalog-os" element={<CatalogOS />} />
        <Route path="/press" element={<Press />} />
      </Routes>
      <div className="footer-transition" />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <IndustryOSProvider>
      <RoleProvider>
      <AutopilotProvider>
      <HelpProvider>
      <TaskProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<Navigate to="/login/rocksteady" replace />} />
          <Route path="/login/rocksteady" element={<RocksteadyLogin />} />
          <Route path="/login/artist-os" element={<ArtistOSLogin />} />
          <Route path="/login/industry-os" element={<IndustryOSLogin />} />
          <Route path="/industry-os/login" element={<IndustryOSLogin />} />
          <Route path="/industry-os/signup" element={<IndustryOSSignup />} />
          <Route path="/industry-os/app" element={<IndustryOSLayout />}>
            <Route index element={<IndustryOSOverview />} />
            <Route path="network" element={<IndustryOSNetwork />} />
            <Route path="ai-coworkers" element={<IndustryOSAICoworkers />} />
            <Route path="project" element={<IndustryOSProjectOS />} />
            <Route path="boutique" element={<IndustryOSBoutique />} />
            <Route path="profile" element={<IndustryOSProfile />} />
          </Route>
          <Route path="/project-os" element={<ProjectOS />} />
          <Route path="/system-hub" element={<InternalProtectedRoute><SystemHub /></InternalProtectedRoute>} />
          <Route path="/login/catalog-os" element={<CatalogOSLogin />} />
          <Route path="/catalog/login" element={<CatalogOSLogin />} />
          <Route path="/catalog-os/login" element={<CatalogOSLogin />} />
          {/* ── Catalog OS: Admin shell — no CatalogClientProvider ── */}
          <Route path="/catalog/app" element={<CatalogOSProtectedRoute><CatalogAdminLayout /></CatalogOSProtectedRoute>}>
            <Route index          element={<CatalogOSIndexDispatch />} />
            <Route path="admin"         element={<COSAdminView />} />
            <Route path="roster"        element={<COSRoster />} />
            <Route path="dropped-queue" element={<COSDroppedQueue />} />
            <Route path="futures"       element={<COSFutures />} />
            <Route path="tasks"         element={<COSTasks />} />
            <Route path="progress"      element={<COSTeamProgress />} />
          </Route>

          {/* ── Catalog OS: Client shell — CatalogClientProvider per client ── */}
          <Route path="/catalog/app/client/:clientId" element={<CatalogOSProtectedRoute><CatalogClientLayout /></CatalogOSProtectedRoute>}>
            <Route index          element={<COSClientRoute />} />
            <Route path="overview"  element={<COSClientRoute />} />
            <Route path="value"     element={<COSValue />} />
            <Route path="assets"    element={<COSAssets />} />
            <Route path="revenue"   element={<COSRevenue />} />
            <Route path="tasks"     element={<COSTasks />} />
            <Route path="progress"  element={<COSTeamProgress />} />
            <Route path="timeline"  element={<COSTimeline />} />
            <Route path="campaigns" element={<COSCampaigns />} />
            <Route path="fans"      element={<COSFans />} />
            <Route path="fan-os"    element={<FanOS />} />
            <Route path="touring"   element={<COSTouring />} />
            <Route path="brand"     element={<COSBrand />} />
            <Route path="inventory" element={<COSInventory />} />
            <Route path="rights"    element={<COSRights />} />
            <Route path="workers"   element={<COSWorkers />} />
            <Route path="meetings"  element={<COSMeetings />} />
            <Route path="entities"  element={<COSEntities />} />
          </Route>

          {/* ── Catalog OS: Team shell — CatalogClientProvider for team view ── */}
          <Route path="/catalog/app/team/:clientId" element={<CatalogOSProtectedRoute><CatalogClientLayout /></CatalogOSProtectedRoute>}>
            <Route index element={<COSTeamRoute />} />
          </Route>
          <Route path="/rocksteady/login" element={<Navigate to="/login/rocksteady" replace />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<InternalProtectedRoute><CommandCenter /></InternalProtectedRoute>} />
            <Route path="rocksteady" element={<InternalProtectedRoute><RocksteadyDashboard /></InternalProtectedRoute>} />
            <Route path="rocksteady/scouts" element={<InternalProtectedRoute><ScoutNetwork /></InternalProtectedRoute>} />
            <Route path="rocksteady/scouts/:scoutId" element={<InternalProtectedRoute><ScoutDetail /></InternalProtectedRoute>} />
            <Route path="rocksteady/heatmaps" element={<InternalProtectedRoute><Heatmaps /></InternalProtectedRoute>} />
            <Route path="rocksteady/culture" element={<InternalProtectedRoute><CultureMap /></InternalProtectedRoute>} />
            <Route path="rocksteady/alerts" element={<InternalProtectedRoute><RocksteadyAlerts /></InternalProtectedRoute>} />
            <Route path="rocksteady/discoveries" element={<InternalProtectedRoute><TopDiscoveries /></InternalProtectedRoute>} />
            <Route path="rocksteady/radar" element={<InternalProtectedRoute><DiscoveryRadar /></InternalProtectedRoute>} />
            <Route path="rocksteady/hot-artists" element={<InternalProtectedRoute><HotArtists /></InternalProtectedRoute>} />
            <Route path="rocksteady/reports" element={<InternalProtectedRoute><RocksteadyReports /></InternalProtectedRoute>} />
            <Route path="rocksteady/settings" element={<InternalProtectedRoute><RocksteadySettings /></InternalProtectedRoute>} />
            <Route path="rocksteady/pipeline" element={<InternalProtectedRoute><DealPipeline /></InternalProtectedRoute>} />
            <Route path="rocksteady/signings" element={<InternalProtectedRoute><WeeklySignings /></InternalProtectedRoute>} />
            <Route path="artists" element={<InternalProtectedRoute><ArtistRoster /></InternalProtectedRoute>} />
            <Route path="campaigns" element={<InternalProtectedRoute><CampaignEngine /></InternalProtectedRoute>} />
            <Route path="catalog" element={<InternalProtectedRoute><CatalogIntel /></InternalProtectedRoute>} />
            <Route path="merch" element={<InternalProtectedRoute><MerchRevenue /></InternalProtectedRoute>} />
            <Route path="reports" element={<InternalProtectedRoute><DashboardReports /></InternalProtectedRoute>} />
            <Route path="settings" element={<InternalProtectedRoute><DashboardSettings /></InternalProtectedRoute>} />
            <Route path="admin-os" element={<InternalProtectedRoute><AdminCommandCenter /></InternalProtectedRoute>} />
            <Route path="admin-os/legacy" element={<InternalProtectedRoute><AdminOS /></InternalProtectedRoute>} />
            <Route path="admin-os/priorities"    element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/risks-blocks"  element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/decisions"     element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/system-health" element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/digests"       element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/projects"                   element={<InternalProtectedRoute><ProjectOperations /></InternalProtectedRoute>} />
            <Route path="admin-os/projects/safes"             element={<InternalProtectedRoute><ProjectSafeAdmin /></InternalProtectedRoute>} />
            <Route path="admin-os/projects/payments"          element={<InternalProtectedRoute><ProjectSafeAdmin /></InternalProtectedRoute>} />
            <Route path="admin-os/projects/delayed"           element={<InternalProtectedRoute><ProjectSafeAdmin /></InternalProtectedRoute>} />
            <Route path="admin-os/projects/:tab"              element={<InternalProtectedRoute><ProjectOperations /></InternalProtectedRoute>} />

            <Route path="admin-os/artists"                    element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/artists/:sub"               element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/catalog"                    element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/catalog/:sub"               element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/legal"                      element={<InternalProtectedRoute><BusinessAffairs /></InternalProtectedRoute>} />
            <Route path="admin-os/legal/:tab"                 element={<InternalProtectedRoute><BusinessAffairs /></InternalProtectedRoute>} />

            <Route path="admin-os/finance"                    element={<InternalProtectedRoute><FinanceAccounting /></InternalProtectedRoute>} />
            <Route path="admin-os/finance/:tab"               element={<InternalProtectedRoute><FinanceAccounting /></InternalProtectedRoute>} />

            <Route path="admin-os/banking"                    element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/banking/:sub"               element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/risk"                       element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/risk/:sub"                  element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/marketing"                  element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/marketing/:sub"             element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/comms"                      element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/comms/:sub"                 element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/people"                     element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/people/:sub"                element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/partners"                   element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/partners/:sub"              element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/touring"                    element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />
            <Route path="admin-os/touring/:sub"               element={<InternalProtectedRoute><AdminSectionPage /></InternalProtectedRoute>} />

            <Route path="admin-os/agents"                     element={<InternalProtectedRoute><AgentWorkspace /></InternalProtectedRoute>} />
            <Route path="admin-os/agents/categories"          element={<InternalProtectedRoute><AgentCategories /></InternalProtectedRoute>} />
            <Route path="admin-os/agents/assignments"         element={<InternalProtectedRoute><AgentAssignments /></InternalProtectedRoute>} />
            <Route path="admin-os/agents/activity"            element={<InternalProtectedRoute><AgentActivityLog /></InternalProtectedRoute>} />
            <Route path="admin-os/agents/:agentSlug"          element={<InternalProtectedRoute><AgentWorkspace /></InternalProtectedRoute>} />

            <Route path="operations-os" element={<Navigate to="/dashboard/admin-os" replace />} />
            <Route path="operations-os/*" element={<Navigate to="/dashboard/admin-os" replace />} />
            <Route path="artist-os" element={<ArtistOSProtectedRoute><ArtistOSOverview /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/roster" element={<ArtistOSProtectedRoute><ArtistOSRoster /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/releases" element={<ArtistOSProtectedRoute><ArtistOSReleases /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/audience" element={<ArtistOSProtectedRoute><ArtistOSAudience /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/revenue" element={<ArtistOSProtectedRoute><ArtistOSRevenue /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/spending" element={<ArtistOSProtectedRoute><ArtistOSSpending /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/recoupment" element={<ArtistOSProtectedRoute><ArtistOSRecoupment /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/campaigns" element={<ArtistOSProtectedRoute><ArtistOSCampaigns /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/team" element={<ArtistOSProtectedRoute allowedRoles={['admin_team']}><ArtistOSTeam /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/settings" element={<ArtistOSProtectedRoute><ArtistOSSettings /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/data-quality" element={<ArtistOSProtectedRoute><DataQualityAudit /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/roster-readiness" element={<ArtistOSProtectedRoute><RosterReadiness /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/data-enrichment" element={<ArtistOSProtectedRoute><DataEnrichment /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/updates" element={<ArtistOSProtectedRoute><ArtistOSUpdates /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/requests" element={<ArtistOSProtectedRoute><ArtistOSRequests /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/fan-os" element={<ArtistOSProtectedRoute><FanOS /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/campaign-center" element={<ArtistOSProtectedRoute><ArtistOSCampaignCenter /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/roster/:id" element={<ArtistOSProtectedRoute><ArtistProfile /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/pending-updates" element={<ArtistOSProtectedRoute allowedRoles={['admin_team']}><PendingUpdatesQueue /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/dropped-queue" element={<ArtistOSProtectedRoute allowedRoles={['admin_team']}><DroppedQueue /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/labels" element={<ArtistOSProtectedRoute allowedRoles={['admin_team', 'label_partner']}><LabelsPage /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/labels/:id" element={<ArtistOSProtectedRoute allowedRoles={['admin_team', 'label_partner']}><LabelDetailPage /></ArtistOSProtectedRoute>} />
            <Route path="artist-os/artists" element={<ArtistOSProtectedRoute allowedRoles={['admin_team', 'label_partner']}><ArtistOSArtists /></ArtistOSProtectedRoute>} />
            <Route path="catalog-os" element={<Navigate to="/catalog/app" replace />} />
            <Route path="catalog-os/*" element={<Navigate to="/catalog/app" replace />} />
          </Route>
          {/* Chef Cheryl Cooking Classes */}
          <Route path="/chef-cheryl" element={<ChefCherylLayout />}>
            <Route index   element={<CCHome />} />
            <Route path="classes" element={<CCClasses />} />
            <Route path="reserve" element={<CCReserve />} />
            <Route path="gallery" element={<CCGallery />} />
            <Route path="about"   element={<CCAbout />} />
            <Route path="faq"     element={<CCFAQ />} />
            <Route path="contact" element={<CCContact />} />
          </Route>
          <Route path="/*" element={<PublicLayout />} />
        </Routes>
      </Router>
      <TaskSubmitModal />
      <TaskDetailModal />
      </TaskProvider>
      </HelpProvider>
      </AutopilotProvider>
      </RoleProvider>
      </IndustryOSProvider>
    </AuthProvider>
  );
}

export default App;
