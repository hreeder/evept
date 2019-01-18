// Credit to https://github.com/mbasso/react-https-redirect
// Commit: 5e679bd, File: src/index.js
export function httpsRedirect() {
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.protocol === 'http:' &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    window.location.href = window.location.href.replace(
      /^http(?!s)/,
      'https'
    )
  }
}