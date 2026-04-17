import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Music, Building2, Folder, Users, Cpu, Search, CheckCircle, ArrowRight, ChevronDown, Shield, Calculator, Landmark, MonitorPlay } from 'lucide-react';
import { supabase } from '../lib/supabase';

type PathKey = 'artist' | 'label' | 'catalog' | 'brand' | 'scout' | 'ai' | 'protect' | 'accounting' | 'banking' | 'platform';
type ProtectPackage = 'artist' | 'company' | 'professional' | '';

interface PathConfig {
  key: PathKey;
  label: string;
  icon: React.ElementType;
  tagline: string;
  accentColor: string;
  glowColor: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
}

interface PathGroup {
  label: string;
  paths: PathConfig[];
}

const pathGroups: PathGroup[] = [
  {
    label: 'Primary Paths',
    paths: [
      {
        key: 'artist',
        label: 'Artist',
        icon: Music,
        tagline: "Build your career with GMG's AI-powered growth systems, release strategy, and infrastructure.",
        accentColor: 'from-violet-500/20 to-transparent',
        glowColor: 'rgba(139, 92, 246, 0.35)',
        borderColor: 'border-violet-500/40',
        bgColor: 'bg-violet-500/10',
        textColor: 'text-violet-400',
      },
      {
        key: 'label',
        label: 'Label',
        icon: Building2,
        tagline: 'Scale your roster using discovery intelligence, marketing systems, and operational infrastructure.',
        accentColor: 'from-cyan-500/20 to-transparent',
        glowColor: 'rgba(6, 182, 212, 0.3)',
        borderColor: 'border-cyan-500/40',
        bgColor: 'bg-cyan-500/10',
        textColor: 'text-cyan-400',
      },
      {
        key: 'catalog',
        label: 'Catalog Owner',
        icon: Folder,
        tagline: 'Maximize catalog value through data-driven growth, optimization, and long-term audience expansion.',
        accentColor: 'from-emerald-500/20 to-transparent',
        glowColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'border-emerald-500/40',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
      },
    ],
  },
  {
    label: 'Professional Paths',
    paths: [
      {
        key: 'brand',
        label: 'Creative Collaborator',
        icon: Users,
        tagline: 'Collaborate with GMG to build and launch culture-driven campaigns, media, and creative initiatives.',
        accentColor: 'from-amber-500/20 to-transparent',
        glowColor: 'rgba(245, 158, 11, 0.3)',
        borderColor: 'border-amber-500/40',
        bgColor: 'bg-amber-500/10',
        textColor: 'text-amber-400',
      },
      {
        key: 'scout',
        label: 'Industry Operator',
        icon: Search,
        tagline: 'Work inside GMG systems to discover talent, execute strategy, and operate across real campaigns.',
        accentColor: 'from-rose-500/20 to-transparent',
        glowColor: 'rgba(244, 63, 94, 0.3)',
        borderColor: 'border-rose-500/40',
        bgColor: 'bg-rose-500/10',
        textColor: 'text-rose-400',
      },
      {
        key: 'ai',
        label: 'Artist OS',
        icon: Cpu,
        tagline: "Access GMG's operating system for artist growth — built for partners working at scale across music, media, and culture.",
        accentColor: 'from-blue-500/20 to-transparent',
        glowColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'border-blue-500/40',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
      },
    ],
  },
  {
    label: 'Services',
    paths: [
      {
        key: 'protect',
        label: 'Artist OS Protect',
        icon: Shield,
        tagline: 'Insurance and risk infrastructure designed for artists, companies, and creative operations.',
        accentColor: 'from-emerald-500/20 to-transparent',
        glowColor: 'rgba(16, 185, 129, 0.3)',
        borderColor: 'border-emerald-500/40',
        bgColor: 'bg-emerald-500/10',
        textColor: 'text-emerald-400',
      },
      {
        key: 'accounting',
        label: 'Artist OS Accounting',
        icon: Calculator,
        tagline: 'Financial systems for artists and companies, including reporting, tracking, and optimization.',
        accentColor: 'from-sky-500/20 to-transparent',
        glowColor: 'rgba(14, 165, 233, 0.3)',
        borderColor: 'border-sky-500/40',
        bgColor: 'bg-sky-500/10',
        textColor: 'text-sky-400',
      },
      {
        key: 'banking',
        label: 'Artist OS Banking',
        icon: Landmark,
        tagline: 'Banking infrastructure, capital access, and financial tools for modern creative businesses.',
        accentColor: 'from-blue-500/20 to-transparent',
        glowColor: 'rgba(59, 130, 246, 0.3)',
        borderColor: 'border-blue-500/40',
        bgColor: 'bg-blue-500/10',
        textColor: 'text-blue-400',
      },
    ],
  },
];

const paths: PathConfig[] = pathGroups.flatMap(g => g.paths);

const platformPath: PathConfig = {
  key: 'platform',
  label: 'Platform Access',
  icon: MonitorPlay,
  tagline: 'Request access to the GMG platform for approved artists, partners, and collaborators.',
  accentColor: 'from-teal-500/20 to-transparent',
  glowColor: 'rgba(20, 184, 166, 0.3)',
  borderColor: 'border-teal-500/40',
  bgColor: 'bg-teal-500/10',
  textColor: 'text-teal-400',
};

