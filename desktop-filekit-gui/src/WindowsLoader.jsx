import "./WindowsLoader.css";

export default function WindowsLoader({
  text = "Loading...",
  size = 48,
  fullscreen = false,
}) {
  return (
    <div
      className={`windows-loader-wrapper ${fullscreen ? "windows-loader-fullscreen" : ""
        }`}
    >
      <div
        className="windows-loader"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
        role="status"
        aria-label={text}
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <span
            key={index}
            className="windows-loader-dot"
            style={{
              "--index": index,
              "--loader-size": `${size}px`,
            }}
          />
        ))}
      </div>

      {text && <p className="windows-loader-text">{text}</p>}
    </div>
  );
}