# RCC → RCC-ORG: Roadmap de Extensión

## Estado Actual (DAY10)
```
Mensaje → Analyzer → State → Regulator → Router
```
- Análisis de mensaje individual
- Detección de intensidad/tensión
- 628 tests, pipeline determinístico
- **NO tiene:** contexto grupal, historial, usuarios, tiempos

---

## Objetivo Final
```
"Analizo cómo se comunica tu equipo y te digo qué necesita 
cada persona de bajo rendimiento para mejorar, sin echar a nadie."
```

---

## FASE 1: Data Layer (5-7 días)

### 1.1 Modelo de Datos
```typescript
interface Organization {
  id: string;
  name: string;
  channels: Channel[];
}

interface Channel {
  id: string;
  type: 'whatsapp' | 'slack' | 'email' | 'teams';
  members: Member[];
}

interface Member {
  id: string;
  name: string;
  role?: string;
}

interface Message {
  id: string;
  channelId: string;
  authorId: string;
  text: string;
  timestamp: number;
  replyToId?: string;  // Para hilos
}
```

### 1.2 Importadores
- WhatsApp export (.txt)
- Slack export (JSON)
- CSV genérico

### 1.3 Storage
- SQLite para persistencia local
- Queries por usuario, canal, rango de fechas

**Entregable:** `rcc-org` puede ingerir un export de WhatsApp y almacenarlo.

---

## FASE 2: Métricas por Usuario (5-7 días)

### 2.1 Métricas de Actividad
```typescript
interface UserMetrics {
  userId: string;
  period: { from: number; to: number };
  
  // Volumen
  messageCount: number;
  wordCount: number;
  avgMessageLength: number;
  
  // Timing
  avgResponseTime: number;      // ms promedio en responder
  silencePeriods: number;       // cantidad de silencios >24h
  peakHours: number[];          // horas de mayor actividad
  
  // Comportamiento
  initiatesConversations: number;  // cuántas veces arranca tema
  onlyResponds: number;            // cuántas veces solo responde
  ignoredMessages: number;         // mensajes que no tuvieron respuesta
  
  // Tensión (del core actual)
  avgIntensity: number;
  tenseMessageCount: number;
  tenseTriggers: string[];      // palabras/patrones que disparan tensión
}
```

### 2.2 Métricas de Interacción
```typescript
interface InteractionMetrics {
  userId: string;
  targetUserId: string;
  
  messagesSent: number;
  messagesReceived: number;
  avgResponseTime: number;
  tensionIndex: number;         // cuán tensos son los intercambios
}
```

**Entregable:** Dado un canal, generar reporte de métricas por cada usuario.

---

## FASE 3: Detección de Patrones (7-10 días)

### 3.1 Patrones Individuales
```typescript
type UserPattern = 
  | 'GHOST'           // Desaparece por períodos largos
  | 'REACTIVE_ONLY'   // Solo responde, nunca inicia
  | 'DOMINANT'        // Monopoliza conversaciones
  | 'TENSION_TRIGGER' // Sus mensajes generan tensión en otros
  | 'TENSION_VICTIM'  // Recibe mensajes tensos frecuentemente
  | 'LATE_RESPONDER'  // Responde tarde sistemáticamente
  | 'OFF_HOURS'       // Trabaja fuera de horario normal
  | 'ISOLATED'        // Interactúa con pocos miembros
  | 'BRIDGE'          // Conecta subgrupos
  | 'STABLE';         // Sin patrones problemáticos
```

### 3.2 Patrones Grupales
```typescript
type GroupPattern =
  | 'SILOED'          // Subgrupos que no se comunican
  | 'BOTTLENECK'      // Todo pasa por una persona
  | 'TENSION_CLUSTER' // Subgrupo con alta tensión interna
  | 'GHOST_TOWN'      // Baja actividad general
  | 'CHAOS'           // Demasiados mensajes, poco orden
  | 'HEALTHY';        // Comunicación balanceada
```

