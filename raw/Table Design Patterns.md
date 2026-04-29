---
title: "Table Design Patterns"
source: "http://database-programmer.blogspot.com/2008/01/table-design-patterns.html"
author:
published:
created: 2026-04-29
description: "This entry lists all of the Table Design Patterns that I have described  in the blog entries.  I will update it whenever a new pattern is d..."
tags:
  - "clippings"
---
This entry lists all of the Table Design Patterns that I have described in the blog entries. I will update it whenever a new pattern is described.

## Basic Table Types

These patterns describe the kinds of things that you store in tables. Each pattern is characterized by the relative number of columns and rows, and whether it stores either information about permanent things or interactions between permanent things.

These patterns were described in the entry on [A Sane Approach to Primary Keys](http://database-programmer.blogspot.com/2008/01/database-skills-sane-approach-to.html).

| Pattern Name | Relative Column Count | Relative Row Count | Type | Notes |
| --- | --- | --- | --- | --- |
| [Reference](http://database-programmer.blogspot.com/2008/01/database-skills-sane-approach-to.html#rule1) | Small | Small | Permanent | Use single-column character primary key. |
| [Small Master](http://database-programmer.blogspot.com/2008/01/database-skills-sane-approach-to.html#rule2) | Small | Small | Permanent | Use single-column character primary key. |
| [Large Master](http://database-programmer.blogspot.com/2008/01/database-skills-sane-approach-to.html#rule3) | Large | Large | Permanent | Use integer auto-assigned primary key |
| [Transactions](http://database-programmer.blogspot.com/2008/01/database-skills-sane-approach-to.html#rule4) | n/a | n/a | Transient | Describes interactions between things, like a customer purchase of an item or a student's enrollment in a class. Use integer auto-assigned primary key |
| [Cross Reference](http://database-programmer.blogspot.com/2008/01/database-skills-sane-approach-to.html#rule5) | n/a | n/a | Permanent | Describes relationships between master entries, such as an item's price group or a teacher's department. Use multi-column primary keys. |

## Expanded Table Types

The [Limited Transaction Pattern](http://database-programmer.blogspot.com/2008/01/table-design-pattern-limited.html) occurs when restrictions on allowed transactions require one or more additional unique constraints on a transaction table.

The [Impermanent Primary Key](http://database-programmer.blogspot.com/2008/02/primary-key-that-wasnt.html) pattern occurs when a value that is a good choice for a natural key will change from time to time. For this pattern we use a pair of tables to track the entity.

## Foreign Key Patterns

There are [two fundamental kinds of foreign key](http://database-programmer.blogspot.com/2008/07/different-foreign-keys-for-different.html), which correspond to the "master table" and "transaction tables" types.

[The cross-reference validation pattern](http://database-programmer.blogspot.com/2008/01/table-design-patterns-cross-reference.html) occurs when an entry must be validated against some previously defined relationship between master items.

## Secure Patterns

Some table patterns depend upon security as a basic part of their definition. Different combinations of SELECT, INSERT, UPDATE, and DELETE permissions can replace complex application logic with zero-code server-implemented solutions.

- [Read-only Lookup Table](http://database-programmer.blogspot.com/2008/05/introducing-database-security.html#readonlylookup).

## Denormalization Patterns

Many seasoned database programmers denormalize their databases for a variety of reasons. Like all database activities, these also follow patterns. In the post [Denormalization Patterns](http://database-programmer.blogspot.com/2008/04/denormalization-patterns.html), we see three distinct patterns:

- [The FETCH pattern](http://database-programmer.blogspot.com/2008/04/denormalization-patterns.html#fetch)
- [The Aggregration Pattern](http://database-programmer.blogspot.com/2008/04/denormalization-patterns.html#aggregations)
- [The EXTEND Pattern](http://database-programmer.blogspot.com/2008/04/denormalization-patterns.html#extend)

## Other Patterns

The [Resolution Pattern](http://database-programmer.blogspot.com/2008/04/advanced-table-design-resolutions.html) occurs when a value may come from more than one place and you must *resolve* the possibilities into a final choice.

[History Tables](http://database-programmer.blogspot.com/2008/07/history-tables.html) provide three major benefits. They provide an audit trail of user actions, they give you the ability to reproduce the state of a table at some prior time, and if they are cleverly designed they can produce very useful aggregate numbers such as a company's total open orders for any given day in the past or the total change in open balances in any arbitrary period of time.

If you need to [Sequence Dependencies](http://database-programmer.blogspot.com/2008/08/advanced-algorithm-sequencing.html) it can be done with a combination of tables and server-side code.

You can implement [Secure Password Resets](http://database-programmer.blogspot.com/2008/09/advanced-table-design-secure-password.html) entirely in the database server.

## Anti-patterns

Sometimes user requirements appear to call for things that are impossible to do. When the analysis leads to one of these patterns it may seem like a dead-end, but there are usually valid patterns hiding beneath these.

- When user requirements say "If X happens then Y may not happen" some analysts will see this as saying an entry in table A prohibits an entry in table B. This is a **Reverse Foreign Key**, which does not exist and cannot be implemented, it is an anti-pattern. These are often [A Primary Key in Disguise](http://database-programmer.blogspot.com/2008/02/false-patterns-such-as-reverse-foreign.html).