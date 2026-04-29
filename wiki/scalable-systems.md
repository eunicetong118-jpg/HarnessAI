# Scalable System Design Patterns

Common architectural patterns for building large-scale, high-availability systems.

## Distribution Patterns
- **Load Balancer**: Dispatcher distributes requests to stateless workers. Standard for web scale.
- **Scatter and Gather**: Dispatcher multicasts request to all workers; consolidates local results into one response (e.g., Search Engines).
- **Execution Orchestrator**: Intelligent scheduler manages task dependencies across "dumb" workers (e.g., MS Dryad).

## Data & Flow Patterns
- **Result Cache**: Memoization at the dispatcher level (e.g., Memcached).
- **Pipe and Filter**: Data Flow Programming; workers connected by pipes (EAI pattern).
- **Shared Space (Blackboard)**: Workers contribute to a common data space until a solution is reached.

## Parallel Processing
- **MapReduce**: Targeted at batch jobs where disk I/O is the bottleneck. Uses distributed filesystems.
- **Bulk Synchronous Parallel (BSP)**: Lock-step execution (Read -> Process -> Push) coordinated by a master (e.g., Google Pregel).
