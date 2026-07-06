// Shared vanilla-JS client for reading content from Sanity CMS.
// No build step, no framework — plain fetch() + DOM APIs, loaded as an ES module.

const SANITY_PROJECT_ID = '3quwa2do';
const SANITY_DATASET = 'lafayette-ic';
const SANITY_API_VERSION = '2026-02-01';

// Uses the live (non-CDN) API so edits show up the moment they're published,
// rather than waiting out the CDN's cache window. This site's traffic is low
// enough that the extra load on the live API is a non-issue.
const QUERY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

/** Runs a GROQ query against the public dataset and returns `result`. */
export async function sanityFetch(query) {
  const url = `${QUERY_URL}?query=${encodeURIComponent(query)}`;
  // no-store: always hit the network, never a cached response from a
  // previous page load — otherwise a reload right after publishing in
  // Studio can still show the old content.
  const res = await fetch(url, {cache: 'no-store'});
  if (!res.ok) {
    throw new Error(`Sanity query failed (${res.status}): ${query}`);
  }
  const json = await res.json();
  return json.result;
}

// ---------- DOM population helpers ----------

/** Sets textContent on the first match of `selector`, if both exist. */
export function setText(selector, value, root = document) {
  if (value == null || value === '') return;
  const el = root.querySelector(selector);
  if (el) el.textContent = value;
}

/** Sets innerHTML (e.g. rendered Portable Text) on the first match. */
export function setHtml(selector, html, root = document) {
  if (!html) return;
  const el = root.querySelector(selector);
  if (el) el.innerHTML = html;
}

/** Points an <img> at a resolved Sanity image ({url, alt}). */
export function setImage(selector, image, root = document) {
  const el = root.querySelector(selector);
  if (!el || !image || !image.url) return;
  el.src = image.url;
  if (image.alt) el.alt = image.alt;
}

/** Points an <a> or <video>/<source> href/src at a resolved URL. */
export function setAttr(selector, attr, value, root = document) {
  if (!value) return;
  const el = root.querySelector(selector);
  if (el) el.setAttribute(attr, value);
}

// ---------- Portable Text -> HTML ----------

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderSpans(children, markDefs) {
  return (children || [])
    .map((span) => {
      let text = escapeHtml(span.text || '');
      (span.marks || []).forEach((mark) => {
        if (mark === 'strong') {
          text = `<strong>${text}</strong>`;
        } else if (mark === 'em') {
          text = `<em>${text}</em>`;
        } else {
          const def = (markDefs || []).find((d) => d._key === mark);
          if (def && def._type === 'link' && def.href) {
            const external = /^https?:/.test(def.href);
            text = `<a href="${escapeHtml(def.href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${text}</a>`;
          }
        }
      });
      return text;
    })
    .join('');
}

/** Renders a Sanity Portable Text array (paragraphs + bullet lists) to HTML. */
export function renderPortableText(blocks) {
  if (!Array.isArray(blocks)) return '';
  let html = '';
  let inList = false;
  blocks.forEach((block) => {
    if (block._type !== 'block') return;
    const inner = renderSpans(block.children, block.markDefs);
    if (block.listItem === 'bullet') {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${inner}</li>`;
    } else {
      if (inList) {
        html += '</ul>';
        inList = false;
      }
      html += `<p>${inner}</p>`;
    }
  });
  if (inList) html += '</ul>';
  return html;
}

// ---------- Site Settings (shared across every page) ----------

export const siteSettingsProjection = `{
  siteName,
  establishedLabel,
  "logo": logo.asset->{url},
  instagramUrl,
  linkedinUrl,
  groupMeUrl,
  weeklyMeetingLocation,
  weeklyMeetingTime,
  weeklyMeetingFoodNote,
  executiveBoardMeetingNote,
  coPresidents,
  pitchProcessSteps,
  footerDisclaimer,
  copyrightYear
}`;

/** Applies the bits of Site Settings that appear identically on every page:
 * brand name/logo, social links, and the footer. */
export function applySiteSettings(settings) {
  if (!settings) return;

  document.querySelectorAll('.brand-name, .footer-name').forEach((el) => {
    if (settings.siteName) el.textContent = settings.siteName;
  });
  document.querySelectorAll('.brand-sub').forEach((el) => {
    if (settings.establishedLabel) el.textContent = settings.establishedLabel;
  });
  document.querySelectorAll('.footer-sub').forEach((el) => {
    if (settings.establishedLabel) el.textContent = `${settings.establishedLabel} · Lafayette College`;
  });
  document.querySelectorAll('img.brand-mark, img.footer-mark').forEach((el) => {
    if (settings.logo && settings.logo.url) el.src = settings.logo.url;
  });
  document.querySelectorAll('a[aria-label*="Instagram" i]').forEach((el) => {
    if (settings.instagramUrl) el.href = settings.instagramUrl;
  });
  document.querySelectorAll('a[aria-label*="LinkedIn" i]').forEach((el) => {
    if (settings.linkedinUrl) el.href = settings.linkedinUrl;
  });
  document.querySelectorAll('.footer-disclaimer p').forEach((el) => {
    if (settings.footerDisclaimer) el.textContent = settings.footerDisclaimer;
  });
  document.querySelectorAll('.footer-copyright').forEach((el) => {
    if (settings.copyrightYear) {
      el.textContent = `© ${settings.copyrightYear} ${settings.siteName || 'Lafayette Investment Club'}.`;
    }
  });
}

/** Formats a Sanity date string ("2024-05-13") as "May 13, 2024". */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ---------- Stat counter animation ----------
// Mirrors the count-up behavior in script.js, but is called directly by
// each page script once stats are in the DOM — script.js's own observer
// runs synchronously on page load, before this module's async fetch
// resolves, so newly-populated [data-count] elements need their own pass.

export function animateStatCounters(container) {
  const els = container ? container.querySelectorAll('[data-count]') : [];
  if (!els.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    els.forEach((el) => {
      el.textContent = formatCount(el, parseFloat(el.dataset.value || '0'));
    });
    return;
  }

  els.forEach((el) => {
    el.textContent = formatCount(el, 0);
  });

  const animate = (el) => {
    const target = parseFloat(el.dataset.value);
    const duration = 1200;
    let start = null;
    const step = (timestamp) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(el, target * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = formatCount(el, target);
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {threshold: 0.5});

  els.forEach((el) => observer.observe(el));
}

function formatCount(el, n) {
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  return prefix + n.toFixed(decimals) + suffix;
}
