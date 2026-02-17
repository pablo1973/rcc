# RCC Public API

**Version:** 1.0.0  
**Status:** Stable  

## Overview

RCC (Regulador Cognitivo Conversacional) provides a deterministic pipeline for analyzing, regulating, and routing conversational messages based on emotional tone.

```
Input → analyze() → regulate() → route() → Output
```

## Installation

```typescript
import { analyze, regulate, run } from 'rcc/api';
```

## Quick Start

```typescript
// Full pipeline (recommended)
const result = run({ text: 'Hello world' });

// Analysis only
const analysis = analyze('Hello world');

// Analysis + regulation
const regulated = regulate({ text: 'Hello world' });
```

---

## Functions

### `analyze(input)`

Analyzes input text and returns emotional state classification.

**Signature:**
```typescript
function analyze(input: RCCInput | string): RCCAnalysisResult
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `input` | `RCCInput \| string` | Text to analyze |

**Returns:** `RCCAnalysisResult`

**Example:**
```typescript
const result = analyze({ text: 'Hello world' });
// {
//   state: 'CALM',
//   score: 0.15,
//   reason: 'LOW_INTENSITY'
// }
```

---

### `regulate(input)`

Analyzes and applies regulation to input text.

**Signature:**
```typescript
function regulate(input: RCCInput | string): RCCRegulationResult
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `input` | `RCCInput \| string` | Text to regulate |

**Returns:** `RCCRegulationResult`

**Example:**
```typescript
const result = regulate({ text: 'ANGRY MESSAGE!!!' });
// {
//   analysis: { state: 'TENSE', score: 0.85, ... },
//   action: 'SOFTEN',
//   message: 'ANGRY MESSAGE!!!',
//   meta: {}
// }
```

---

### `run(input)`

Executes full RCC pipeline: analyze → regulate → route.

**Signature:**
```typescript
function run(input: RCCInput | string): RCCResult
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `input` | `RCCInput \| string` | Text to process |

**Returns:** `RCCResult`

**Example:**
```typescript
const result = run({ 
  text: 'Hello world',
  meta: { userId: '123' }
});
// {
//   analysis: { state: 'CALM', score: 0.15, ... },
//   regulation: { action: 'PASSTHROUGH', message: 'Hello world' },
//   routing: { channel: 'TEXT' },
//   meta: { userId: '123' }
// }
```

---

## Types

### Input Types

#### `RCCInput`
```typescript
interface RCCInput {
  text: string;                    // Required: message text
  meta?: Record<string, unknown>;  // Optional: preserved metadata
}
```

### State Types

#### `RCCState`
```typescript
type RCCState = 'CALM' | 'NEUTRAL' | 'TENSE';
```

| State | Score Range | Description |
|-------|-------------|-------------|
| `CALM` | `< 0.3` | Low emotional intensity |
| `NEUTRAL` | `0.3 - 0.69` | Mixed or moderate signals |
| `TENSE` | `≥ 0.7` | High emotional intensity |

#### `RCCReason`
```typescript
type RCCReason = 'LOW_INTENSITY' | 'BASELINE' | 'HIGH_INTENSITY' | 'INVALID_INPUT';
```

### Action Types

#### `RCCAction`
```typescript
type RCCAction = 'PASSTHROUGH' | 'SOFTEN' | 'SUMMARIZE' | 'PAUSE';
```

| Action | Trigger | Description |
|--------|---------|-------------|
| `PASSTHROUGH` | CALM/NEUTRAL | No modification needed |
| `SOFTEN` | TENSE | Recommend tone softening |
| `SUMMARIZE` | (future) | Recommend summarization |
| `PAUSE` | (future) | Recommend cooldown |

#### `RCCChannel`
```typescript
type RCCChannel = 'TEXT' | 'COOLDOWN';
```

| Channel | Trigger | Description |
|---------|---------|-------------|
| `TEXT` | Default | Normal text output |
| `COOLDOWN` | PAUSE action | Delay before delivery |

### Result Types

#### `RCCAnalysisResult`
```typescript
interface RCCAnalysisResult {
  state: RCCState;
  score: number;          // 0-1
  reason: RCCReason;
}
```

#### `RCCRegulationResult`
```typescript
interface RCCRegulationResult {
  analysis: RCCAnalysisResult;
  action: RCCAction;
  message: string;
  meta: Record<string, unknown>;
}
```

#### `RCCResult`
```typescript
interface RCCResult {
  analysis: RCCAnalysisResult;
  regulation: {
    action: RCCAction;
    message: string;
  };
  routing: {
    channel: RCCChannel;
  };
  meta: Record<string, unknown>;
}
```

---

## Error Handling

### Error Types

```typescript
import { 
  RCCError, 
  InvalidInputError,
  AnalysisError,
  RegulationError,
  RoutingError,
  isRCCError 
} from 'rcc/api';
```

#### `RCCError` (base class)
```typescript
class RCCError extends Error {
  code: RCCErrorCode;
  details?: Record<string, unknown>;
  toInfo(): RCCErrorInfo;
  toJSON(): RCCErrorInfo;
}
```

#### Error Codes
```typescript
type RCCErrorCode =
  | 'INVALID_INPUT'      // Input validation failed
  | 'INPUT_TOO_LONG'     // Exceeds MAX_INPUT_LENGTH
  | 'ANALYSIS_FAILED'    // Analysis error
  | 'REGULATION_FAILED'  // Regulation error
  | 'ROUTING_FAILED';    // Routing error
```

### Error Handling Example

```typescript
import { run, isRCCError, InvalidInputError } from 'rcc/api';

try {
  const result = run({ text: userInput });
  // process result
} catch (error) {
  if (error instanceof InvalidInputError) {
    console.error('Invalid input:', error.message);
  } else if (isRCCError(error)) {
    console.error(`RCC Error [${error.code}]:`, error.message);
  } else {
    throw error;
  }
}
```

---

## Constants

```typescript
import { MAX_INPUT_LENGTH, VERSION } from 'rcc/api';

MAX_INPUT_LENGTH  // 10000 characters
VERSION           // '1.0.0'
```

---

## Pipeline Behavior

### State → Action Mapping

| State | Action |
|-------|--------|
| CALM | PASSTHROUGH |
| NEUTRAL | PASSTHROUGH |
| TENSE | SOFTEN |

### Action → Channel Mapping

| Action | Channel |
|--------|---------|
| PASSTHROUGH | TEXT |
| SOFTEN | TEXT |
| SUMMARIZE | TEXT |
| PAUSE | COOLDOWN |

---

## Determinism Guarantee

RCC is **fully deterministic**:
- Same input → Same output (always)
- No randomness
- No external dependencies
- No side effects

This enables:
- Reliable testing
- Reproducible results
- Predictable behavior

---

## Limits

| Limit | Value |
|-------|-------|
| Max input length | 10,000 characters |
| Min input length | 0 (returns INVALID_INPUT reason) |

---

## Thread Safety

RCC functions are stateless and thread-safe. Multiple concurrent calls with different inputs will not interfere.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-23 | Initial stable release |
