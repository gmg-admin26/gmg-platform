import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Music, Users, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const roleConfig = {
  artist: {
    title: 'Artist Access',
    icon: Music,
    color: 'violet',
    description: 'Tell us about your music and what you are looking to achieve with GMG.',
  },
  label: {
    title: 'Label Solutions',
    icon: Users,
    color: 'cyan',
    description: 'Share details about your label and how GMG can support your growth.',
  },
  catalog: {
    title: 'Catalog Partnerships',
    icon: TrendingUp,
    color: 'magenta',
    description: 'Tell us about your catalog and your growth objectives.',
  },
  partner: {
    title: 'Partnership Opportunities',
    icon: Package,
    color: 'gold',
    description: 'Share information about your organization and partnership interests.',
  },
};

export default function IntakeForm() {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.artist;
  const Icon = config.icon;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    roleType: role || 'artist',
    streamingLink: '',
    catalogDescription: '',
    projectInterest: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: insertError } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            company: formData.company,
            role_type: formData.roleType,
            streaming_link: formData.streamingLink || null,
            catalog_description: formData.catalogDescription || null,
            project_interest: formData.projectInterest || null,
          },
        ]);

      if (insertError) throw insertError;

      navigate('/thank-you');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was an error submitting your inquiry. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { border: string; bg: string; text: string; button: string }> = {
      violet: {
        border: 'border-gmg-violet/30',
        bg: 'bg-gmg-violet/20',
        text: 'text-gmg-violet',
        button: 'btn-glass-primary',
      },
      cyan: {
        border: 'border-gmg-cyan/30',
        bg: 'bg-gmg-cyan/20',
        text: 'text-gmg-cyan',
        button: 'btn-glass-primary',
      },
      magenta: {
        border: 'border-gmg-magenta/30',
        bg: 'bg-gmg-magenta/20',
        text: 'text-gmg-magenta',
        button: 'btn-glass-primary',
      },
      gold: {
        border: 'border-gmg-gold/30',
        bg: 'bg-gmg-gold/20',
        text: 'text-gmg-gold',
        button: 'btn-glass-primary',
      },
    };
    return colorMap[color] || colorMap.violet;
  };

  const colors = getColorClasses(config.color);

  return (
    <div className="min-h-screen bg-gmg-charcoal text-gmg-white pt-24">
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className={`w-20 h-20 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
              <Icon className={`w-10 h-10 ${colors.text}`} />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {config.title}
            </h1>
            <p className="text-lg text-gmg-gray max-w-2xl mx-auto leading-relaxed">
              {config.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className={`bg-gmg-graphite/40 backdrop-blur-sm border ${colors.border} rounded-3xl p-8 md:p-12 space-y-6`}>
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gmg-white">
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gmg-white">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-semibold mb-2 text-gmg-white">
                {role === 'artist' ? 'Artist Name' : 'Company / Artist Name'} *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                required
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors"
                placeholder={role === 'artist' ? 'Your artist name' : 'Organization name'}
              />
            </div>

            <div>
              <label htmlFor="roleType" className="block text-sm font-semibold mb-2 text-gmg-white">
                Role *
              </label>
              <select
                id="roleType"
                name="roleType"
                required
                value={formData.roleType}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white focus:outline-none focus:border-gmg-violet transition-colors"
              >
                <option value="artist">Artist</option>
                <option value="manager">Manager</option>
                <option value="label">Label</option>
                <option value="catalog_owner">Catalog Owner</option>
                <option value="brand">Brand</option>
                <option value="partner">Partner</option>
              </select>
            </div>

            <div>
              <label htmlFor="streamingLink" className="block text-sm font-semibold mb-2 text-gmg-white">
                Spotify / Streaming Link
              </label>
              <input
                type="url"
                id="streamingLink"
                name="streamingLink"
                value={formData.streamingLink}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors"
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>

            {(role === 'catalog' || role === 'label') && (
              <div>
                <label htmlFor="catalogDescription" className="block text-sm font-semibold mb-2 text-gmg-white">
                  Catalog Description
                </label>
                <textarea
                  id="catalogDescription"
                  name="catalogDescription"
                  rows={3}
                  value={formData.catalogDescription}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors resize-none"
                  placeholder="Brief description of your catalog or roster"
                />
              </div>
            )}

            <div>
              <label htmlFor="projectInterest" className="block text-sm font-semibold mb-2 text-gmg-white">
                Project Interest
              </label>
              <textarea
                id="projectInterest"
                name="projectInterest"
                rows={4}
                value={formData.projectInterest}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gmg-charcoal/60 border border-gmg-violet/20 rounded-xl text-gmg-white placeholder-gmg-gray focus:outline-none focus:border-gmg-violet transition-colors resize-none"
                placeholder="Tell us what you are looking to achieve with GMG"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`group w-full px-8 py-4 ${colors.button} text-white rounded-xl font-semibold text-lg transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2`}
            >
              {isSubmitting ? 'Submitting...' : 'Connect with GMG'}
              {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
