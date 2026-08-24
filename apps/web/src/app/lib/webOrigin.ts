/**
 * Absolute origin of this web app.
 *
 * Auth redirects are performed by the API, which runs on its own origin. Better
 * Auth stores the callbackURL verbatim and redirects to it from the callback
 * route, so a relative value like "/" resolves against the API host and lands
 * on its 404 rather than the app. Every callbackURL must be absolute.
 *
 * The browser knows its own origin, so prefer that over configuration it could
 * disagree with; NEXT_PUBLIC_WEB_ORIGIN only covers server-side rendering.
 */
const webOrigin = (): string => {
  if (typeof window !== "undefined") return window.location.origin;
  return process.env.NEXT_PUBLIC_WEB_ORIGIN ?? "http://localhost:3000";
};

/** Absolute URL for a path within this web app, e.g. redirect targets. */
export const webUrl = (path: string = "/"): string =>
  new URL(path, webOrigin()).toString();
