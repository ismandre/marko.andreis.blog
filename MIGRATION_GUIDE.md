# Migration Guide: WordPress to Jekyll on GitHub Pages

**Domain:** marko.andreis.blog
**Date Started:** 2026-04-14
**Deployment Method:** GitHub Pages with Custom Domain

---

## ⚠️ Important: Correct Order of Steps

**DO NOT add the custom domain in Phase 2!** The correct order is:

1. ✅ **Phase 1:** Configure project files (done)
2. ✅ **Phase 2:** Enable GitHub Pages WITHOUT custom domain
3. ✅ **Phase 3:** Configure DNS on Hostinger
4. ⏳ **Phase 4:** Backup WordPress (can do while waiting for DNS)
5. ⏳ **Phase 5:** Wait for DNS propagation, THEN add custom domain to GitHub
6. ⏳ **Phase 6:** Final verification
7. ⏳ **Phase 7:** Cleanup

**Why this order?** GitHub can't verify your custom domain until DNS points to GitHub's servers. Configure DNS first, wait for propagation, then add the domain.

---

## Progress Overview

- [x] **Phase 1:** Project Configuration (COMPLETED)
- [x] **Phase 2:** Enable GitHub Pages
- [ ] **Phase 3:** Configure DNS on Hostinger
- [ ] **Phase 4:** Backup & Shut Down WordPress
- [ ] **Phase 5:** DNS Propagation & Testing
- [ ] **Phase 6:** Final Verification
- [ ] **Phase 7:** Optional Cleanup

---

## Phase 1: Project Configuration ✅ COMPLETED

- [x] Update `_config.yml` with custom domain URL
- [x] Create/verify `CNAME` file with domain name
- [x] Commit changes to git
- [x] Push changes to GitHub repository

**Status:** Completed by Claude on 2026-04-14

---

## Phase 2: Enable GitHub Pages (WITHOUT Custom Domain Yet) ✅ COMPLETED

**IMPORTANT:** Do NOT add the custom domain yet! You'll add it in Phase 5 after DNS propagates.

### Steps:

1. [ ] Go to GitHub repository: https://github.com/ismandre/marko.andreis.blog
2. [ ] Click **Settings** (top navigation bar)
3. [ ] Click **Pages** in the left sidebar under "Code and automation"
4. [ ] Under **"Build and deployment"** → **"Source"**:
   - [ ] Branch: Select `master`
   - [ ] Folder: Select `/ (root)`
   - [ ] Click **Save**
5. [ ] **LEAVE "Custom domain" field EMPTY for now**
   - ⚠️ If you enter the domain now, you'll get an error because DNS isn't configured yet
   - You'll add it in Phase 5 after DNS propagates
6. [ ] **DO NOT check "Enforce HTTPS" yet** (wait until Phase 5)

**Notes:**
- GitHub Pages will start building your site immediately
- Your site will be available at: `https://ismandre.github.io/marko.andreis.blog`
- Initial build takes 1-2 minutes
- After saving, wait 1-2 minutes, then test the temporary URL

### Verify GitHub Pages is Working:

7. [ ] Wait 1-2 minutes after clicking Save
8. [ ] Visit: https://ismandre.github.io/marko.andreis.blog
9. [ ] Confirm your Jekyll site loads (even if some links don't work yet - that's normal)

**Completed on:** _______________

**Temporary GitHub Pages URL working:** [ ] Yes [ ] No

---

## Phase 3: Configure DNS on Hostinger ✅ COMPLETED

### Steps:

1. [ ] Log into Hostinger: https://hpanel.hostinger.com/
2. [ ] Navigate to **Domains** section
3. [ ] Select domain: `marko.andreis.blog`
4. [ ] Click **DNS / Name Servers** or **Manage DNS**
5. [ ] Click **Manage DNS records**

### Delete Existing Records:

6. [ ] Delete any existing **A records** pointing to `@` or `marko.andreis.blog`
7. [ ] Delete any **CNAME records** for `@` (if they exist)
8. [ ] Keep existing records for email (MX) and other services you use

