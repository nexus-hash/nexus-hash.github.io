import { useIsMac } from "../hooks/useIsMac";

interface Props {
  onOpenPalette: () => void;
}

export default function Footer({ onOpenPalette }: Props) {
  const isMac = useIsMac();
  return (
    <footer className="footer">
      <p>
        soumya-portfolio · build <span className="footer-sha">{__BUILD_SHA__}</span> · {__BUILD_DATE__}
      </p>
      <p className="footer-hint">
        <button className="footer-kbd-btn" onClick={onOpenPalette}>
          press <kbd>{isMac ? "⌘" : "Ctrl"}</kbd>
          <kbd>K</kbd> to navigate
        </button>
      </p>
    </footer>
  );
}
