# Database Table Patterns

Categorization of tables by usage, row/column characteristics, and relationship types.

## Table Types
- **Reference**: Small, permanent lookup tables (e.g., Status codes). Use char PK.
- **Master (Small/Large)**: Stores permanent entities (e.g., Users, Products). Small uses char PK; Large uses auto-assigned int PK.
- **Transactions**: Records interactions/events (e.g., Orders, Logins). Uses auto-assigned int PK.
- **Cross Reference**: Maps relationships between master tables (e.g., UserRoles). Uses multi-column PK.

## Functional Patterns
- **History Tables**: Append-only tables for audit trails and point-in-time recovery.
- **Resolution Pattern**: Logic for choosing a value when multiple sources exist.
- **Sequence Dependencies**: Managing order-of-operations in the database layer.

## Security & Integrity
- **Read-only Lookups**: Enforcing immutability via DB permissions.
- **Limited Transaction**: Adding unique constraints to prevent invalid state transitions.
- **Reverse Foreign Key (Anti-pattern)**: Attempting to have Table A prohibit Table B. Usually indicates a missing primary key or relationship structure.

## Denormalization
- **Fetch**: Redundant data for read performance.
- **Aggregation**: Pre-calculated totals.
- **Extend**: Side-car tables for optional attributes.