type FormData = {
  fullName: string;
  email: string;
  companyName: string;
  website: string;
  lookingFor: string;
  message: string;
  artistName: string;
  primaryGenre: string;
  currentStage: string;
  supportNeeded: string;
  labelName: string;
  rosterSize: string;
  distributionSetup: string;
  growthPriorities: string;
  catalogName: string;
  catalogSize: string;
  rightsSituation: string;
  unlockGoals: string;
  brandCompany: string;
  partnershipType: string;
  campaignTimeline: string;
  budgetRange: string;
  scoutRole: string;
  scoutOrganization: string;
  areaOfFocus: string;
  workInterest: string;
  platformName: string;
  productCategory: string;
  userBase: string;
  partnershipNeed: string;
  protectPackage: string;
  protectFullName: string;
  protectCompany: string;
  protectEmail: string;
  protectPhone: string;
  protectState: string;
  protectRole: string;
  protectInsuranceStatus: string;
  protectAreasOfInterest: string;
  protectDescription: string;
  protectRevenueRange: string;
  protectActivities: string[];
  accountingPackage: string;
  accountingFullName: string;
  accountingCompany: string;
  accountingEmail: string;
  accountingPhone: string;
  accountingState: string;
  accountingRole: string;
  accountingCurrentSetup: string;
  accountingRevenueRange: string;
  accountingRevenueStreams: string;
  accountingNeedTaxPrep: string;
  accountingNeedIncomeVerification: string;
  accountingDescription: string;
  bankingPackage: string;
  bankingFullName: string;
  bankingCompany: string;
  bankingEmail: string;
  bankingPhone: string;
  bankingState: string;
  bankingRole: string;
  bankingCurrentSetup: string;
  bankingRevenueRange: string;
  bankingMonthlyCashFlow: string;
  bankingInterestedAccounts: string;
  bankingInterestedSavings: string;
  bankingInterestedCorporateCard: string;
  bankingInterestedRoyaltyCredit: string;
  bankingInterestedAdvanceLending: string;
  bankingDescription: string;
  platformFullName: string;
  platformPartnerName: string;
  platformEmail: string;
  platformPhone: string;
  platformRole: string;
  platformWebsite: string;
  platformWhyAccess: string;
  platformAreaOfInterest: string;
  platformNotes: string;
};

const initialFormData: FormData = {
  fullName: '', email: '', companyName: '', website: '', lookingFor: '', message: '',
  artistName: '', primaryGenre: '', currentStage: '', supportNeeded: '',
  labelName: '', rosterSize: '', distributionSetup: '', growthPriorities: '',
  catalogName: '', catalogSize: '', rightsSituation: '', unlockGoals: '',
  brandCompany: '', partnershipType: '', campaignTimeline: '', budgetRange: '',
  scoutRole: '', scoutOrganization: '', areaOfFocus: '', workInterest: '',
  platformName: '', productCategory: '', userBase: '', partnershipNeed: '',
  protectPackage: '', protectFullName: '', protectCompany: '', protectEmail: '',
  protectPhone: '', protectState: '', protectRole: '', protectInsuranceStatus: '',
  protectAreasOfInterest: '', protectDescription: '', protectRevenueRange: '',
  protectActivities: [],
  accountingPackage: '', accountingFullName: '', accountingCompany: '', accountingEmail: '',
  accountingPhone: '', accountingState: '', accountingRole: '', accountingCurrentSetup: '',
  accountingRevenueRange: '', accountingRevenueStreams: '', accountingNeedTaxPrep: '',
  accountingNeedIncomeVerification: '', accountingDescription: '',
  bankingPackage: '', bankingFullName: '', bankingCompany: '', bankingEmail: '',
  bankingPhone: '', bankingState: '', bankingRole: '', bankingCurrentSetup: '',
  bankingRevenueRange: '', bankingMonthlyCashFlow: '', bankingInterestedAccounts: '',
  bankingInterestedSavings: '', bankingInterestedCorporateCard: '',
  bankingInterestedRoyaltyCredit: '', bankingInterestedAdvanceLending: '',
  bankingDescription: '',
  platformFullName: '', platformPartnerName: '', platformEmail: '', platformPhone: '',
  platformRole: '', platformWebsite: '', platformWhyAccess: '', platformAreaOfInterest: '',
  platformNotes: '',
};

function InputField({ label, name, value, onChange, placeholder, type = 'text', required = false }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/18 focus:bg-white/[0.05] transition-all duration-200 text-sm"
      />
    </div>
  );
}

function TextAreaField({ label, name, value, onChange, placeholder, required = false, rows = 3 }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/18 focus:bg-white/[0.05] transition-all duration-200 text-sm resize-none"
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white focus:outline-none focus:border-white/18 focus:bg-white/[0.05] transition-all duration-200 text-sm appearance-none cursor-pointer"
          style={{ colorScheme: 'dark' }}
        >
          <option value="">Select one</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
      </div>
    </div>
  );
}

const roleOptions = [
  { value: 'recording-artist', label: 'Recording Artist' },
  { value: 'dj-producer', label: 'DJ / Producer' },
  { value: 'performer', label: 'Performer / Touring Act' },
  { value: 'songwriter-writer', label: 'Songwriter / Writer' },
  { value: 'label', label: 'Label / Music Company' },
  { value: 'management', label: 'Management Firm' },
  { value: 'touring-company', label: 'Touring / Live Events Company' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'engineer', label: 'Engineer / Studio Professional' },
  { value: 'director-photographer', label: 'Director / Photographer' },
  { value: 'consultant', label: 'Consultant / Manager' },
  { value: 'other', label: 'Other' },
];

const revenueRangeOptions = [
  { value: 'pre-revenue', label: 'Pre-revenue / emerging' },
  { value: 'under-100k', label: 'Under $100K / year' },
  { value: '100k-500k', label: '$100K–$500K / year' },
  { value: '500k-2m', label: '$500K–$2M / year' },
  { value: '2m+', label: '$2M+ / year' },
];

const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'maybe', label: 'Possibly / Unsure' },
];

