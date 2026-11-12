import { createAuditHandler } from '../server/audit-handler.mjs';

export default { fetch: createAuditHandler() };
