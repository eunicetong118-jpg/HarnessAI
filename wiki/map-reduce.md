# MapReduce Patterns

Patterns for distributed data processing using Mapper, Reducer, and Combiner primitives.

## Basic Patterns
- **Counting & Summing**: Standard word-count style aggregation. Optimized with **Combiners** to reduce network traffic.
- **Collating**: Grouping items by a common function (e.g., Inverted Indexes).
- **Filtering/Grepping**: Independent record transformation or validation.
- **Distributed Execution**: Running simulation/computation fragments in parallel.

## Structural Patterns
- **Sorting**: Heart of MapReduce. Leverages composite keys for secondary sorting/grouping.
- **Iterative Message Passing**: Graph processing (Breadth-First Search, PageRank). Mapper "infects" neighbors; Reducer updates state.
- **Distinct Values**: Unique item counting, often requiring a two-stage MapReduce job.

## Correlation & Joins
- **Cross-Correlation**: Pairs approach vs. **Stripes approach** (in-memory associative arrays are faster but riskier).
- **Relational Joins**:
    - **Repartition Join**: Generic, handles any size, but involves high data transfer.
    - **Replicated Join (Map-side Join)**: Joins small table (cached in memory) with large table. High performance, no shuffle.
