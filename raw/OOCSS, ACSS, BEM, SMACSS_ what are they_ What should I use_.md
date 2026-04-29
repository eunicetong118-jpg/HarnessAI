---
title: "OOCSS, ACSS, BEM, SMACSS: what are they? What should I use?"
source: "https://clubmate.fi/oocss-acss-bem-smacss-what-are-they-what-should-i-use"
author:
published:
created: 2026-04-29
description: "The way we write CSS has changed a lot in last few years, and the abbreviation jungle gets deeper and deeper. Heres a list of links to…"
tags:
  - "clippings"
---
**Filed under:** [Styling](https://clubmate.fi/category/styling) **— Tagged with:** [CSS](https://clubmate.fi/tag/css)

The way we write CSS has changed a lot in last few years, and the abbreviation jungle gets deeper and deeper. Heres a list of links to influential articles and quick summaries of the listed methodologies.

> **update:** 2014.01.23 rewrote the Atomic and the BEM sections.

![fry-CSS](https://clubmate.fi/images/fry-CSS.jpg)

I think there have bee happening big things in how we write CSS, for a reason I suppose. The will to make CSS more modular is strong (to make CSS so that it's easier to control without breaking everything when you change a small thing).

## Object Oriented CSS (OOCSS)

In a nutshell:

**Keep the structure and skin separate**

Keep the visuality separate, so you can reuse the visual classes. For instance, you wouldn't anymore add gradient to a `.button` element, but define a general gradient somewhere and then just extend the gradient to the `.button`

**Separate container and content**

*“rarely use location-dependent styles.”* Roughly, this means that do not cascade, go straight into object, give them a class and reference that in your CSS. Don't do this:

```css
ul li.list-item {
  color: red;
}
```

Go straight into the element:

```css
.list-item {
  color: red;
}
```

More reading on the subject:

- Official [OCSS documentation on GitHub](https://github.com/stubbornella/oocss/wiki)
- Nice read about [OCSS in Smashing Magazine](http://coding.smashingmagazine.com/2011/12/12/an-introduction-to-object-oriented-css-oocss)

## Atomic approach

Now, Atomic can mean a few things:

1. Atomic design principle coined by Brad Frost on his article ["Atomic Design"](http://bradfrost.com/blog/post/atomic-web-design/).
2. Atomic CSS (ACSS), popularized by [@thierrykoblentz](https://twitter.com/thierrykoblentz) on an article ["Challenging CSS Best Practices"](http://www.smashingmagazine.com/2013/10/21/challenging-css-best-practices-atomic-approach/).
3. The atomic approach can also be applied to the project’s file structure: [The “Other” Interface: Atomic Design With Sass](http://coding.smashingmagazine.com/2013/08/02/other-interface-atomic-design-sass/).

Like the names suggest, all of these methodologies pull analogies from science, Atoms being the smallest possible building blocks and so on.

### Atomic Design

In a nutshell:

1. Atoms
	- An HTML element, e.g. an `input`
2. Molecules
	- A set of HTML elements, a search for example including a `label`, `input` and a `button`
3. Organisms
	- A set of Molecules, like a header of a site. This site has in the header Organism: Site title, Beta remark, navigation and search
4. Templates
	- A wireframe of the wholes site, containing all the Organisms, layout starts to appear
5. Pages
	- The whole thing together, the most complex compound of all, the actual site with all it's images and everything

More reading: [Atomic Design](http://bradfrost.com/blog/post/atomic-web-design/).

On a related note, *but not the same thing*, Atomic CSS. Thanks [@thierrykoblentz](https://twitter.com/thierrykoblentz) for the correction.

### Atomic CSS (ACSS)

[This beautiful and somewhat controversial article](http://www.smashingmagazine.com/2013/10/21/challenging-css-best-practices-atomic-approach/) trashes everything you’ve know about CSS (pretty much). **Premise being:** only use reusable classes like:

```css
.mt-20 {
  margin-top: 20px;
}

/* Or */
.fl {
  float: left;
}
```

Just one declaration per selector. Essentially, putting the styling back to the markup, like we used to do in the early nineties. Sounds really crazy, but it’s actually quite liberating. You can reuse classes like hell.

Here’s a simple example. Take the below markup where the `p` needs to be inlined with the `a`:

```html
<p>
  The way we write CSS has changed a lot in last few years, and the abbreviation
  [...]
</p>
<a href="/article/"> More→ </a>
```

No style applies to the `p` element (expect for the built-in paragraph styles), but now I want to display the `p` inline with the 'Read more" anchor. I would have to painstakingly go to my CSS file and create a new rule for the `p`, a rule that is only specific for that element. Bloat. So I might as well use a previously defined utility class:

```css
.di {
  display: inline;
}
```

And add it in:

```html
<p class="di">
  The way we write CSS has changed a lot in last few years, and the abbreviation
  [...]
</p>
<a href="/article/"> More→ </a>
```

Nice! No bloat, no bloat problems.

Downside of this is media queries, because now all styling is in markup, you can’t affect the layout anymore with media queries, you can’t remove a float for instance when on phone. [The original article comments have a bit about this](http://coding.smashingmagazine.com/2013/10/21/challenging-css-best-practices-atomic-approach/#comment-973765).

Only way around this is to send a different markup for every device, which is exactly the non-media-query-way of doing things (which is probably fine, I just don’t know that much about it). Or to use a JavaScript solution like [Responsive Elements](http://kumailht.com/responsive-elements/), which adds classes to the elements depending on the viewport width.

This approach is good for really big sites, it’s not as beneficial for smaller sites. Have a look at the [my.yahoo.com](http://my.yahoo.com/) with your devtools and you'll see it in action.

I’m using utility classes on every project pretty much, but just not on full throttle, it's not the driving main system ever. Mostly because I want to use media queries.

> **Editor’s note from 2020:** [Fela is a CSS in JS library](https://fela.js.org/) that churns out atomic classes, but you can write CSS normally.

### Atomic file organization

[The “Other” Interface: Atomic Design With Sass](http://coding.smashingmagazine.com/2013/08/02/other-interface-atomic-design-sass/) article takes the Atomic thinking and applies it to file organization, it also introduces Quarks (this is what atoms are made of).

Here’s a little bash command to barf out a file structure if you want to play with it:

```shell
$ mkdir -p atomic-structuring/{utilities,quarks,atoms,molecules}
  && cd atomic-structuring
  && touch utilities/{_base-spacing.scss,_clearfix.scss,_reset.scss}
  && touch quarks/{_lists.scss,_paragraphs.scss,_tables.scss,_links.scss}
  && touch atoms/{_media.scss,_flag.scss,_button.scss,_grids.scss}
  && touch molecules/{_banner.scss,_custom-post.scss,_footer-nav.scss,_heading-group.scss}
```

It gives you the following kind of tree:

```text
atomic-structuring/
├── atoms
│   ├── _button.scss
│   ├── _flag.scss
│   ├── _grids.scss
│   └── _media.scss
├── molecules
│   ├── _banner.scss
│   ├── _custom-post.scss
│   ├── _footer-nav.scss
│   └── _heading-group.scss
├── quarks
│   ├── _links.scss
│   ├── _lists.scss
│   ├── _paragraphs.scss
│   └── _tables.scss
└── utilities
    ├── _base-spacing.scss
    ├── _clearfix.scss
    └── _reset.scss
```

You probably get the hang of the technique, now you’ve got a hierarchical structure for the code. It might take a bit of getting use to.

## Block, Element, Modifier (BEM)

In a nutshell:

- It’s a way to name your classes, since CSS doesn’t have scope (I guess it’s more than that, but this is the easily extrapolated thing in it).
- It’s easy for anyone to understand BEM code, cause of the strict rules (also easier for you to write when you have a system).

Code example:

```css
/* This is the Block */
.block {
  background-color: Pink;
}

/* This is an element, that helps to form the block as a whole */
.block__element {
  border-radius: 4px;
}

/* This modifies the element or a block*/
.block--modifier {
  border-radius: 0;
}
```

Let’s start with a **wrong** example, this is bad:

```html
<header class="block">
  <h1 class="block__elem1">
    <a class="block__elem1__elem2" href="/">clubmate.fi</a>
  </h1>
</header>
```

Don’t go so deep `block__elem1__elem2`, don’t try to mimic the DOM tree.

The following is better:

```html
<header class="block">
  <h1 class="block__elem1">
    <a class="block__elem2" href="/">clubmate.fi</a>
  </h1>
</header>
```

[This excellent SO answer](https://stackoverflow.com/a/27900589/976972) nails it down pretty succinctly:

> Nested html-elements is a DOM-tree. The names of the classes you write is a BEM-tree. Feel the difference!

DOM tree:

```html
<ul>
  <li>
    <a>
      <span></span>
    </a>
  </li>
</ul>
```

```text
.ul {}
.ul > li {}
.ul > li > a {}
.ul > li > a > span {}
```

BEM tree:

```html
<ul class="menu">
  <li class="menu__item">
    <a class="menu__link">
      <span class="menu__text"></span>
    </a>
  </li>
</ul>
```

```text
.menu {}
.menu__item {}
.menu__link {}
.menu__text {}
```

Here’s a real world example:

```html
<!-- Block -->
<header class="col-header">
  <!-- Block element -->
  <h1 class="col-header__heading">
    <a class="col-header__link" href="/">clubmate.fi</a>
  </h1>

  <!-- Block element -->
  <span class="col-header__beta">(beta)</span>

  <!-- New Block -->
  <nav class="nav">
    <!-- Block element -->
    <a class="nav__item" href="/">Home</a>

    <!-- Block element -->
    <a class="nav__item" href="/archives">Archives</a>

    <!-- Element and a modifier -->
    <a class="nav__item nav__item--uplink" href="#header">&uarr;</a>
  </nav>
</header>
```

Drill into the [Yandex](http://company.yandex.ru/) site with your devtools to see it in action.

I was so happy to start using this, finally a system, an order into class naming that I had always been lacking. Felt like it freed a lot of resources in my brain:

> There are only two hard things in Computer Science: cache invalidation and naming things. —Phil Karlton

BEM tries to address the naming.

More reading:

- The BEM site: [bem.info](http://bem.info/method/definitions/)
- An easy to understand [article about BEM in csswizardy.com](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)
- [Great SO answer](https://stackoverflow.com/a/27900589/976972) by Igor Zenich

## SMACSS—Scalable and Modular Architecture for CSS

> SMACSS (pronounced “smacks”) is more style guide than rigid framework.

This is pretty much says the same thing as the before mentioned methods, but in a different wrapper. You can read more about it at the [SMACSS website](http://smacss.com/). Most of the content is free to read, but you can also buy the book if you prefer.

I think SMACSS is more vague as a concept than the others, it’s just a set of tutorials on how to write good CSS. Which is pretty nice in and of itself.

Also a great read is the Smashing Mag article [Decoupling HTML from CSS](http://coding.smashingmagazine.com/2012/04/20/decoupling-html-from-css).

## Which one should I use then?

I don’t know. What ever feels right to you and your team.

Comments would go here, but the commenting system isn’t ready yet, sorry.