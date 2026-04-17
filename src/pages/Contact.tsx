import { useState } from 'react';
import { Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    role: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Form submitted:', formData);
    setSubmitStatus('success');
    setIsSubmitting(false);

    setFormData({
      name: '',
      company: '',
      email: '',
      role: '',
      message: '',
    });

    setTimeout(() => setSubmitStatus('idle'), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-7xl font-bold mb-8">Let's Build Together</h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Ready to grow your music? Get in touch and let's explore how GMG can help.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-900 rounded-2xl border border-gray-800 p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Your company (optional)"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">Select your role</option>
                  <option value="artist">Artist</option>
                  <option value="manager">Manager</option>
                  <option value="label">Label</option>
                  <option value="catalog-owner">Catalog Owner</option>
                  <option value="brand">Brand</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  placeholder="Tell us about your project or inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 btn-glass-primary disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Inquiry
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <div className="p-4 bg-green-900/30 border border-green-500 rounded-lg text-center">
                  <p className="text-green-400 font-medium">Message sent successfully!</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-900/30 border border-red-500 rounded-lg text-center">
                  <p className="text-red-400 font-medium">Something went wrong. Please try again.</p>
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
