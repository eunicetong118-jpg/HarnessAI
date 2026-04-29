# CSS Methodologies

Modular and scalable approaches to styling.

## Object-Oriented CSS (OOCSS)
- **Separate Structure and Skin**: Keep visuality (gradients, colors) separate from layout (padding, position).
- **Separate Container and Content**: Elements should look the same regardless of where they are placed. Avoid location-dependent styles (`.sidebar h2`).

## Block, Element, Modifier (BEM)
- **Block**: Standalone entity (`.menu`).
- **Element**: Component within a block (`.menu__item`).
- **Modifier**: Variation of block/element (`.menu__item--active`).
- **Rule**: Avoid deep nesting like `block__elem1__elem2`. Use flat BEM trees.

## Atomic CSS (ACSS) & Atomic Design
- **Atomic CSS**: Single-purpose utility classes (`.mt-20 { margin-top: 20px; }`). Reduces bloat at scale but makes media queries harder.
- **Atomic Design (Brad Frost)**:
    - **Atoms**: Basic tags (`input`, `button`).
    - **Molecules**: Groups of atoms (`search form`).
    - **Organisms**: Complex components (`header`).
    - **Templates**: Page-level layout.
    - **Pages**: Specific instances with real content.

## SMACSS
- **Categories**: Base, Layout, Module, State, Theme.
- **State**: Prefixed with `is-` (e.g., `.is-hidden`).
