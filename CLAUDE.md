# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal blog built with Jekyll using a customized "no-style-please" theme. The blog features a unique chalkboard aesthetic with custom chalk cursor effects, handwritten fonts, and minimal CSS design philosophy. The site is deployed to a custom domain with GitHub Pages compatibility.

## Build & Development Commands

```bash
# Install dependencies
bundle install

# Run local development server
bundle exec jekyll serve
# Server runs at http://localhost:4000

# Build static site (output to _site/)
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean
```

## Project Architecture

### Content Organization

The blog uses a **category-based organization** with two main content sections:
- **experiences** - Work experiences, courses completed, life reflections, personal experiments
- **books** - Book notes and thoughts

Content structure:
- `_data/menu.yml` - Controls homepage navigation and post listing limits
- `_posts/` - All blog posts (filename format: `YYYY-MM-DD-title-slug.md`)
- `experiences.md` - Archive page for all experience posts
- `books.md` - Archive page for all book posts
- `about.md` - Personal introduction page

### Theme Customization Architecture

This is a **heavily customized fork** of the no-style-please theme:

**Custom visual design (_sass/):**
- `_variables.scss` - Color palette and custom handwritten font declarations
- `no-style-please.scss` - Main stylesheet with chalkboard aesthetic:
  - Custom @font-face declarations for 10+ handwritten fonts
  - Dark chalkboard background with chalk-colored text
  - Text shadows for chalk-like appearance
  - Custom cursor implementation
  - Responsive navbar with hamburger menu
  - Pinned image component with duct tape effect

**Interactive JavaScript features (assets/js/):**
- `chalk-cursor.js` - Custom chalk cursor that follows mouse
- `chalk-circle.js` - Circular chalk drawing on click
- `chalk-dust.js` - Particle effects
- `navbar.js` - Responsive navigation burger menu toggle

**Layouts (_layouts/):**
- `default.html` - Base template, loads all chalk effect scripts
- `home.html` - Homepage using menu.yml for navigation
- `page.html` - Static pages (about, books, experiences)
- `post.html` - Individual blog posts
- `archive.html` - Category-filtered post listings

**Includes (_includes/):**
- `navbar.html` - Site navigation with social links
- `menu_item.html` - Recursive menu rendering from menu.yml
- `post_list.html` - Post listing with category filtering
- `head.html` - SEO, meta tags, font loading
- `schema.html` - Structured data for SEO

### Configuration

`_config.yml` contains:
- Site metadata (title, author, description, custom domain)
- **baseurl: ""** - Critical for custom domain deployment (non-GitHub Pages subdirectory)
- Theme appearance settings (auto/light/dark mode)
- Plugins: jekyll-feed, jekyll-seo-tag, jekyll-sitemap, jektex (LaTeX support)
- JekTeX macros for mathematical notation
- Social links for SEO

### Asset Handling

**SCSS interpolation for baseurl:**
- All asset paths in SCSS use `url("#{$baseurl}/assets/...")` syntax
- The $baseurl variable is defined in `_sass/_variables.scss` and imported from `_config.yml`
- This ensures assets load correctly on both custom domains and GitHub Pages

**Custom fonts:**
- 10+ handwritten fonts stored in `assets/fonts/`
- Loaded via @font-face in main SCSS
- Primary fonts: 'blzee' (titles), 'KGNoRegretsSketch' (content)

**Images:**
- `assets/img/` - Background textures, chalk images, duct tape, about photo
- `assets/icons/` - SVG icons for navigation and social links

## Content Writing Guidelines

### Creating New Posts

**File naming:** `_posts/YYYY-MM-DD-title-slug.md`

**Front matter template:**
```yaml
---
layout: post
category: experiences  # or "books"
title: "Your Post Title"
date: YYYY-MM-DD
custom_js: []  # optional, for custom JavaScript
---
```

**Available categories:**
- `experiences` - Appears on experiences.html
- `books` - Appears on books.html

Posts without a category won't appear in category-specific sections.

### Updating Navigation

Edit `_data/menu.yml` to:
- Add/remove menu items
- Control post listing limits on homepage
- Configure "show more" links to archive pages

The menu.yml structure supports:
- Nested entries (unlimited depth)
- Post lists with category filtering
- Custom URLs and HTML in titles

### Special Features

**LaTeX math rendering:**
- Enabled via jektex plugin
- Use standard LaTeX syntax in posts
- Predefined macros in _config.yml (e.g., `\Q` for `\mathbb{Q}`)

**Custom cursor:**
- Automatically active on desktop (pointer: fine)
- Disabled on touch devices
- Can be customized via chalk-cursor.js

**Pinned image component:**
- Use class `pinned-image` for duct-taped photo effect
- Includes caption support (see about.md for example)

## Deployment Notes

- Configured for custom domain deployment at marko.andreis.blog
- **baseurl must remain ""** for custom domain
- If deploying to GitHub Pages subdirectory, update baseurl in _config.yml
- Static site output goes to _site/ (git-ignored)

## Ruby/Gem Requirements

- Ruby >= 3.4 (specified in no-style-please.gemspec)
- Jekyll ~> 3.10.0
- Key plugins: jekyll-feed, jekyll-seo-tag, jekyll-sitemap, jektex
