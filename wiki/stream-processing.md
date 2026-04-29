# Stream Processing Patterns

Architectures for reacting to data in real-time without persistent storage.

## Core Concepts
- **Interactive Analytics**: Ad-hoc queries with < 10s latency (e.g., Druid, MemSQL).
- **Streaming Analytics**: Static queries on moving data with millisecond latency (e.g., Flink, Samza).
- **Streaming SQL**: High-level declarative language for windowed and temporal queries.

## 13 Key Patterns
1. **Preprocessing**: Filtering, reshaping, splitting, and transforming streams.
2. **Alerts & Thresholds**: Detecting conditions (e.g., speed limit exceeded).
3. **Windows**:
    - **Time vs. Length**: Selecting by duration or event count.
    - **Sliding vs. Batch (Tumbling)**: Continuous vs. interval-based output.
4. **Joins**: Matching multiple streams (e.g., player location + ball acceleration).
5. **Data Correlation**: Handling missing events or erroneous sensor data.
6. **DB Interaction**: Enriching real-time events with historical data.
7. **Temporal Sequences**: Regular expressions on event order (e.g., small transaction -> large transaction).
8. **Tracking**: Monitoring movement over space and time (Geo-fencing).
9. **Trend Detection**: Outliers, rises, falls, and complex technical patterns.
10. **Lambda Architecture**: Running same query in batch and real-time to fill the 15-min "batch gap".
11. **Anomalous Drill-down**: Switching to detailed historical analysis upon detecting anomalies.
12. **Model Integration**: Scoring real-time events against ML models (PMML).
13. **Online Control**: Real-time feedback loops for robotics/autopilots.
