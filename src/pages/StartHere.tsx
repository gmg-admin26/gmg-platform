import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Music, Building2, Folder, Sparkles, Users, Network,
  ArrowRight, Brain, TrendingUp, Target, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

type PathType = 'artist' | 'label' | 'catalog' | 'brand' | 'ai-platform' | 'scout' | null;

interface EcosystemNode {
  id: string;
  label: string;
  x: number;
  y: number;
  color: string;
}

const ecosystemNodes: EcosystemNode[] = [
  { id: 'artists', label: 'Artists', x: 50, y: 20, color: '#8B5CF6' },
  { id: 'labels', label: 'Labels', x: 80, y: 35, color: '#06B6D4' },
  { id: 'producers', label: 'Producers', x: 85, y: 65, color: '#EC4899' },
  { id: 'songwriters', label: 'Songwriters', x: 65, y: 85, color: '#EAB308' },
  { id: 'ai-platforms', label: 'AI Music Platforms', x: 35, y: 85, color: '#10B981' },
  { id: 'brands', label: 'Brands', x: 15, y: 65, color: '#F59E0B' },
  { id: 'scouts', label: 'Scouts', x: 20, y: 35, color: '#8B5CF6' },
  { id: 'managers', label: 'Managers', x: 50, y: 15, color: '#06B6D4' }
];

const pathCards = [
  {
    id: 'artist',
    icon: Music,
    title: 'Artist',
    description: 'Independent artists looking for discovery tools, distribution infrastructure, and career development.',
    color: 'violet'
  },
  {
    id: 'label',
    icon: Building2,
    title: 'Label',
    description: 'Independent labels looking for discovery intelligence, catalog growth strategies, and operational support.',
    color: 'cyan'
  },
  {
    id: 'catalog',
    icon: Folder,
    title: 'Catalog Owner',
    description: 'Rights holders interested in maximizing the long term value of their music catalog.',
    color: 'magenta'
  },
  {
    id: 'brand',
    icon: Sparkles,
    title: 'Brand / Creative Collaborator',
    description: 'Brands, creative studios, media companies, and cultural organizations collaborating with GMG artists, catalogs, and platforms.',
    color: 'yellow'
  },
  {
    id: 'ai-platform',
    icon: Brain,
    title: 'AI Music Platform',
    description: 'AI music companies and creator platforms interested in discovery pipelines and signal intelligence.',
    color: 'violet'
  },
  {
    id: 'scout',
    icon: Users,
    title: 'Scout / Industry Operator',
    description: 'Music industry professionals, scouts, managers, and operators interested in participating in the discovery ecosystem.',
    color: 'cyan'
  }
];

const metrics = [
  { label: 'Signals analyzed daily', value: 12000000, suffix: '+', display: '12M+' },
  { label: 'Artists monitored', value: 1800000, suffix: '+', display: '1.8M+' },
  { label: 'Discovery signals detected monthly', value: 45000, suffix: '+', display: '45,000+' },
  { label: 'Launchpad operators trained', value: 8000, suffix: '+', display: '8,000+' },
  { label: 'Campus music programs connected', value: 0, suffix: '', display: 'Hundreds' }
];

const pipelineStages = [
  {
    icon: Target,
    title: 'Signal Detection',
    description: 'Rocksteady analyzes cultural signals across artists, producers, fan communities, and emerging scenes.',
    color: 'violet'
  },
  {
    icon: Brain,
    title: 'Discovery Intelligence',
    description: 'AI scouts and signal analysis systems identify emerging talent and cultural movements.',
    color: 'cyan'
  },
  {
    icon: Network,
    title: 'Opportunity Connection',
    description: 'Qualified artists and partners connect to distribution infrastructure, development programs, and collaborations.',
    color: 'magenta'
  },
  {
    icon: TrendingUp,
    title: 'Career Development',
    description: 'Artists and partners grow within the GMG ecosystem through catalog growth, marketing, and cultural media initiatives.',
    color: 'yellow'
  }
];

