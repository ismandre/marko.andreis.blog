# Blog Content Guide

This guide explains how to organize and add content to your Jekyll blog.

## How Your Blog is Organized

Your Jekyll blog uses a simple but powerful structure:

### Current Structure:
- **Home page** (`index.md`) - Uses `_data/menu.yml` to display navigation and post listings
- **Section pages** - `experiences.md`, `books.md`, `about.md` (already created!)
- **Posts directory** - `_posts/` contains all your blog posts
- **Menu configuration** - `_data/menu.yml` controls what appears on the home page

---

## Step-by-Step Guide to Adding Blog Content

### STEP 1: Update Your Home Page Menu

Edit `_data/menu.yml` to create your three-section structure:

```yaml
entries:
  - title: about
    url: about.html

  - title: experiences
    post_list:
      category: experiences
      limit: 5
      show_more: true
      show_more_text: see all experiences →
      show_more_url: experiences.html

  - title: books
    post_list:
      category: books
      limit: 5
      show_more: true
      show_more_text: see all books →
      show_more_url: books.html

  - title: rss
    url: feed.xml
```

### STEP 2: Update Section Pages

Each section page (`experiences.md`, `books.md`) should list all posts in that category:

**For `experiences.md`:**
```yaml
---
layout: page
title: experiences
---

Things I've tried, courses I've completed, work experiences, and life reflections.

{%- include post_list.html category="experiences" -%}
```

**For `books.md`:**
```yaml
---
layout: page
title: books
---

Notes and thoughts on books I've read.

{%- include post_list.html category="books" -%}
```

**For `about.md`:**
Keep it as is - it's your personal introduction page.

### STEP 3: Create Blog Posts

**File naming convention:** `YYYY-MM-DD-title-slug.md` in the `_posts/` directory

**For experiences posts:**
```markdown
---
layout: post
category: experiences
title: "My First Week at Company X"
date: 2026-03-25
---

Your content here...
```

**For books posts:**
```markdown
---
layout: post
category: books
title: "Notes on Shoe Dog by Phil Knight"
date: 2026-03-20
---

Your content here...
```

### STEP 4: Writing Posts - Best Practices

**Front matter (required):**
- `layout: post` - Always use this for posts
- `category:` - Use `experiences` or `books`
- `title:` - Your post title (optional if filename is descriptive)
- `date:` - Publication date (optional, defaults to filename date)

**Content tips:**
- Use markdown formatting (headings, lists, code blocks, etc.)
- Add images: `![alt text](/assets/img/your-image.jpg)`
- Use front matter to organize and filter posts

---

## Quick Workflow for Adding New Content

1. **Write a new post:** Create `_posts/2026-03-25-my-post-title.md`
2. **Add front matter:** Set layout, category, and title
3. **Write content:** Use markdown
4. **Preview locally:** Run `bundle exec jekyll serve`
5. **Commit and push:** Your site will rebuild automatically

---

## Example: Adding Your First Experience Post

Create the file:
```
_posts/2026-03-25-finishing-stanford-machine-learning.md
```

With content:
```markdown
---
layout: post
category: experiences
title: "Finishing Stanford's Machine Learning Course"
---

After 3 months of dedication, I finally completed Andrew Ng's Machine Learning course.

## What I Learned
- Linear regression and gradient descent
- Neural networks from scratch
- Practical tips for ML projects

## Key Takeaways
The most valuable lesson was...
```

---

## Summary Checklist

- [ ] Update `_data/menu.yml` with your three sections
- [ ] Update `experiences.md` to show all experience posts
- [ ] Update `books.md` to show all book posts
- [ ] Keep `about.md` as your personal intro
- [ ] Start writing posts in `_posts/` with proper categories
- [ ] Use `category: experiences` or `category: books` in front matter
- [ ] Preview changes with `bundle exec jekyll serve`

---

## Categories Reference

Your blog uses two main categories:

- **experiences** - Things you tried, courses, work experiences, life reflections
- **books** - Notes and thoughts on books you've read

Posts are automatically filtered and displayed on their respective section pages based on the `category` field in the front matter.

---

**That's it!** This theme is designed to be simple - just write markdown files and the theme handles the rest. Your home page will automatically show recent posts from each category with links to see more.
