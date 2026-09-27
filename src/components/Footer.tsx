import { useIsMac } from "../hooks/useIsMac";

interface Props {
  onOpenPalette: () => void;
}

export default function Footer({ onOpenPalette }: Props) {
  const isMac = useIsMac();
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>
          © {__BUILD_DATE__.slice(0, 4)} Soumya Ranjan Tripathy · build <b>{__BUILD_SHA__}</b> · {__BUILD_DATE__}
        </p>
        <button onClick={onOpenPalette}>
          <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd>K</kbd> to navigate
        </button>
      </div>
    </footer>
  );
}
