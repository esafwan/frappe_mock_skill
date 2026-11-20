// Empty Tables list (no tables yet).
import { install as base } from './tables.mjs';
export const install = (page, ctx) => base(page, ctx, { empty: true });
