/**
 * Create custom Matomo event.
 *
 * All DoNotTrack, etc rules are applied elsewhere and are in effect
 *
 * @see https://github.com/samajammin/gatsby-plugin-matomo/blob/event-tracking/src/index.js
 * @see https://matomo.org/docs/event-tracking/
 */
export default function trackCustomEvent(
  eventCategory,
  eventAction,
  eventName,
  eventValue
) {
  if (process.env.NODE_ENV === `production` || window.dev === true) {
    if (!window._paq) return

    const { _paq, dev } = window

    _paq.push([`trackEvent`, eventCategory, eventAction, eventName, eventValue])

    if (dev) {
      console.debug(
        `[Matomo] event tracked, category: ${eventCategory}, action: ${eventAction}, name: ${eventName}, value: ${eventValue}`
      )
    }
  }
}
