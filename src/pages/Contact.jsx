import React from 'react';
import Layout from '../components/Layout';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { FaInstagram as Instagram, FaFacebook as Facebook, FaYoutube as Youtube } from 'react-icons/fa';
import { TOURNAMENT } from '../utils/constants';

export default function Contact() {
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gradient-to-br from-dark via-[#1a1200] to-dark py-16 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-heading font-black mb-2">
            Contact <span className="text-primary-500">Us</span>
          </h1>
          <p className="text-gray-300">Get in touch with the Husler Cup organizing team</p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-dark mb-4">Reach Out</h2>
                <p className="text-gray-500 leading-relaxed">
                  For any questions about registration, team rules, or the tournament schedule, feel free to contact us through any of the channels below.
                </p>
              </div>

              <div className="space-y-4">
                <div className="card p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Email</p>
                    <a href={`mailto:${TOURNAMENT.contact}`} className="text-primary-500 hover:underline text-sm break-all">
                      {TOURNAMENT.contact}
                    </a>
                  </div>
                </div>

                <div className="card p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">Venue</p>
                    <p className="text-gray-600 text-sm">{TOURNAMENT.venue}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Chitwan, Nepal</p>
                  </div>
                </div>

                <div className="card p-4 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <Phone className="text-primary-500" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">WhatsApp / Phone</p>
                    <p className="text-gray-600 text-sm">Contact via email for phone number</p>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="card p-4">
                <p className="font-semibold text-dark text-sm mb-3">Follow Us</p>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, label: 'Facebook', href: '#' },
                    { icon: Instagram, label: 'Instagram', href: '#' },
                    { icon: Youtube, label: 'YouTube', href: '#' },
                  ].map(({ icon: Icon, label, href }) => (
                    <a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-primary-500 text-gray-600 hover:text-white rounded-xl transition-all text-sm font-medium"
                    >
                      <Icon size={16} /> {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-dark flex items-center gap-2">
                  <MapPin className="text-primary-500" size={18} /> Tournament Venue
                </h3>
                <p className="text-gray-500 text-sm">{TOURNAMENT.venue}, Chitwan, Nepal</p>
              </div>
              <iframe
                title="Glorious Academy Chitwan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d113900.2363726527!2d84.30919!3d27.68966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3994fb4d2e5d6c95%3A0x98b7f13b12d9f0d3!2sChitwan%2C%20Nepal!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
