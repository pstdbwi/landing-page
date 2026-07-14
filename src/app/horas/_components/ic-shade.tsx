import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export const ICShadeBrown = ({ size = 959, ...props }: IconProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 959 1080" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g filter="url(#filter0_f_2211_943)">
        <circle
          cx="917.394"
          cy="232.286"
          r="517.337"
          transform="rotate(-7.32931 917.394 232.286)"
          fill="url(#paint0_linear_2211_943)"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_2211_943"
          x="0"
          y="-685.109"
          width="1834.79"
          height="1834.79"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur_2211_943" />
        </filter>
        <linearGradient
          id="paint0_linear_2211_943"
          x1="724.75"
          y1="126.531"
          x2="1271.24"
          y2="612.429"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C7B08F" />
          <stop offset="1" stopColor="#879A8F" />
        </linearGradient>
      </defs>
    </svg>
  );
};
