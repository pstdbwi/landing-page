import React from "react";

type IcClockProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

export const IcClock: React.FC<IcClockProps> = ({ size = 48, ...props }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M30.406 27.578L28.072 24.56C27.372 23.654 26.946 22.566 26.842 21.426L26 12C26 10.896 25.104 10 24 10C22.896 10 22 10.896 22 12L21.238 21.77C21.088 23.69 21.87 25.566 23.34 26.812L27.578 30.406C28.36 31.188 29.626 31.188 30.406 30.406C31.188 29.626 31.188 28.358 30.406 27.578Z"
        fill="#053738"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="4" y1="24" x2="44" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFE7A1" />
          <stop offset="0.19472" stopColor="#DAB95A" />
          <stop offset="0.389439" stopColor="#F0D398" />
          <stop offset="0.59" stopColor="#DAB95A" />
          <stop offset="0.79" stopColor="#FFE7A1" />
          <stop offset="1" stopColor="#DAB95A" stopOpacity="0.854902" />
        </linearGradient>
      </defs>
    </svg>
  );
};
