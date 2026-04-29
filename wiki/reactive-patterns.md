# Reactive Design Patterns

Patterns for building resilient, elastic, and message-driven systems.

## Fault Tolerance & Recovery
- **Let-it-crash**: Favoring process restart over complex error handling in-place.
- **Error Kernel**: Keeping parent components stable while child components handle risky operations.
- **Circuit Breaker**: Preventing system failure by failing fast when a downstream service is struggling.

## Message Flow
- **Request-Response**: Synchronous or asynchronous pairing.
- **Saga**: Managing long-running transactions across distributed services without global locks.
- **Aggregator**: Combining multiple message results into one.
- **Forward Flow**: Unidirectional data propagation.

## State Management
- **Sharding**: Partitioning data to scale horizontally.
- **Event Sourcing**: Storing state as a sequence of immutable events.
- **Event Stream**: Continuous flow of state changes.

## Flow Control
- **Pull vs. Push**: Backpressure management.
- **Throttling/Drop**: Protecting the system from overload by shedding load.
