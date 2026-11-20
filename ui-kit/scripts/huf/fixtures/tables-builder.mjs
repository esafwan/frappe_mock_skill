// Orders schema with the full set of column types, for the table builder.
import { install as base } from './tables.mjs';
export const install = (page, ctx) => base(page, ctx, { builder: true });
