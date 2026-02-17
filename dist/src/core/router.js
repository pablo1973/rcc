"use strict";
/**
 * RCC Router
 * HARDENED v1.0.0-DAY6
 *
 * INVARIANTES:
 * - Ruteo basado SOLO en estado y acción
 * - Sin contexto oculto
 * - Default obligatorio: TEXT
 * - Determinístico
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = route;
// ─────────────────────────────────────────────────────────────
// RUTEO PRINCIPAL
// ─────────────────────────────────────────────────────────────
function route(reg) {
    return { channel: reg.action === 'PAUSE' ? 'COOLDOWN' : 'TEXT' };
}
