// Same technique as ThemeScript — runs synchronously before paint, so
// returning visitors never see a flash of the loader (or the real site
// showing through before the loader appears) caused by React state only
// resolving after JS has already started running.
const BOOT_SCRIPT = `
(function () {
  try {
    var played = sessionStorage.getItem('chat-boot-played');
    document.documentElement.setAttribute('data-boot', played ? 'skip' : 'pending');
  } catch (e) {
    document.documentElement.setAttribute('data-boot', 'skip');
  }
})();
`;

export function BootScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />;
}