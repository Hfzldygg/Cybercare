import React from "react";

interface LogoProps {
  className?: string; // Sizing and spacing classes
}

export default function Logo({ className = "w-10 h-10" }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Pink Person Silhouette (forms Right Heart side & Head) */}
      <circle cx="72" cy="15" r="10" fill="#ec1c6d" />
      <path 
        d="M27 22C34 22 45 28 51 39C58 34 68 22 80 22C99 22 101 43 88 62C78 76 67 85 59 92C64 88 82 72 88 57C95 39 86 30 77 30C67 30 58 41 51 51L27 22Z" 
        fill="#ec1c6d" 
      />
      {/* Blue Supportive Hand (forms Left Heart side / fingers) */}
      <path 
        d="M14 27C14 27 13 31 15 37C17 41 22 48 22 48C22 48 20 41 19 38C18 34 18 30 20 30C22 30 22 33 22 36C22 40 22 45 23 48C23 48 23 43 23 41C24 40 23 35 25 35C27 35 25 41 26 46C27 52 35 61 45 67C55 74 58 85 52 96C52 96 59 87 53 77C47 66 38 58 34 51C34 51 37 47 37 45C38 43 38 45 37 49C37 53 40 58 40 58C40 58 33 51 30 46C27 41 23 35 17 29C15 28 14 27 14 27Z" 
        fill="#00aded" 
      />
    </svg>
  );
}