### Add GitHub Pages A Records:

9. [ ] Add 4 new A records (one at a time):

| Type | Name/Host | Points to / Value | TTL |
|------|-----------|-------------------|-----|
| A    | @         | 185.199.108.153   | 3600 |
| A    | @         | 185.199.109.153   | 3600 |
| A    | @         | 185.199.110.153   | 3600 |
| A    | @         | 185.199.111.153   | 3600 |

**Record 1:**
- [ ] Type: A
- [ ] Name/Host: @ (or leave blank, or marko.andreis.blog)
- [ ] Points to: 185.199.108.153
- [ ] TTL: 3600

**Record 2:**
- [ ] Type: A
- [ ] Name/Host: @
- [ ] Points to: 185.199.109.153
- [ ] TTL: 3600

**Record 3:**
- [ ] Type: A
- [ ] Name/Host: @
- [ ] Points to: 185.199.110.153
- [ ] TTL: 3600

**Record 4:**
- [ ] Type: A
- [ ] Name/Host: @
- [ ] Points to: 185.199.111.153
- [ ] TTL: 3600

### Add WWW Subdomain (Optional but Recommended):

10. [ ] Add CNAME record for www subdomain:

| Type  | Name/Host | Points to / Value  | TTL |
|-------|-----------|-------------------|-----|
| CNAME | www       | ismandre.github.io | 3600 |

**Record 5:**
- [ ] Type: CNAME
- [ ] Name/Host: www
- [ ] Points to: ismandre.github.io
- [ ] TTL: 3600

11. [ ] Click **Save** or **Add Record** after each entry
12. [ ] Verify all 5 records are visible in the DNS management panel

**Completed on:** _______________

**Notes:**
- DNS changes can take 1-72 hours to propagate (usually 1-4 hours)
- Write down the time you made these changes: _______________

---

## Phase 4: Backup & Shut Down WordPress

### Backup WordPress Content:

1. [ ] Log into WordPress admin: https://marko.andreis.blog/wp-admin
2. [ ] Choose ONE backup method:

**Option A: WordPress Export (Recommended for content only)**
- [ ] Go to **Tools** → **Export**
- [ ] Select **"All content"**
- [ ] Click **"Download Export File"**
- [ ] Save the .xml file to your computer

