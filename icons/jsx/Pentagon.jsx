import * as React from "react";

function SvgPentagon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M2 9l4 12h12l4-12-10-7z" />
    </svg>
  );
}

export default SvgPentagon;
