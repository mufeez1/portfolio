/**
 * Runs before first paint to set the theme class, eliminating the flash of
 * wrong theme. Inlined deliberately: an external file would be a render-blocking
 * round trip for ~200 bytes.
 */
const script = `(function(){try{var s=localStorage.getItem("theme");var d=s?s==="dark":matchMedia("(prefers-color-scheme: dark)").matches;var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
