export default function SparkAsterisk({ className = "w-6 h-6", fill = "#0F172A" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(50,50)">
        <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill={fill} />
        <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill={fill} transform="rotate(60)" />
        <rect x="-6" y="-45" width="12" height="90" rx="6" ry="6" fill={fill} transform="rotate(120)" />
      </g>
    </svg>
  );
}
