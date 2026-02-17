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
import { RegulationResult, RouterResult } from './types';
export declare function route(reg: RegulationResult): RouterResult;