### 3.3 Detector
```typescript
function detectPatterns(
  userMetrics: UserMetrics[],
  interactions: InteractionMetrics[]
): {
  userPatterns: Map<string, UserPattern[]>;
  groupPatterns: GroupPattern[];
}
```

**Entregable:** Dado un canal analizado, detectar patrones problemáticos.

---

## FASE 4: Motor de Diagnóstico (5-7 días)

### 4.1 Diagnóstico por Usuario
```typescript
interface UserDiagnosis {
  userId: string;
  patterns: UserPattern[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  
  findings: string[];           // "Responde 3x más lento que el promedio"
  rootCauses: string[];         // "Posible sobrecarga de trabajo"
  recommendations: string[];    // "Reducir canales asignados"
}
```

### 4.2 Diagnóstico Grupal
```typescript
interface GroupDiagnosis {
  channelId: string;
  patterns: GroupPattern[];
  healthScore: number;          // 0-100
  
  findings: string[];
  recommendations: string[];
  priorityActions: string[];    // Top 3 cosas a hacer YA
}
```

### 4.3 Reglas de Diagnóstico
Mapeo de patrones → causas probables → recomendaciones:

```
GHOST + HIGH_TENSION_RECEIVED → "Posible burnout o conflicto no resuelto"
  → "Conversar 1:1 sobre carga de trabajo y ambiente"

REACTIVE_ONLY + ISOLATED → "Falta de integración al equipo"
  → "Incluir en decisiones, asignar ownership de temas"

DOMINANT + TENSION_TRIGGER → "Estilo de comunicación problemático"
  → "Coaching en comunicación asertiva"
```

**Entregable:** Reporte de diagnóstico con hallazgos y recomendaciones accionables.

---

## FASE 5: Output Vendible (3-5 días)

### 5.1 Reporte PDF
- Resumen ejecutivo (1 página)
- Salud general del equipo
- Diagnóstico por persona (sin nombres, con códigos)
- Top 5 recomendaciones priorizadas
- Comparativa con benchmarks

### 5.2 Dashboard (opcional, v2)
- Visualización de red de interacciones
- Timeline de tensión
- Métricas en tiempo real

### 5.3 API
```typescript
// Para integración con otros sistemas
POST /analyze
  body: { messages: Message[] }
  response: { diagnosis: GroupDiagnosis, users: UserDiagnosis[] }
```

---

## Resumen de Esfuerzo

| Fase | Días | Acumulado |
|------|------|-----------|
| FASE 1: Data Layer | 5-7 | 7 |
| FASE 2: Métricas Usuario | 5-7 | 14 |
| FASE 3: Patrones | 7-10 | 24 |
| FASE 4: Diagnóstico | 5-7 | 31 |
| FASE 5: Output | 3-5 | 36 |

**Total: ~5-6 semanas de desarrollo intensivo**

---

## MVP Mínimo para Primer Cliente (2-3 semanas)

Si querés salir a vender antes, el MVP sería:

1. **Importador WhatsApp** (2 días)
2. **Métricas básicas por usuario** (3 días)
3. **3-5 patrones críticos** (3 días)
4. **Diagnóstico simple** (3 días)
5. **Reporte Markdown/PDF** (2 días)

**MVP en ~13 días**, suficiente para hacer un diagnóstico real a una cooperativa o empresa familiar y tener caso de estudio.

---

## Dependencias Técnicas Nuevas

```json
{
  "better-sqlite3": "^9.0.0",   // Storage
  "pdf-lib": "^1.17.1",          // Generación PDF
  "chart.js": "^4.0.0",          // Gráficos (opcional)
  "natural": "^6.0.0"            // NLP adicional (opcional)
}
```

---

## Riesgos

1. **Privacidad:** Estás leyendo conversaciones privadas. Necesitás consentimiento explícito.
2. **Precisión:** Las primeras versiones van a tener falsos positivos. Iteración con casos reales es clave.
3. **Interpretación:** Los patrones son indicadores, no verdades absolutas. El reporte debe ser cauteloso.

---

## Siguiente Paso

¿Chatee arranca con FASE 1 (Data Layer) o querés primero conseguir un cliente piloto y después construir?