**Option B: Full Backup Plugin (Recommended for complete backup)**
- [ ] Install **UpdraftPlus** plugin (or use Hostinger's backup tool)
- [ ] Go to **Settings** → **UpdraftPlus**
- [ ] Click **"Backup Now"**
- [ ] Select "Include database" and "Include files"
- [ ] Download all backup files when complete

**Option C: Manual File Backup**
3. [ ] Go to **Hostinger Dashboard** → **Hosting**
4. [ ] Click **File Manager**
5. [ ] Navigate to `public_html` (or your WordPress installation folder)
6. [ ] Select all files → Right-click → **Compress** (creates a .zip)
7. [ ] Download the .zip file to your computer

### Download Media Files:

8. [ ] In WordPress, go to **Media** → **Library**
9. [ ] Use a plugin like "Export Media Library" or download files you want to keep manually
10. [ ] Save important images/PDFs to your computer

### Shut Down WordPress:

**Note:** You can do this now OR wait until DNS has fully propagated to GitHub Pages

11. [ ] Go to **Hostinger Dashboard** → **Hosting**
12. [ ] Click **File Manager**
13. [ ] Navigate to `public_html`
14. [ ] **Verify you have backups before proceeding!**
15. [ ] Select all WordPress files and folders
16. [ ] Right-click → **Delete** (or move to a backup folder)

**Alternative:** Leave WordPress files in place. Once DNS points to GitHub, they won't be served anymore.

**Backup saved to:** _______________  
**WordPress shut down on:** _______________

---

## Phase 5: DNS Propagation, Add Custom Domain & Enable HTTPS

### Step 5A: Check DNS Propagation

1. [ ] Wait at least 1 hour after making DNS changes in Phase 3
2. [ ] Visit: https://dnschecker.org/#A/marko.andreis.blog
3. [ ] Look for GitHub Pages IPs (185.199.108.153, 109.153, 110.153, 111.153)
4. [ ] Check multiple locations (at least 5-10 should show GitHub IPs)
5. [ ] When most locations show GitHub IPs, propagation is mostly complete

**DNS Status Checks:**

| Time | Status | Notes |
|------|--------|-------|
| _____ | [ ] Pending | Started DNS changes |
| _____ | [ ] Partial | Some servers updated |
| _____ | [ ] Complete | Most servers updated |

### Step 5B: Add Custom Domain to GitHub Pages

**Only proceed once DNS shows GitHub IPs in Step 5A!**

6. [ ] Go to GitHub: https://github.com/ismandre/marko.andreis.blog/settings/pages
7. [ ] Scroll to **"Custom domain"** section
8. [ ] Enter: `marko.andreis.blog`
9. [ ] Click **Save**
10. [ ] Wait for DNS check to complete (may take 30 seconds)
11. [ ] Verify you see: ✅ "DNS check successful" (green checkmark)
   - If you see an error, wait longer for DNS propagation and try again

**Custom domain added on:** _______________

### Step 5C: Test Your Site

12. [ ] Try visiting: http://marko.andreis.blog
13. [ ] Does the Jekyll site load? (If yes, continue. If no, wait longer or troubleshoot)
14. [ ] Try visiting: http://www.marko.andreis.blog (if you set up www)

**First successful load at custom domain:** _______________

### Step 5D: Enable HTTPS

**Only proceed once custom domain DNS check is successful!**

15. [ ] Still on GitHub Pages settings page
16. [ ] Check the box: **"Enforce HTTPS"**
17. [ ] Wait 5-10 minutes for SSL certificate to provision
18. [ ] Visit: https://marko.andreis.blog (with https://)
19. [ ] Verify green padlock appears in browser
20. [ ] Test that http:// redirects to https:// automatically

**HTTPS enabled on:** _______________

---

## Phase 6: Final Verification

### Test All Functionality:

1. [ ] Visit https://marko.andreis.blog (main site)
2. [ ] Visit https://www.marko.andreis.blog (if configured)
3. [ ] Check that site loads correctly on:
   - [ ] Desktop browser (Chrome/Firefox/Safari)
   - [ ] Mobile browser (iOS/Android)
   - [ ] Private/Incognito mode
4. [ ] Verify the following work:
   - [ ] Homepage loads
   - [ ] Blog posts are accessible
   - [ ] Navigation menu works
   - [ ] Images load correctly
   - [ ] Links work (internal and external)
   - [ ] Dark/light mode toggle (if applicable)
5. [ ] Check HTTPS:
   - [ ] Green padlock visible in address bar
   - [ ] No mixed content warnings
   - [ ] Certificate is valid
6. [ ] Test SEO elements:
   - [ ] Visit https://marko.andreis.blog/sitemap.xml
   - [ ] Visit https://marko.andreis.blog/feed.xml
   - [ ] Check page titles and meta descriptions

### Performance Check (Optional):

7. [ ] Test site speed: https://pagespeed.web.dev/
8. [ ] Enter: https://marko.andreis.blog
9. [ ] Review performance scores

**All tests passed on:** _______________

---

## Phase 7: Optional Cleanup & Cost Savings

### Cancel Hostinger Hosting (Keep Domain!):

**Important:** Only do this AFTER everything works perfectly!

1. [ ] Verify site has been working for at least 1-3 days
2. [ ] Log into Hostinger billing
3. [ ] Go to **Billing** → **Subscriptions**
4. [ ] Find your **hosting plan** (NOT the domain!)
5. [ ] Cancel auto-renewal or downgrade to "domain only" plan
6. [ ] **Keep domain registration active** (required for DNS)

**Current hosting cost:** $ _____ /month  
**Future cost (domain only):** $ _____ /year  
**Annual savings:** $ _____

### Update External Services:

7. [ ] Update Google Search Console (if used):
   - [ ] Add new property for https://marko.andreis.blog
   - [ ] Submit new sitemap: https://marko.andreis.blog/sitemap.xml
8. [ ] Update Google Analytics (if used):
   - [ ] Update website URL in property settings
9. [ ] Update social media profiles (if domain is listed):
   - [ ] LinkedIn: _______________
   - [ ] Twitter/X: _______________
   - [ ] Other: _______________

**Cleanup completed on:** _______________

---

## Future Site Updates

To update your Jekyll site in the future:

1. [ ] Make changes locally in `/Users/andreism/me/no-style-please`
2. [ ] Test locally (optional): `bundle exec jekyll serve`
3. [ ] Commit: `git add . && git commit -m "Your message"`
4. [ ] Push: `git push origin master`
5. [ ] Wait 1-2 minutes for GitHub Pages to rebuild
6. [ ] Visit https://marko.andreis.blog to see changes

---

## Troubleshooting

### "Domain does not resolve to GitHub Pages server" Error:

**Error message:** "Both marko.andreis.blog and its alternate name are improperly configured. Domain does not resolve to the GitHub Pages server."

**Cause:** You're trying to add the custom domain to GitHub Pages before DNS has been configured.

**Solution:**
1. **Leave the custom domain field empty** in GitHub Pages settings for now
2. **Complete Phase 3** (Configure DNS on Hostinger) first
3. **Wait for DNS propagation** (1-4 hours)
4. **Then** add the custom domain in Phase 5B

**Alternative:** You can enter the domain anyway (ignore the error), configure DNS, and the error will resolve itself once DNS propagates.

### Site Not Loading After DNS Change:

- **Check DNS propagation:** Use https://dnschecker.org
- **Clear browser cache:** Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- **Wait longer:** DNS can take up to 48 hours
- **Verify GitHub Pages status:** Check repository Settings → Pages

### HTTPS Not Working:

- **Wait longer:** SSL certificate can take 10-30 minutes to provision
- **Verify DNS:** Make sure all 4 A records point to GitHub Pages IPs
- **Check GitHub Pages:** Should show "DNS check successful"
- **Try again:** Uncheck and re-check "Enforce HTTPS"

### www Not Working:

- **Check CNAME record:** Should point to `ismandre.github.io`
- **Verify DNS:** Use https://dnschecker.org/#CNAME/www.marko.andreis.blog
- **Wait for propagation:** Can take several hours

### Site Shows 404 Error:

- **Check repository visibility:** Must be public (or GitHub Pro for private)
- **Verify branch:** Settings → Pages → Source should be `master` branch
- **Check CNAME file:** Should contain `marko.andreis.blog`
- **Rebuild site:** Make a small change and push to trigger rebuild

---

## Important Links

- **GitHub Repository:** https://github.com/ismandre/marko.andreis.blog
- **GitHub Pages Settings:** https://github.com/ismandre/marko.andreis.blog/settings/pages
- **Hostinger Dashboard:** https://hpanel.hostinger.com/
- **DNS Checker:** https://dnschecker.org/#A/marko.andreis.blog
- **Site URL:** https://marko.andreis.blog

---

## Contact Information

- **Hostinger Support:** Available in hPanel dashboard
- **GitHub Support:** https://support.github.com/
- **Jekyll Documentation:** https://jekyllrb.com/docs/

---

## Notes & Issues

Use this space to track any problems or observations:

```
Date: _______________
Issue: _______________
Resolution: _______________

Date: _______________
Issue: _______________
Resolution: _______________
```

---

**Migration Status:** 
- [ ] In Progress
- [ ] Completed Successfully
- [ ] Completed with Issues (document above)

**Final completion date:** _______________

**Total migration time:** _____ hours/days

---

*This guide was created on 2026-04-14 for migrating marko.andreis.blog from WordPress/Hostinger to Jekyll/GitHub Pages.*
