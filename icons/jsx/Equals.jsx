import * as React from "react";

function SvgEquals(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M19 9.998H5v-2h14zm0 6H5v-2h14z" />
    </svg>
  );
}

export default SvgEquals;
