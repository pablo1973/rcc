# Flujo Lógico

## Pipeline

```
Input → Observation → State Resolution → Regulation → Output
```

## Etapas

1. **Input**: InputMessage (id, text, author, channel, timestamp)
2. **Observation**: analyze() → Observation { state }
3. **State Resolution**: CognitiveState determinado
4. **Regulation**: regulate() → RegulationResult { outputText }
5. **Output**: Texto regulado
