'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const defaultMsg = encodeURIComponent(
    'Hello The Classic Crush Bakery & Café! 👋 I would like to inquire about your menu and online ordering.'
  );
  const whatsappUrl = `https://wa.me/918090205081?text=${defaultMsg}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 md:bottom-6 right-5 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 group border-2 border-white"
    >
      <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out font-bold text-xs pl-0 group-hover:pl-2">
        Chat with us
      </span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white animate-ping"></span>
      <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white"></span>
    </a>
  );
}
