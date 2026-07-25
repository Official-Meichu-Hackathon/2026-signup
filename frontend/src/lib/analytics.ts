declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initAnalytics(): void {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID
  if (!id) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  // gtag.js requires an Arguments object, not an array
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('config', id)
}

export function trackSignUp(): void {
  if (!window.gtag) return
  window.gtag('event', 'sign_up', { method: 'registration_form' })
}
