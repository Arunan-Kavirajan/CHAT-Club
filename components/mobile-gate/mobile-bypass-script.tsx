const BYPASS_SCRIPT = `
(function () {
  try {
    var bypassed = localStorage.getItem('chat-mobile-bypass') === '1';
    document.documentElement.setAttribute('data-mobile-bypass', bypassed ? '1' : '0');
  } catch (e) {
    document.documentElement.setAttribute('data-mobile-bypass', '0');
  }
})();
`;

export function MobileBypassScript() {
  return <script dangerouslySetInnerHTML={{ __html: BYPASS_SCRIPT }} />;
}