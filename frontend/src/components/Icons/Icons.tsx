import { memo } from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const IconProfile = memo(({ size = 18, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5"/>
    <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));

export const IconTariff = memo(({ size = 18, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke={color} strokeWidth="1.5"/>
    <path d="M8 12h8M8 8h5M8 16h6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));

export const IconPayments = memo(({ size = 18, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="1.5"/>
    <path d="M2 10h20" stroke={color} strokeWidth="1.5"/>
    <circle cx="7" cy="15" r="1.5" fill={color}/>
  </svg>
));

export const IconLogout = memo(({ size = 18, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 17l5-5-5-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12H3" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
));

export const IconChevron = memo(({ size = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18l6-6-6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

export const IconCollapse = memo(({ size = 16, color = 'currentColor', className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}
    xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18l-6-6 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
));

