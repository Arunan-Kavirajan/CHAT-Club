// This runs synchronously in <head>, before React hydrates and before
// the browser paints. Without it, the page would briefly flash the
// default theme before localStorage is read on the client.
const THEME_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('chat-theme');
    var theme = stored === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