export default function StartHere() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<PathType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('leads').insert([
        {
          name: formData.name || formData.artistName || formData.labelName || formData.companyName || '',
          email: formData.email || '',
          role: selectedPath || 'other',
          company: formData.company || formData.labelName || formData.companyName || '',
          message: formData.message || formData.whatLookingFor || ''
        }
      ]);

      if (error) throw error;

      setSubmitSuccess(true);
      setTimeout(() => navigate('/thank-you'), 1500);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const renderFormFields = () => {
    switch (selectedPath) {
      case 'artist':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Artist Name</label>
              <input
                type="text"
                name="artistName"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Primary Genre</label>
              <input
                type="text"
                name="primaryGenre"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Monthly Listeners</label>
              <input
                type="text"
                name="monthlyListeners"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Link to Music</label>
              <input
                type="url"
                name="musicLink"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">What are you looking for?</label>
              <select
                name="whatLookingFor"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              >
                <option value="">Select an option</option>
                <option value="distribution">Distribution</option>
                <option value="discovery-tools">Discovery tools</option>
                <option value="artist-development">Artist development</option>
                <option value="launchpad-program">Launchpad program</option>
              </select>
            </div>
          </>
        );

      case 'label':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Label Name</label>
              <input
                type="text"
                name="labelName"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Catalog Size</label>
              <input
                type="text"
                name="catalogSize"
                onChange={handleInputChange}
                placeholder="Number of releases"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Primary Genres</label>
              <input
                type="text"
                name="primaryGenres"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gmg-gray mb-2">Distribution Needs</label>
              <textarea
                name="message"
                rows={4}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors resize-none"
              />
            </div>
          </>
        );

      case 'catalog':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Catalog Size</label>
              <input
                type="text"
                name="catalogSize"
                onChange={handleInputChange}
                placeholder="Number of tracks or albums"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Catalog Type</label>
              <input
                type="text"
                name="catalogType"
                onChange={handleInputChange}
                placeholder="e.g., Master recordings, Publishing, Both"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gmg-gray mb-2">What are you looking to achieve?</label>
              <textarea
                name="message"
                rows={4}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors resize-none"
              />
            </div>
          </>
        );

      case 'brand':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Partnership Interest</label>
              <select
                name="partnershipInterest"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              >
                <option value="">Select an option</option>
                <option value="artist-collaboration">Artist Collaboration</option>
                <option value="media-partnership">Media Partnership</option>
                <option value="brand-integration">Brand Integration</option>
                <option value="licensing">Licensing</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Industry</label>
              <input
                type="text"
                name="industry"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gmg-gray mb-2">Campaign Idea / Message</label>
              <textarea
                name="message"
                rows={4}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors resize-none"
              />
            </div>
          </>
        );

      case 'ai-platform':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Company Name</label>
              <input
                type="text"
                name="companyName"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Platform Type</label>
              <input
                type="text"
                name="platformType"
                onChange={handleInputChange}
                placeholder="e.g., AI music generation, Creator tools, Distribution"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">User Base Size</label>
              <input
                type="text"
                name="userBaseSize"
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gmg-gray mb-2">Partnership Interest / Message</label>
              <textarea
                name="message"
                rows={4}
                onChange={handleInputChange}
                placeholder="Tell us about your platform and what kind of partnership you're interested in"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors resize-none"
              />
            </div>
          </>
        );

      case 'scout':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Name</label>
              <input
                type="text"
                name="name"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Role</label>
              <input
                type="text"
                name="role"
                onChange={handleInputChange}
                placeholder="e.g., A&R, Manager, Scout, Producer"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gmg-gray mb-2">Industry Experience</label>
              <input
                type="text"
                name="experience"
                onChange={handleInputChange}
                placeholder="Years or brief description"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gmg-gray mb-2">Areas of Interest / Message</label>
              <textarea
                name="message"
                rows={4}
                onChange={handleInputChange}
                placeholder="Tell us about your experience and how you'd like to participate in the GMG ecosystem"
                className="w-full px-4 py-3 bg-gmg-graphite/30 border border-gmg-gray/30 rounded-xl text-white focus:outline-none focus:border-gmg-violet transition-colors resize-none"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gmg-charcoal text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-gmg-charcoal via-black to-gmg-charcoal">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.15),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        </div>

        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(139,92,246,0.3) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-white via-gmg-violet to-gmg-cyan bg-clip-text text-transparent">
              Get Started with GMG
            </span>
          </h1>

          <p className="text-2xl md:text-3xl font-bold mb-6 text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Connect with the infrastructure powering the modern music industry.
          </p>

          <p className="text-xl text-gmg-gray max-w-4xl mx-auto mb-16 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            GMG connects artists, labels, creators, AI music platforms, and cultural operators through a discovery driven ecosystem built for the modern era of music.
          </p>

          <p className="text-lg text-gmg-gray mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            Select the path that best describes you to begin.
          </p>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gmg-violet/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gmg-violet animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Ecosystem Visual */}
      <section className="py-32 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="relative w-full aspect-[16/9] max-w-4xl mx-auto">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <radialGradient id="centerGlow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                </radialGradient>
              </defs>

              {ecosystemNodes.map((node) => (
                <g key={node.id}>
                  <line
                    x1="50"
                    y1="50"
                    x2={node.x}
                    y2={node.y}
                    stroke={node.color}
                    strokeWidth="0.15"
                    opacity="0.4"
                    className="animate-pulse-slow"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="1.5"
                    fill={node.color}
                    className="animate-pulse-slow"
                  />
                </g>
              ))}

              <circle cx="50" cy="50" r="15" fill="url(#centerGlow)" />
              <circle cx="50" cy="50" r="4" fill="#8B5CF6" className="animate-pulse-slow" />

              {ecosystemNodes.map((node, index) => (
                <text
                  key={`text-${node.id}`}
                  x={node.x}
                  y={node.y + (node.y < 50 ? -3 : 5)}
                  textAnchor="middle"
                  fill="white"
                  fontSize="2.5"
                  fontWeight="600"
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {node.label}
                </text>
              ))}

              <text
                x="50"
                y="50"
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="3.5"
                fontWeight="900"
              >
                GMG Infrastructure
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Entry Path Cards */}
      <section className="py-32 px-6 bg-gradient-to-b from-black/50 to-gmg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {pathCards.map((card, index) => {
              const colorMap: Record<string, string> = {
                violet: 'border-gmg-violet/30 hover:border-gmg-violet hover:shadow-[0_0_30px_rgba(139,92,246,0.4)]',
                cyan: 'border-gmg-cyan/30 hover:border-gmg-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]',
                magenta: 'border-gmg-magenta/30 hover:border-gmg-magenta hover:shadow-[0_0_30px_rgba(236,72,153,0.4)]',
                yellow: 'border-gmg-yellow/30 hover:border-gmg-yellow hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]'
              };

              const iconColorMap: Record<string, string> = {
                violet: 'text-gmg-violet',
                cyan: 'text-gmg-cyan',
                magenta: 'text-gmg-magenta',
                yellow: 'text-gmg-yellow'
              };

              const bgColorMap: Record<string, string> = {
                violet: 'bg-gmg-violet/10',
                cyan: 'bg-gmg-cyan/10',
                magenta: 'bg-gmg-magenta/10',
                yellow: 'bg-gmg-yellow/10'
              };

              return (
                <button
                  key={card.id}
                  onClick={() => {
                    setSelectedPath(card.id as PathType);
                    setTimeout(() => {
                      document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className={`group p-8 rounded-2xl bg-gmg-graphite/30 border ${colorMap[card.color]} transition-all duration-300 text-left hover:scale-[1.02] animate-fade-in-up ${
                    selectedPath === card.id ? 'ring-2 ring-' + card.color : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-16 h-16 rounded-xl ${bgColorMap[card.color]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <card.icon className={`w-8 h-8 ${iconColorMap[card.color]}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="text-gmg-gray leading-relaxed mb-4">{card.description}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-gmg-violet group-hover:gap-3 transition-all">
                    Select <ArrowRight className="w-4 h-4" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Smart Inquiry Form */}
          {selectedPath && (
            <div id="inquiry-form" className="max-w-4xl mx-auto animate-fade-in-up">
              <div className="p-8 rounded-2xl bg-gmg-graphite/50 border border-gmg-violet/30 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                <h3 className="text-3xl font-bold mb-2">Tell Us About You</h3>
                <p className="text-gmg-gray mb-8">We'll get back to you within 48 hours.</p>

                {submitSuccess ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gmg-violet/20 flex items-center justify-center mx-auto mb-6">
                      <Zap className="w-10 h-10 text-gmg-violet" />
                    </div>
                    <h4 className="text-2xl font-bold mb-4">Inquiry Submitted!</h4>
                    <p className="text-gmg-gray">Redirecting you now...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
                    {renderFormFields()}

                    <div className="md:col-span-2 flex gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPath(null)}
                        className="px-6 py-3 rounded-xl border border-gmg-gray/30 text-white hover:border-gmg-violet hover:bg-gmg-violet/10 transition-all duration-300"
                      >
                        Change Path
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-8 py-3 bg-gradient-to-r from-gmg-violet to-gmg-cyan rounded-xl font-bold text-white hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? 'Submitting...' : 'Send Inquiry'}
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ecosystem Scale Section */}
      <section className="py-32 px-6 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Inside the GMG Ecosystem
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-gmg-graphite/30 border border-gmg-graphite hover:border-gmg-violet/50 transition-all duration-300 text-center group hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-gradient-to-r from-gmg-violet to-gmg-cyan bg-clip-text mb-4 group-hover:scale-110 transition-transform duration-300">
                  {metric.display}
                </div>
                <div className="text-sm text-gmg-gray leading-relaxed">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Pipeline Section */}
      <section className="py-32 px-6 bg-gradient-to-b from-black/50 to-gmg-charcoal">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              From Signal to Opportunity
            </h2>
            <p className="text-xl text-gmg-gray max-w-3xl mx-auto">
              How participants entering the ecosystem connect to discovery infrastructure.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gmg-violet via-gmg-cyan to-gmg-magenta hidden lg:block"></div>

            <div className="space-y-24">
              {pipelineStages.map((stage, index) => {
                const iconColorMap: Record<string, string> = {
                  violet: 'text-gmg-violet',
                  cyan: 'text-gmg-cyan',
                  magenta: 'text-gmg-magenta',
                  yellow: 'text-gmg-yellow'
                };

                const bgColorMap: Record<string, string> = {
                  violet: 'bg-gmg-violet/10',
                  cyan: 'bg-gmg-cyan/10',
                  magenta: 'bg-gmg-magenta/10',
                  yellow: 'bg-gmg-yellow/10'
                };

                const isEven = index % 2 === 0;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-8 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex-col animate-fade-in-up`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex-1"></div>
                    <div className={`relative w-20 h-20 rounded-2xl ${bgColorMap[stage.color]} border border-${stage.color}/30 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] z-10`}>
                      <stage.icon className={`w-10 h-10 ${iconColorMap[stage.color]}`} />
                    </div>
                    <div className="flex-1">
                      <div className={`p-8 rounded-2xl bg-gmg-graphite/30 border border-gmg-graphite hover:border-${stage.color}/50 transition-all duration-300`}>
                        <h3 className="text-2xl font-bold mb-4">{stage.title}</h3>
                        <p className="text-gmg-gray leading-relaxed">{stage.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6 bg-black/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
            The future of the music industry is built on discovery intelligence, cultural insight, and connected infrastructure.
          </h2>

          <p className="text-2xl text-gmg-gray mb-12">
            Connect to the infrastructure shaping the future of music.
          </p>

          <button
            onClick={() => {
              if (!selectedPath) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 px-12 py-5 bg-gradient-to-r from-gmg-violet to-gmg-cyan rounded-full font-bold text-xl text-white hover:shadow-[0_0_40px_rgba(139,92,246,0.6)] transition-all duration-300"
          >
            {selectedPath ? 'Complete Your Inquiry' : 'Get Started'}
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>
    </div>
  );
}
