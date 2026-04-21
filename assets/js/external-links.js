// Open external links in new tabs
document.addEventListener('DOMContentLoaded', function() {
  // Get all links in the document
  const links = document.querySelectorAll('article a, .post-content a, main a');

  links.forEach(link => {
    const href = link.getAttribute('href');

    // Skip if no href or it's an anchor
    if (!href || href.startsWith('#')) {
      return;
    }

    // Check if link is external
    // External = starts with http:// or https:// and is not the current domain
    const isExternal = (href.startsWith('http://') || href.startsWith('https://'))
                      && !href.includes(window.location.hostname);

    // Open external links in new tab
    if (isExternal) {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    }
  });
});
