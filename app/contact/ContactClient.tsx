'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle2,
  Sparkles,
  Store,
} from 'lucide-react';

export default function ContactClient() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState('Campus Club Meeting / Event');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Classic Crush! I would like to inquire about bulk ordering or catering.`
    );
    window.open(`https://wa.me/918090205081?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] bg-[#FFF8E7] px-4 py-1.5 rounded-full border border-[#E7C86A]/40 inline-block">
            Get In Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-black text-[#23140C]">
            Visit Us & Bulk Orders
          </h1>
          <p className="text-sm text-stone-600">
            Have questions, feedback or planning a campus birthday or event? We'd love to cater fresh bakery treats for you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Outlet Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#23140C]">
                Outlet & Contact Details
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#23140C] block">
                      Campus Outlet Location
                    </span>
                    <p className="text-stone-600">
                      The Classic Crush Bakery & Café, School of Hotel Management, University Road
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#23140C] block">
                      Direct Hotline
                    </span>
                    <p className="text-stone-600">Santosh Singh Tomar: <strong>8090205081</strong></p>
                    <p className="text-stone-600">Sandeep Singh: <strong>8318008104</strong></p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#23140C] block">
                      Email Address
                    </span>
                    <p className="text-stone-600">theclassiccrush@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FFF8E7] text-[#8B5E34] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-[#23140C] block">
                      Kitchen Hours
                    </span>
                    <p className="text-stone-600">10:00 AM – 10:30 PM (Open 7 Days)</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Kitchen on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Orders / Catering Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EADDCF] shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#C89B2B] block">
                  Catering & Large Gatherings
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#23140C]">
                  Event & Bulk Bakery Request
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Customized snack boxes, dessert platters, burger boxes and cold brews for your events.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="font-serif text-lg font-bold">Enquiry Received!</h3>
                  <p className="text-xs text-emerald-800">
                    Thank you, {name}! Our outlet chef will call you shortly at {phone} with customized event pricing and tasting options.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Suvi Gupta"
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-stone-700 block mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 8090205081"
                        maxLength={10}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Event / Order Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-[#EADDCF] bg-white focus:outline-none focus:ring-2 focus:ring-[#8B5E34]"
                    >
                      <option value="Campus Club Meeting / Event">Campus Club Meeting / Event</option>
                      <option value="Birthday / Celebration Platter">Birthday / Celebration Platter</option>
                      <option value="Faculty / Dept Conference Refreshments">Faculty / Dept Conference Refreshments</option>
                      <option value="Custom Bakery Gift Hampers">Custom Bakery Gift Hampers</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      Order Details & Approximate Headcount
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="e.g. Need 40 snack boxes with Cheese Masala Patties, Chocolate Brownies & Cold Coffee on Friday 4 PM..."
                      className="w-full px-4 py-2.5 rounded-xl border border-[#EADDCF] text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#23140C] hover:bg-[#3B2416] text-[#FFFDF9] py-3.5 rounded-2xl font-bold text-xs sm:text-sm tracking-wide shadow-md flex items-center justify-center gap-2 transition-all active:scale-98"
                  >
                    <Send className="w-4 h-4 text-[#E7C86A]" />
                    <span>Submit Catering Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
