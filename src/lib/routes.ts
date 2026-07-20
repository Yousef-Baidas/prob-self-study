// The one place that reads the site's base path at runtime. Every internal
// link/asset should go through route() instead, so the base path stays a
// single seam instead of a fact every component has to know.
import { joinBase } from './withBase';

export function route(path = ''): string {
  return joinBase(import.meta.env.BASE_URL, path);
}
