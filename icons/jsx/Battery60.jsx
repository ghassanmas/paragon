import * as React from "react";

function SvgBattery60(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path fillOpacity={0.3} d="M17 4h-3V2h-4v2H7v7h10V4z" />
      <path d="M7 11v11h10V11H7z" />
    </svg>
  );
}

export default SvgBattery60;
