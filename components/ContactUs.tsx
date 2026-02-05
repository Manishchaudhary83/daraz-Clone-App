
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Language } from '../translations';

interface ContactUsProps {
  language: Language;
  t: any;
  onNavigateHome: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ language, t, onNavigateHome }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    botcheck: ''
  });
  const [loading, setLoading] = useState(false);

  /**
   * ARCHITECT NOTE: 
   * Hardcoding the provided Web3Forms key to resolve configuration errors.
   * Ensure Domain Whitelisting is enabled in your Web3Forms dashboard for security.
   */
  const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_KEY || "1a71b1ec-b87b-41d3-8299-d5ef870fe108"; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!WEB3FORMS_ACCESS_KEY) {
      console.error("CRITICAL: WEB3FORMS_KEY is missing.");
      toast.error(language === 'en' ? 'System Configuration Error: Key Missing' : 'प्रणाली कन्फिगरेसन त्रुटि');
      return;
    }

    if (formData.phone.length < 10) {
      toast.warn(language === 'en' ? 'Please enter a valid phone number' : 'कृपया मान्य फोन नम्बर प्रविष्ट गर्नुहोस्');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          botcheck: formData.botcheck,
          subject: `New Inquiry from DarazClone: ${formData.name}`,
          from_name: "Daraz Clone Support"
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(t.contactSuccess, {
          position: "top-center",
          autoClose: 5000,
        });
        
        setFormData({ name: '', email: '', phone: '', message: '', botcheck: '' });
        setTimeout(onNavigateHome, 2500);
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (error: any) {
      toast.error(`${t.contactError}: ${error.message}`, {
        position: "top-center",
        autoClose: 7000
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl animate-fadeIn">
      <div className="bg-white p-8 md:p-12 rounded-sm shadow-2xl border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F85606]"></div>
        <div className="absolute top-1.5 left-0 w-1.5 h-1.5 bg-orange-600"></div>

        <div className="text-center mb-10">
          <div className="inline-block bg-orange-50 p-3 rounded-full mb-4">
             <svg className="w-8 h-8 text-[#F85606]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
             </svg>
          </div>
          <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tight mb-2">
            {t.contactUs}
          </h1>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">
            {language === 'en' ? 'Verified Support Portal' : 'प्रमाणित समर्थन पोर्टल'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            type="checkbox" 
            name="botcheck" 
            className="hidden" 
            style={{ display: 'none' }}
            checked={formData.botcheck !== ''}
            onChange={(e) => setFormData({...formData, botcheck: e.target.checked ? 'true' : ''})}
          />

          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
              {t.contactName}
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Manish Jaiswal"
              className="w-full border-2 border-gray-100 p-4 rounded-sm focus:border-orange-500 focus:bg-orange-50/5 outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                {t.contactEmail}
              </label>
              <input
                type="email"
                required
                placeholder="manish@example.com"
                className="w-full border-2 border-gray-100 p-4 rounded-sm focus:border-orange-500 focus:bg-orange-50/5 outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
                {t.contactPhone}
              </label>
              <input
                type="tel"
                required
                placeholder="98XXXXXXXX"
                className="w-full border-2 border-gray-100 p-4 rounded-sm focus:border-orange-500 focus:bg-orange-50/5 outline-none font-bold text-gray-900 transition-all placeholder:text-gray-300"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/[^0-9]/g, '') })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">
              {t.contactMessage}
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us how we can assist you..."
              className="w-full border-2 border-gray-100 p-4 rounded-sm focus:border-orange-500 focus:bg-orange-50/5 outline-none font-bold text-gray-900 transition-all resize-none placeholder:text-gray-300"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F85606] text-white py-5 rounded-sm font-black shadow-xl hover:bg-orange-700 active:scale-[0.98] transition-all uppercase tracking-[0.3em] text-xs disabled:opacity-70 flex justify-center items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{language === 'en' ? 'SUBMITTING...' : 'पठाउँदै...'}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
                {t.contactSubmit}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactUs;
