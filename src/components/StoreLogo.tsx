import React from 'react';

export interface StoreLogoProps {
  logoUrl?: string | null;
  storeName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PRESET_LOGOS = [
  {
    id: 'preset-emerald',
    name: 'Hijau Berkah (Segar & Berkah)',
    color: 'from-emerald-500 to-teal-700',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'preset-amber',
    name: 'Kuning Rezeki (Hangat & Ramah)',
    color: 'from-amber-500 to-orange-600',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
        <path d="M2 7h20" />
        <circle cx="12" cy="11" r="1.5" />
      </svg>
    ),
  },
  {
    id: 'preset-indigo',
    name: 'Biru Modern (Profesional & Rapi)',
    color: 'from-blue-600 to-indigo-700',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    id: 'preset-rose',
    name: 'Merah Semarak (Pasar Aktif)',
    color: 'from-rose-500 to-red-700',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
  },
];

export const StoreLogo: React.FC<StoreLogoProps> = ({
  logoUrl,
  storeName = 'Berkah Mandiri',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }[size];

  // If a custom image URL or Base64 is stored
  if (logoUrl && !logoUrl.startsWith('preset:')) {
    return (
      <div className={`relative shrink-0 overflow-hidden rounded-lg bg-white border border-slate-200/90 shadow-2xs flex items-center justify-center p-0.5 ${sizeClasses} ${className}`}>
        <img
          src={logoUrl}
          alt={storeName}
          className="w-full h-full object-contain rounded-md"
          onError={(e) => {
            // Fallback to initial if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // If a preset was selected
  if (logoUrl && logoUrl.startsWith('preset:')) {
    const presetId = logoUrl.replace('preset:', '');
    const found = PRESET_LOGOS.find((p) => p.id === presetId) || PRESET_LOGOS[0];
    return (
      <div
        className={`relative shrink-0 rounded-lg bg-gradient-to-br ${found.color} shadow-2xs flex items-center justify-center p-1.5 text-white ${sizeClasses} ${className}`}
        title={storeName}
      >
        {found.icon}
      </div>
    );
  }

  // Default friendly modern logo for Toko Sembako:
  // Friendly shopping basket & fresh leaf emblem in emerald gradient
  return (
    <div
      className={`relative shrink-0 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 shadow-xs flex items-center justify-center p-2 text-white ring-1 ring-emerald-500/20 ${sizeClasses} ${className}`}
      title={storeName}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-full h-full text-white drop-shadow-xs"
      >
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    </div>
  );
};
