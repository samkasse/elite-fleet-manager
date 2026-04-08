import React from 'react';

interface CraneLogoProps extends React.ComponentProps<'svg'> {
  crownColor?: string;
  wattleColor?: string;
  className?: string;
}

export function CraneLogo({ crownColor = '#FCDC04', wattleColor = '#D90000', className = '', ...props }: CraneLogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Crown */}
      <path
        d="M50 15 L45 5 L50 10 L55 5 Z"
        fill={crownColor}
      />
      <path
        d="M45 15 L35 8 L45 12 Z"
        fill={crownColor}
      />
      <path
        d="M55 15 L65 8 L55 12 Z"
        fill={crownColor}
      />
      
      {/* Head & Neck */}
      <path
        d="M40 25 C40 15, 60 15, 60 25 C60 35, 55 45, 55 60 C55 80, 45 80, 45 60 C45 45, 40 35, 40 25 Z"
        fill="currentColor"
      />
      
      {/* Beak */}
      <path
        d="M60 22 L80 25 L60 28 Z"
        fill="currentColor"
      />
      
      {/* Eye */}
      <circle cx="52" cy="22" r="2" fill={wattleColor} />
      
      {/* Wattle */}
      <path
        d="M45 30 C40 35, 40 40, 45 40 C50 40, 50 35, 45 30 Z"
        fill={wattleColor}
      />
    </svg>
  );
}