export default function GetStarted() {
  const [searchParams] = useSearchParams();
  const [selectedPath, setSelectedPath] = useState<PathKey | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protectParam = searchParams.get('protect');
    const serviceParam = searchParams.get('service');
    const packageParam = searchParams.get('package');

    if (protectParam && ['artist', 'company', 'professional'].includes(protectParam)) {
      setSelectedPath('protect');
      setFormData(prev => ({ ...prev, protectPackage: protectParam }));
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else if (serviceParam === 'accounting' && packageParam) {
      setSelectedPath('accounting');
      if (['artist', 'company', 'professional'].includes(packageParam)) {
        setFormData(prev => ({ ...prev, accountingPackage: packageParam }));
      }
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else if (serviceParam === 'banking' && packageParam) {
      setSelectedPath('banking');
      if (['artist', 'company', 'professional'].includes(packageParam)) {
        setFormData(prev => ({ ...prev, bankingPackage: packageParam }));
      }
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } else if (serviceParam === 'platform-access') {
      setSelectedPath('platform');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  }, [searchParams]);

  const activePath = paths.find(p => p.key === selectedPath) ?? (selectedPath === 'platform' ? platformPath : undefined);

  const getButtonLabel = (key: PathKey | null) => {
    if (!key) return 'Connect with GMG';
    if (key === 'artist' || key === 'scout') return 'Submit Application';
    if (key === 'brand') return 'Submit Collaboration Inquiry';
    if (key === 'protect') return 'Submit Protect Inquiry';
    if (key === 'accounting') return 'Submit Accounting Inquiry';
    if (key === 'banking') return 'Submit Banking Inquiry';
    if (key === 'platform') return 'Submit Access Request';
    return 'Connect with GMG';
  };

  const handlePathSelect = (key: PathKey) => {
    setSelectedPath(key);
    setError(null);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPath) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const submittedAt = new Date().toISOString();

      const payload: Record<string, string | null> = {
        selected_path: selectedPath,
        full_name: formData.fullName,
        email: formData.email,
        company_name: formData.companyName || null,
        website: formData.website || null,
        looking_for: formData.lookingFor || null,
        message: formData.message || null,
        submitted_at: submittedAt,
      };

      if (selectedPath === 'artist') {
        payload.artist_name = formData.artistName || null;
        payload.primary_genre = formData.primaryGenre || null;
        payload.current_stage = formData.currentStage || null;
        payload.support_needed = formData.supportNeeded || null;
      } else if (selectedPath === 'label') {
        payload.label_name = formData.labelName || null;
        payload.roster_size = formData.rosterSize || null;
        payload.distribution_setup = formData.distributionSetup || null;
        payload.growth_priorities = formData.growthPriorities || null;
      } else if (selectedPath === 'catalog') {
        payload.catalog_name = formData.catalogName || null;
        payload.catalog_size = formData.catalogSize || null;
        payload.rights_situation = formData.rightsSituation || null;
        payload.unlock_goals = formData.unlockGoals || null;
      } else if (selectedPath === 'brand') {
        payload.brand_company = formData.brandCompany || null;
        payload.partnership_type = formData.partnershipType || null;
        payload.campaign_timeline = formData.campaignTimeline || null;
        payload.budget_range = formData.budgetRange || null;
      } else if (selectedPath === 'scout') {
        payload.scout_role = formData.scoutRole || null;
        payload.scout_organization = formData.scoutOrganization || null;
        payload.area_of_focus = formData.areaOfFocus || null;
        payload.work_interest = formData.workInterest || null;
      } else if (selectedPath === 'ai') {
        payload.platform_name = formData.platformName || null;
        payload.product_category = formData.productCategory || null;
        payload.user_base = formData.userBase || null;
        payload.partnership_need = formData.partnershipNeed || null;
      } else if (selectedPath === 'protect') {
        payload.protect_package = formData.protectPackage || null;
        payload.protect_full_name = formData.protectFullName || null;
        payload.protect_company = formData.protectCompany || null;
        payload.protect_email = formData.protectEmail || null;
        payload.protect_phone = formData.protectPhone || null;
        payload.protect_state = formData.protectState || null;
        payload.protect_role = formData.protectRole || null;
        payload.protect_insurance_status = formData.protectInsuranceStatus || null;
        payload.protect_areas_of_interest = formData.protectAreasOfInterest || null;
        payload.protect_description = formData.protectDescription || null;
        payload.protect_revenue_range = formData.protectRevenueRange || null;
        payload.protect_activities = formData.protectActivities.join(', ') || null;
      } else if (selectedPath === 'accounting') {
        payload.accounting_package = formData.accountingPackage || null;
        payload.accounting_full_name = formData.accountingFullName || null;
        payload.accounting_company = formData.accountingCompany || null;
        payload.accounting_email = formData.accountingEmail || null;
        payload.accounting_phone = formData.accountingPhone || null;
        payload.accounting_state = formData.accountingState || null;
        payload.accounting_role = formData.accountingRole || null;
        payload.accounting_current_setup = formData.accountingCurrentSetup || null;
        payload.accounting_revenue_range = formData.accountingRevenueRange || null;
        payload.accounting_revenue_streams = formData.accountingRevenueStreams || null;
        payload.accounting_need_tax_prep = formData.accountingNeedTaxPrep || null;
        payload.accounting_need_income_verification = formData.accountingNeedIncomeVerification || null;
        payload.accounting_description = formData.accountingDescription || null;
      } else if (selectedPath === 'banking') {
        payload.banking_package = formData.bankingPackage || null;
        payload.banking_full_name = formData.bankingFullName || null;
        payload.banking_company = formData.bankingCompany || null;
        payload.banking_email = formData.bankingEmail || null;
        payload.banking_phone = formData.bankingPhone || null;
        payload.banking_state = formData.bankingState || null;
        payload.banking_role = formData.bankingRole || null;
        payload.banking_current_setup = formData.bankingCurrentSetup || null;
        payload.banking_revenue_range = formData.bankingRevenueRange || null;
        payload.banking_monthly_cash_flow = formData.bankingMonthlyCashFlow || null;
        payload.banking_interested_accounts = formData.bankingInterestedAccounts || null;
        payload.banking_interested_savings = formData.bankingInterestedSavings || null;
        payload.banking_interested_corporate_card = formData.bankingInterestedCorporateCard || null;
        payload.banking_interested_royalty_credit = formData.bankingInterestedRoyaltyCredit || null;
        payload.banking_interested_advance_lending = formData.bankingInterestedAdvanceLending || null;
        payload.banking_description = formData.bankingDescription || null;
      } else if (selectedPath === 'platform') {
        payload.platform_full_name = formData.platformFullName || null;
        payload.platform_partner_name = formData.platformPartnerName || null;
        payload.platform_email = formData.platformEmail || null;
        payload.platform_phone = formData.platformPhone || null;
        payload.platform_role = formData.platformRole || null;
        payload.platform_website = formData.platformWebsite || null;
        payload.platform_why_access = formData.platformWhyAccess || null;
        payload.platform_area_of_interest = formData.platformAreaOfInterest || null;
        payload.platform_notes = formData.platformNotes || null;
      }

      const { data: fnData, error: fnError } = await supabase.functions.invoke('send-intake-notification', {
        body: { ...payload },
      });

      if (fnError) {
        throw new Error(fnError.message || 'Failed to send inquiry.');
      }

      if (fnData && fnData.success === false) {
        throw new Error(fnData.error || 'Failed to send inquiry.');
      }

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission error:', err);
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again or email hq@greatermusicgroup.com directly.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, #0B0B0D 0%, #171322 40%, #0B0B0D 100%)'
      }}>
        <div className="relative z-10 max-w-lg mx-auto px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-7 h-7 text-emerald-400" />
          </div>
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 mb-4">Inquiry Received</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">Thank you.</h2>
          <p className="text-white/50 text-base leading-relaxed mb-10 font-light">
            Your inquiry has been received and the GMG team will follow up soon.
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelectedPath(null); setFormData(initialFormData); }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] rounded-full text-white/60 hover:text-white text-sm font-medium transition-all duration-300"
          >
            Back to Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{
      background: 'linear-gradient(160deg, #0B0B0D 0%, #171322 35%, #221B33 55%, #0B0B0D 100%)'
    }}>
      <div className="pointer-events-none fixed inset-0" style={{ zIndex: 0 }}>
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(75, 59, 120, 0.07) 0%, transparent 60%)'
        }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-10 pt-32 pb-24">

        <section className="text-center mb-14">
          <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-white/25 mb-5">GMG Intake</p>
          <h1 className="font-black tracking-tight leading-[0.95] text-white mb-5" style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}>
            Get Started with GMG
          </h1>
          <p className="text-base md:text-lg text-white/45 mb-3 font-light max-w-md mx-auto leading-relaxed">
            Choose your entry point into the GMG infrastructure.
          </p>
          <p className="text-sm text-white/28 max-w-xl mx-auto leading-relaxed font-light">
            Whether you are an artist, label, catalog owner, creative collaborator, industry operator, or Artist OS partner, GMG provides the infrastructure, intelligence, and operating support to help you grow.
          </p>
        </section>

        <section className="mb-2">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/20 text-center mb-6">Choose your path</p>
          <div className="space-y-6">
            {pathGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[9px] font-semibold tracking-[0.18em] uppercase text-white/18 mb-3 pl-0.5">{group.label}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {group.paths.map((path) => {
                    const Icon = path.icon;
                    const isSelected = selectedPath === path.key;
                    return (
                      <button
                        key={path.key}
                        id={path.key === 'brand' ? 'creative-collaborator' : undefined}
                        onClick={() => handlePathSelect(path.key)}
                        className={`group relative text-left p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? `${path.borderColor} bg-white/[0.04]`
                            : 'border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.035] hover:border-white/[0.09]'
                        }`}
                        style={isSelected ? {
                          boxShadow: `0 0 0 1px ${path.glowColor}, 0 8px 30px ${path.glowColor.replace('0.35', '0.1').replace('0.3', '0.08')}`
                        } : undefined}
                      >
                        {isSelected && (
                          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${path.accentColor} opacity-50`} />
                        )}
                        <div className="relative">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 transition-colors duration-300 ${
                            isSelected ? path.bgColor : 'bg-white/[0.04]'
                          }`}>
                            <Icon style={{ width: '1rem', height: '1rem' }} className={`transition-colors duration-300 ${
                              isSelected ? path.textColor : 'text-white/35 group-hover:text-white/55'
                            }`} />
                          </div>
                          <h3 className={`text-sm font-semibold mb-1 leading-tight transition-colors duration-300 ${
                            isSelected ? 'text-white' : 'text-white/65 group-hover:text-white/85'
                          }`}>
                            {path.label}
                          </h3>
                          <p className="text-xs text-white/30 leading-relaxed font-light">
                            {path.tagline}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </section>

        <div
          ref={formRef}
          className={`transition-all duration-500 ease-out ${selectedPath ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
          style={{ scrollMarginTop: '6rem' }}
        >
          {selectedPath && activePath && (
            <section className="mt-10">
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-7">
                  <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                    <span className="text-[10px] text-white/35 tracking-wider">Selected path:</span>
                    <span className={`text-[10px] font-semibold tracking-wider ${activePath.textColor}`}>{activePath.label}</span>
                  </div>
                  <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="relative rounded-2xl border border-white/[0.06] backdrop-blur-sm p-6 md:p-8 space-y-5"
                  style={{
                    background: 'rgba(255,255,255,0.018)',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.035)'
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-br ${activePath.accentColor} opacity-25`} />
                  </div>

                  <div className="relative">
                    <h2 className="text-lg font-bold text-white mb-0.5">
                      {selectedPath === 'protect' ? 'Artist OS Protect Inquiry'
                        : selectedPath === 'accounting' ? 'Artist OS Accounting Inquiry'
                        : selectedPath === 'banking' ? 'Artist OS Banking Inquiry'
                        : selectedPath === 'platform' ? 'Platform Access Request'
                        : 'Tell us about your goals'}
                    </h2>
                    <p className="text-xs text-white/35 font-light">Fill in the details below and we will be in touch.</p>
                  </div>

                  {selectedPath !== 'protect' && selectedPath !== 'accounting' && selectedPath !== 'banking' && selectedPath !== 'platform' && (
                  <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" required />
                    <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                    <InputField label="Company / Project Name" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Your company or project" />
                    <InputField label="Website or Social Link" name="website" value={formData.website} onChange={handleChange} placeholder="https://" />
                  </div>
                  )}

                  {selectedPath === 'artist' && (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Artist Name" name="artistName" value={formData.artistName} onChange={handleChange} placeholder="Stage name" />
                      <InputField label="Primary Genre" name="primaryGenre" value={formData.primaryGenre} onChange={handleChange} placeholder="e.g. R&B, Hip-Hop, Pop" />
                      <SelectField
                        label="Current Stage"
                        name="currentStage"
                        value={formData.currentStage}
                        onChange={handleChange}
                        options={[
                          { value: 'emerging', label: 'Emerging' },
                          { value: 'independent', label: 'Independent / Established' },
                          { value: 'signed', label: 'Signed' },
                          { value: 'legacy', label: 'Legacy / Catalog Artist' },
                        ]}
                      />
                      <InputField label="What support do you need most?" name="supportNeeded" value={formData.supportNeeded} onChange={handleChange} placeholder="e.g. Marketing, Distribution, A&R" />
                    </div>
                  )}

                  {selectedPath === 'label' && (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Label Name" name="labelName" value={formData.labelName} onChange={handleChange} placeholder="Your label name" />
                      <SelectField
                        label="Roster Size"
                        name="rosterSize"
                        value={formData.rosterSize}
                        onChange={handleChange}
                        options={[
                          { value: '1-5', label: '1–5 Artists' },
                          { value: '6-20', label: '6–20 Artists' },
                          { value: '21-50', label: '21–50 Artists' },
                          { value: '50+', label: '50+ Artists' },
                        ]}
                      />
                      <InputField label="Current Distribution / Infrastructure" name="distributionSetup" value={formData.distributionSetup} onChange={handleChange} placeholder="e.g. DistroKid, In-house" />
                      <InputField label="Biggest Growth Priorities" name="growthPriorities" value={formData.growthPriorities} onChange={handleChange} placeholder="e.g. Sync, Streaming, Brand deals" />
                    </div>
                  )}

                  {selectedPath === 'catalog' && (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Catalog Name" name="catalogName" value={formData.catalogName} onChange={handleChange} placeholder="Catalog or collection name" />
                      <SelectField
                        label="Approximate Catalog Size"
                        name="catalogSize"
                        value={formData.catalogSize}
                        onChange={handleChange}
                        options={[
                          { value: 'under-100', label: 'Under 100 tracks' },
                          { value: '100-500', label: '100–500 tracks' },
                          { value: '500-2000', label: '500–2,000 tracks' },
                          { value: '2000+', label: '2,000+ tracks' },
                        ]}
                      />
                      <InputField label="Rights Situation" name="rightsSituation" value={formData.rightsSituation} onChange={handleChange} placeholder="e.g. Fully owned, shared, legacy" />
                      <InputField label="What are you hoping to unlock?" name="unlockGoals" value={formData.unlockGoals} onChange={handleChange} placeholder="e.g. Sync revenue, streaming growth" />
                    </div>
                  )}

                  {selectedPath === 'brand' && (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Brand / Company" name="brandCompany" value={formData.brandCompany} onChange={handleChange} placeholder="Your brand or company name" />
                      <SelectField
                        label="Collaboration Type"
                        name="partnershipType"
                        value={formData.partnershipType}
                        onChange={handleChange}
                        options={[
                          { value: 'artist-collab', label: 'Artist Collaboration' },
                          { value: 'media', label: 'Media / Content' },
                          { value: 'sponsorship', label: 'Event / Tour Sponsorship' },
                          { value: 'licensing', label: 'Music Licensing' },
                          { value: 'other', label: 'Other' },
                        ]}
                      />
                      <InputField label="Campaign Timeline" name="campaignTimeline" value={formData.campaignTimeline} onChange={handleChange} placeholder="e.g. Q3 2025, ASAP" />
                      <SelectField
                        label="Budget Range"
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        options={[
                          { value: 'under-25k', label: 'Under $25K' },
                          { value: '25k-100k', label: '$25K–$100K' },
                          { value: '100k-500k', label: '$100K–$500K' },
                          { value: '500k+', label: '$500K+' },
                        ]}
                      />
                    </div>
                  )}

                  {selectedPath === 'scout' && (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Role" name="scoutRole" value={formData.scoutRole} onChange={handleChange} placeholder="e.g. A&R Scout, Manager, Consultant" />
                      <InputField label="Organization" name="scoutOrganization" value={formData.scoutOrganization} onChange={handleChange} placeholder="Company or independent" />
                      <InputField label="Area of Focus" name="areaOfFocus" value={formData.areaOfFocus} onChange={handleChange} placeholder="e.g. Emerging talent, Latin, Gospel" />
                      <InputField label="How do you want to work with GMG?" name="workInterest" value={formData.workInterest} onChange={handleChange} placeholder="e.g. Referrals, Co-signing" />
                    </div>
                  )}

                  {selectedPath === 'ai' && (
                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField label="Platform Name" name="platformName" value={formData.platformName} onChange={handleChange} placeholder="Your platform or product name" />
                      <SelectField
                        label="Product Category"
                        name="productCategory"
                        value={formData.productCategory}
                        onChange={handleChange}
                        options={[
                          { value: 'generation', label: 'AI Music Generation' },
                          { value: 'analytics', label: 'Analytics / Discovery' },
                          { value: 'sync', label: 'Sync / Licensing' },
                          { value: 'tools', label: 'Creator / Production Tools' },
                          { value: 'other', label: 'Other' },
                        ]}
                      />
                      <SelectField
                        label="Current User Base or Stage"
                        name="userBase"
                        value={formData.userBase}
                        onChange={handleChange}
                        options={[
                          { value: 'pre-launch', label: 'Pre-launch' },
                          { value: 'early', label: 'Early / Beta' },
                          { value: 'growth', label: 'Growth Stage' },
                          { value: 'scaled', label: 'Scaled' },
                        ]}
                      />
                      <InputField label="Partnership or Infrastructure Need" name="partnershipNeed" value={formData.partnershipNeed} onChange={handleChange} placeholder="e.g. Catalog access, Data licensing" />
                    </div>
                  )}

                  {selectedPath === 'protect' && (
                    <div className="relative space-y-4">
                      <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/[0.03] px-5 py-4 mb-2">
                        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-emerald-400/60 mb-1">Artist OS Protect</p>
                        <p className="text-xs text-white/40 font-light leading-relaxed">
                          Inquire for availability and pricing for entertainment-focused insurance pathways through Artist OS.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                          label="Package of Interest"
                          name="protectPackage"
                          value={formData.protectPackage}
                          onChange={handleChange}
                          required
                          options={[
                            { value: 'artist', label: 'Artist OS Protect: Artist' },
                            { value: 'company', label: 'Artist OS Protect: Company' },
                            { value: 'professional', label: 'Artist OS Protect: Professional' },
                          ]}
                        />
                        <SelectField
                          label="What best describes you?"
                          name="protectRole"
                          value={formData.protectRole}
                          onChange={handleChange}
                          options={roleOptions}
                        />
                        <InputField label="Full Name" name="protectFullName" value={formData.protectFullName} onChange={handleChange} placeholder="Your full name" required />
                        <InputField label="Company / Artist Name" name="protectCompany" value={formData.protectCompany} onChange={handleChange} placeholder="Company or artist name" />
                        <InputField label="Email" name="protectEmail" type="email" value={formData.protectEmail} onChange={handleChange} placeholder="you@example.com" required />
                        <InputField label="Phone" name="protectPhone" type="tel" value={formData.protectPhone} onChange={handleChange} placeholder="+1 (000) 000-0000" />
                        <InputField label="State / Primary Market" name="protectState" value={formData.protectState} onChange={handleChange} placeholder="e.g. California, New York" />
                        <SelectField
                          label="Current Insurance Status"
                          name="protectInsuranceStatus"
                          value={formData.protectInsuranceStatus}
                          onChange={handleChange}
                          options={[
                            { value: 'none', label: 'No current coverage' },
                            { value: 'partial', label: 'Partial coverage' },
                            { value: 'personal-only', label: 'Personal coverage only' },
                            { value: 'business-only', label: 'Business coverage only' },
                            { value: 'full', label: 'Full coverage — reviewing options' },
                          ]}
                        />
                        <SelectField
                          label="Revenue Range or Operating Scale"
                          name="protectRevenueRange"
                          value={formData.protectRevenueRange}
                          onChange={handleChange}
                          options={revenueRangeOptions}
                        />
                      </div>

                      <InputField label="Areas of Interest" name="protectAreasOfInterest" value={formData.protectAreasOfInterest} onChange={handleChange} placeholder="e.g. Touring, Cyber, Disability, Media Liability" />

                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">Activities / Operations</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {[
                            'Touring / live events',
                            'Digital / streaming',
                            'Staff / contractors',
                            'Live events / pop-ups',
                            'International travel',
                            'Recording / releases',
                            'Brand partnerships',
                            'Content creation',
                            'Multi-entity operations',
                          ].map(activity => {
                            const checked = formData.protectActivities.includes(activity);
                            return (
                              <label key={activity} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${checked ? 'border-emerald-500/30 bg-emerald-500/[0.06] text-white/70' : 'border-white/[0.06] bg-white/[0.015] text-white/35 hover:border-white/[0.1] hover:text-white/50'}`}>
                                <input
                                  type="checkbox"
                                  className="sr-only"
                                  checked={checked}
                                  onChange={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      protectActivities: checked
                                        ? prev.protectActivities.filter(a => a !== activity)
                                        : [...prev.protectActivities, activity],
                                    }));
                                  }}
                                />
                                <span className={`w-3.5 h-3.5 rounded flex-shrink-0 border flex items-center justify-center transition-all ${checked ? 'bg-emerald-500/30 border-emerald-500/50' : 'border-white/15'}`}>
                                  {checked && <span className="w-1.5 h-1.5 rounded-sm bg-emerald-400" />}
                                </span>
                                <span className="text-xs font-light leading-tight">{activity}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-white/40">Brief Description of Your Needs</label>
                        <textarea
                          name="protectDescription"
                          value={formData.protectDescription}
                          onChange={handleChange}
                          placeholder="Describe your situation, what you're looking to protect, and any specific concerns..."
                          rows={4}
                          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.07] rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-white/18 focus:bg-white/[0.05] transition-all duration-200 text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPath === 'accounting' && (
                    <div className="relative space-y-4">
                      <div className="rounded-xl border border-sky-500/15 bg-sky-500/[0.03] px-5 py-4 mb-2">
                        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-sky-400/60 mb-1">Artist OS Accounting</p>
                        <p className="text-xs text-white/40 font-light leading-relaxed">
                          Inquire for availability and pricing for structured financial operations through Artist OS institutional partners.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                          label="Package of Interest"
                          name="accountingPackage"
                          value={formData.accountingPackage}
                          onChange={handleChange}
                          required
                          options={[
                            { value: 'artist', label: 'Artist OS Accounting: Artist' },
                            { value: 'company', label: 'Artist OS Accounting: Company' },
                            { value: 'professional', label: 'Artist OS Accounting: Professional' },
                          ]}
                        />
                        <SelectField
                          label="What best describes you?"
                          name="accountingRole"
                          value={formData.accountingRole}
                          onChange={handleChange}
                          options={roleOptions}
                        />
                        <InputField label="Full Name" name="accountingFullName" value={formData.accountingFullName} onChange={handleChange} placeholder="Your full name" required />
                        <InputField label="Company / Artist Name" name="accountingCompany" value={formData.accountingCompany} onChange={handleChange} placeholder="Company or artist name" />
                        <InputField label="Email" name="accountingEmail" type="email" value={formData.accountingEmail} onChange={handleChange} placeholder="you@example.com" required />
                        <InputField label="Phone" name="accountingPhone" type="tel" value={formData.accountingPhone} onChange={handleChange} placeholder="+1 (000) 000-0000" />
                        <InputField label="State / Primary Market" name="accountingState" value={formData.accountingState} onChange={handleChange} placeholder="e.g. California, New York" />
                        <SelectField
                          label="Current Accounting Setup"
                          name="accountingCurrentSetup"
                          value={formData.accountingCurrentSetup}
                          onChange={handleChange}
                          options={[
                            { value: 'none', label: 'No current setup' },
                            { value: 'diy', label: 'Self-managed / DIY' },
                            { value: 'bookkeeper', label: 'Working with a bookkeeper' },
                            { value: 'accountant', label: 'Working with an accountant / CPA' },
                            { value: 'firm', label: 'Working with an accounting firm' },
                          ]}
                        />
                        <SelectField
                          label="Revenue Range or Operating Scale"
                          name="accountingRevenueRange"
                          value={formData.accountingRevenueRange}
                          onChange={handleChange}
                          options={revenueRangeOptions}
                        />
                        <SelectField
                          label="Number of Revenue Streams"
                          name="accountingRevenueStreams"
                          value={formData.accountingRevenueStreams}
                          onChange={handleChange}
                          options={[
                            { value: '1', label: '1 primary stream' },
                            { value: '2-3', label: '2–3 streams' },
                            { value: '4-6', label: '4–6 streams' },
                            { value: '7+', label: '7 or more streams' },
                          ]}
                        />
                        <SelectField
                          label="Need Tax Preparation Support?"
                          name="accountingNeedTaxPrep"
                          value={formData.accountingNeedTaxPrep}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                        <SelectField
                          label="Need Employment / Income Verification Support?"
                          name="accountingNeedIncomeVerification"
                          value={formData.accountingNeedIncomeVerification}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                      </div>

                      <TextAreaField
                        label="Brief Description of Your Needs"
                        name="accountingDescription"
                        value={formData.accountingDescription}
                        onChange={handleChange}
                        placeholder="Describe your current financial situation, what you need help with, and any specific priorities..."
                        rows={4}
                      />
                    </div>
                  )}

                  {selectedPath === 'banking' && (
                    <div className="relative space-y-4">
                      <div className="rounded-xl border border-blue-500/15 bg-blue-500/[0.03] px-5 py-4 mb-2">
                        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-blue-400/60 mb-1">Artist OS Banking</p>
                        <p className="text-xs text-white/40 font-light leading-relaxed">
                          Inquire for availability and pricing for institutional banking infrastructure, capital access, and credit pathways through Artist OS.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectField
                          label="Package of Interest"
                          name="bankingPackage"
                          value={formData.bankingPackage}
                          onChange={handleChange}
                          required
                          options={[
                            { value: 'artist', label: 'Artist OS Banking: Artist' },
                            { value: 'company', label: 'Artist OS Banking: Company' },
                            { value: 'professional', label: 'Artist OS Banking: Professional' },
                          ]}
                        />
                        <SelectField
                          label="What best describes you?"
                          name="bankingRole"
                          value={formData.bankingRole}
                          onChange={handleChange}
                          options={roleOptions}
                        />
                        <InputField label="Full Name" name="bankingFullName" value={formData.bankingFullName} onChange={handleChange} placeholder="Your full name" required />
                        <InputField label="Company / Artist Name" name="bankingCompany" value={formData.bankingCompany} onChange={handleChange} placeholder="Company or artist name" />
                        <InputField label="Email" name="bankingEmail" type="email" value={formData.bankingEmail} onChange={handleChange} placeholder="you@example.com" required />
                        <InputField label="Phone" name="bankingPhone" type="tel" value={formData.bankingPhone} onChange={handleChange} placeholder="+1 (000) 000-0000" />
                        <InputField label="State / Primary Market" name="bankingState" value={formData.bankingState} onChange={handleChange} placeholder="e.g. California, New York" />
                        <SelectField
                          label="Current Banking Setup"
                          name="bankingCurrentSetup"
                          value={formData.bankingCurrentSetup}
                          onChange={handleChange}
                          options={[
                            { value: 'personal-only', label: 'Personal accounts only' },
                            { value: 'basic-business', label: 'Basic business account' },
                            { value: 'established', label: 'Established banking relationship' },
                            { value: 'multi-entity', label: 'Multi-entity banking structure' },
                          ]}
                        />
                        <SelectField
                          label="Revenue Range or Operating Scale"
                          name="bankingRevenueRange"
                          value={formData.bankingRevenueRange}
                          onChange={handleChange}
                          options={revenueRangeOptions}
                        />
                        <SelectField
                          label="Monthly Cash Flow Range"
                          name="bankingMonthlyCashFlow"
                          value={formData.bankingMonthlyCashFlow}
                          onChange={handleChange}
                          options={[
                            { value: 'under-5k', label: 'Under $5K / month' },
                            { value: '5k-20k', label: '$5K–$20K / month' },
                            { value: '20k-100k', label: '$20K–$100K / month' },
                            { value: '100k-500k', label: '$100K–$500K / month' },
                            { value: '500k+', label: '$500K+ / month' },
                          ]}
                        />
                        <SelectField
                          label="Interested in Business Accounts?"
                          name="bankingInterestedAccounts"
                          value={formData.bankingInterestedAccounts}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                        <SelectField
                          label="Interested in Savings Structure?"
                          name="bankingInterestedSavings"
                          value={formData.bankingInterestedSavings}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                        <SelectField
                          label="Interested in GMG Corporate Card Access?"
                          name="bankingInterestedCorporateCard"
                          value={formData.bankingInterestedCorporateCard}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                        <SelectField
                          label="Interested in Royalty-Backed Credit Exploration?"
                          name="bankingInterestedRoyaltyCredit"
                          value={formData.bankingInterestedRoyaltyCredit}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                        <SelectField
                          label="Interested in Advance-Based Lending Pathways?"
                          name="bankingInterestedAdvanceLending"
                          value={formData.bankingInterestedAdvanceLending}
                          onChange={handleChange}
                          options={yesNoOptions}
                        />
                      </div>

                      <TextAreaField
                        label="Brief Description of Your Needs"
                        name="bankingDescription"
                        value={formData.bankingDescription}
                        onChange={handleChange}
                        placeholder="Describe your current banking situation, capital needs, and what you're looking to access or build..."
                        rows={4}
                      />
                    </div>
                  )}

                  {selectedPath === 'platform' && (
                    <div className="relative space-y-4">
                      <div className="rounded-xl border border-teal-500/15 bg-teal-500/[0.03] px-5 py-4 mb-2">
                        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-teal-400/60 mb-1">Platform Access</p>
                        <p className="text-xs text-white/40 font-light leading-relaxed">
                          Request access to the GMG platform for approved artists and collaborators.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField label="Full Name" name="platformFullName" value={formData.platformFullName} onChange={handleChange} placeholder="Your full name" required />
                        <InputField label="Artist / Company Name" name="platformPartnerName" value={formData.platformPartnerName} onChange={handleChange} placeholder="Your artist or company name" />
                        <InputField label="Email" name="platformEmail" type="email" value={formData.platformEmail} onChange={handleChange} placeholder="you@example.com" required />
                        <InputField label="Phone" name="platformPhone" type="tel" value={formData.platformPhone} onChange={handleChange} placeholder="+1 (000) 000-0000" />
                        <SelectField
                          label="What best describes you?"
                          name="platformRole"
                          value={formData.platformRole}
                          onChange={handleChange}
                          required
                          options={[
                            { value: 'artist', label: 'Artist' },
                            { value: 'manager', label: 'Manager' },
                            { value: 'label', label: 'Label' },
                            { value: 'catalog-owner', label: 'Catalog Owner' },
                            { value: 'brand', label: 'Brand' },
                            { value: 'partner', label: 'Collaborator' },
                            { value: 'other', label: 'Other' },
                          ]}
                        />
                        <InputField label="Website / Social / Company Link" name="platformWebsite" value={formData.platformWebsite} onChange={handleChange} placeholder="https://" />
                        <SelectField
                          label="Which platform area are you interested in?"
                          name="platformAreaOfInterest"
                          value={formData.platformAreaOfInterest}
                          onChange={handleChange}
                          options={[
                            { value: 'artist-os', label: 'Artist OS' },
                            { value: 'rocksteady', label: 'Rocksteady A&R Intelligence' },
                            { value: 'catalog', label: 'Catalog Growth Tools' },
                            { value: 'ai-reps', label: 'AI Artist Reps' },
                            { value: 'ai-scouts', label: 'AI Scouts' },
                            { value: 'full-platform', label: 'Full Platform Access' },
                            { value: 'unsure', label: 'Not sure yet' },
                          ]}
                        />
                      </div>

                      <TextAreaField
                        label="Why are you requesting access?"
                        name="platformWhyAccess"
                        value={formData.platformWhyAccess}
                        onChange={handleChange}
                        placeholder="Tell us about your situation and why you're seeking platform access..."
                        rows={3}
                        required
                      />

                      <TextAreaField
                        label="Additional Notes"
                        name="platformNotes"
                        value={formData.platformNotes}
                        onChange={handleChange}
                        placeholder="Anything else you'd like us to know..."
                        rows={2}
                      />
                    </div>
                  )}

                  {selectedPath !== 'protect' && selectedPath !== 'accounting' && selectedPath !== 'banking' && selectedPath !== 'platform' && (
                  <div className="relative space-y-4">
                    <InputField label="What are you looking for?" name="lookingFor" value={formData.lookingFor} onChange={handleChange} placeholder="Summarize your main goal in one line" />
                    <TextAreaField label="Message" name="message" value={formData.message} onChange={handleChange} placeholder="Anything else you want us to know" rows={3} />
                  </div>
                  )}

                  {error && (
                    <div className="relative px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/18 text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="relative pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        isSubmitting
                          ? 'bg-white/[0.03] border border-white/[0.05] text-white/30 cursor-not-allowed'
                          : `border ${activePath.borderColor} text-white hover:brightness-110`
                      }`}
                      style={!isSubmitting ? {
                        background: `linear-gradient(135deg, ${activePath.glowColor.replace('0.35', '0.07').replace('0.3', '0.05')}, rgba(255,255,255,0.01))`,
                        boxShadow: `0 8px 28px ${activePath.glowColor.replace('0.35', '0.1').replace('0.3', '0.08')}`
                      } : undefined}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        <>
                          {getButtonLabel(selectedPath)}
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[11px] text-white/22 mt-3 font-light">
                      We review all submissions and follow up directly.
                    </p>
                  </div>
                </form>
              </div>
            </section>
          )}
        </div>

      </div>
    </div>
  );
}
