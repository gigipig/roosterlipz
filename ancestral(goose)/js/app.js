/**
 * App module - initialization and event handlers
 */

/**
 * Toast Notification System
 * Usage: showToast('Message here', 'success') - types: success, error, warning, info
 */
const ToastSystem = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || icons.info}</span>
      <span class="toast-message">${message}</span>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });

    // Auto-dismiss
    setTimeout(() => {
      toast.classList.remove('toast-visible');
      toast.classList.add('toast-hiding');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    return toast;
  }
};

// Convenience function
function showToast(message, type = 'info', duration = 3500) {
  return ToastSystem.show(message, type, duration);
}

/**
 * Show loading overlay with optional custom message
 * @param {string} subtitle - Optional subtitle text
 */
function showLoading(subtitle = 'Analyzing Mendelian inheritance...') {
  const overlay = document.getElementById('loading-overlay');
  const subtitleEl = document.getElementById('loading-subtitle');
  subtitleEl.textContent = subtitle;
  overlay.classList.add('visible');
}

/**
 * Hide loading overlay
 */
function hideLoading() {
  const overlay = document.getElementById('loading-overlay');
  overlay.classList.remove('visible');
}

/**
 * Update loading subtitle text
 * @param {string} text - New subtitle text
 */
function updateLoadingText(text) {
  const subtitleEl = document.getElementById('loading-subtitle');
  subtitleEl.textContent = text;
}

/**
 * Show methodology modal
 */
function showMethodologyModal() {
  const modal = document.getElementById('methodology-modal');
  modal.classList.add('visible');
  document.body.style.overflow = 'hidden'; // Prevent background scroll
}

/**
 * Hide methodology modal
 */
function hideMethodologyModal() {
  const modal = document.getElementById('methodology-modal');
  modal.classList.remove('visible');
  document.body.style.overflow = ''; // Restore scroll
}

/**
 * Show any modal by ID
 */
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * Hide any modal by ID
 */
function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('visible');
    document.body.style.overflow = '';
  }
}

/**
 * Hide all visible modals
 */
function hideAllModals() {
  document.querySelectorAll('.modal-overlay.visible').forEach(modal => {
    modal.classList.remove('visible');
  });
  document.body.style.overflow = '';
}

/**
 * Setup modal close handlers (click overlay, press Escape)
 */
function initModalHandlers() {
  // Close modal when clicking the overlay (outside modal-container)
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('visible');
        document.body.style.overflow = '';
      }
    });
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideAllModals();
    }
  });
}

/**
 * Toggle header dropdown menu
 */
function toggleHeaderDropdown() {
  const btn = document.getElementById('header-menu-btn');
  const dropdown = document.getElementById('header-dropdown');

  btn.classList.toggle('active');
  dropdown.classList.toggle('visible');

  if (dropdown.classList.contains('visible')) {
    // Close dropdown when clicking outside
    setTimeout(() => {
      document.addEventListener('click', closeDropdownOnClickOutside);
    }, 10);
  } else {
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

/**
 * Close dropdown when clicking outside
 */
function closeDropdownOnClickOutside(event) {
  const menu = document.querySelector('.header-menu');
  if (!menu.contains(event.target)) {
    const btn = document.getElementById('header-menu-btn');
    const dropdown = document.getElementById('header-dropdown');
    btn.classList.remove('active');
    dropdown.classList.remove('visible');
    document.removeEventListener('click', closeDropdownOnClickOutside);
  }
}

/**
 * Initialize header menu
 */
function initHeaderMenu() {
  const menuBtn = document.getElementById('header-menu-btn');
  const dropdown = document.getElementById('header-dropdown');

  if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleHeaderDropdown();
    });
  }

  if (dropdown) {
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const modalType = item.dataset.modal;
        // Close dropdown
        document.getElementById('header-menu-btn').classList.remove('active');
        dropdown.classList.remove('visible');
        document.removeEventListener('click', closeDropdownOnClickOutside);

        // Open the appropriate modal
        if (modalType === 'methodology') {
          showMethodologyModal();
        } else {
          showModal(`${modalType}-modal`);
        }
      });
    });
  }
}

// ---------------------------------------------------------------------------
// Settings Modal — Contact Form + Data Management
// ---------------------------------------------------------------------------

/**
 * Formspree endpoint for contact form submissions.
 * Sign up at formspree.io, create a form, and paste your endpoint here.
 * Leave as null to fall back to opening the user's email client.
 *
 * @example 'https://formspree.io/f/abcdefgh'
 */
const FORMSPREE_ENDPOINT = null;

/**
 * Initialize settings modal — contact form + clear data button.
 */
function initSettingsModal() {
  const form = document.getElementById('contact-form');
  const clearBtn = document.getElementById('settings-clear-btn');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name    = document.getElementById('contact-name').value.trim();
      const email   = document.getElementById('contact-email').value.trim();
      const subject = document.getElementById('contact-subject').value;
      const message = document.getElementById('contact-message').value.trim();
      const submitBtn = document.getElementById('contact-submit');

      // Basic validation
      if (!name || !email || !message) {
        showContactStatus('error', 'Please fill in your name, email, and message.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showContactStatus('error', 'Please enter a valid email address.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      if (FORMSPREE_ENDPOINT) {
        try {
          const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, email, subject, message })
          });
          if (res.ok) {
            showContactStatus('success', '✓ Message sent! We\'ll get back to you soon.');
            form.reset();
          } else {
            const data = await res.json();
            showContactStatus('error', data.error || 'Something went wrong — please try again.');
          }
        } catch (_) {
          showContactStatus('error', 'Could not send message. Check your connection and try again.');
        }
      } else {
        // Fallback: open the user's email client
        const subjectLine = subject ? `[${subject}] Feedback` : 'Feedback';
        const body = `Name: ${name}\n\n${message}`;
        window.location.href = `mailto:hello@ancestraldietexplorer.com?subject=${encodeURIComponent(subjectLine)}&body=${encodeURIComponent(body)}`;
        showContactStatus('success', 'Your email client should have opened. If not, email hello@ancestraldietexplorer.com directly.');
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear all saved data? This will reset your profile, ancestry selections, and saved diet.')) return;
      hideModal('settings-modal');
      clearUserData();
      document.querySelectorAll('select').forEach(s => s.value = '');
      document.querySelectorAll('input[type="number"]').forEach(i => i.value = '0');
      updateProfileUI();
      hideResults();
      updatePercentageTotal();
      showToast('Profile cleared.', 'info');
    });
  }
}

/**
 * Show a status message inside the contact form.
 * @param {'success'|'error'} type
 * @param {string} message
 */
function showContactStatus(type, message) {
  const el = document.getElementById('contact-status');
  if (!el) return;
  el.className = `contact-status ${type}`;
  el.textContent = message;
}

// ---------------------------------------------------------------------------

/**
 * Export results as a bespoke multi-page PDF using jsPDF directly.
 * No html2canvas — all content is drawn programmatically.
 */
function exportResultsAsImage() {
  const btn = document.getElementById('export-results-btn');
  const saved = getUserSavedDiet();

  if (!saved || !saved.data || !window.jspdf) {
    showToast('Export not available. Calculate a diet first.', 'error');
    return;
  }

  btn.classList.add('exporting');
  const originalText = btn.querySelector('.export-text').textContent;
  btn.querySelector('.export-text').textContent = 'Saving...';

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const user = getUser();
    const blended = saved.data.blended;
    const genetics = saved.data.mendelianGenetics || null;
    const isMendelian = saved.mode === 'family' && !!genetics;

    // ── Layout constants ──
    const PAGE_W = 210, PAGE_H = 297;
    const MARGIN = 15;
    const CONTENT_W = PAGE_W - MARGIN * 2;
    const ACCENT = [29, 185, 84];       // #1db954
    const BG = [0, 0, 0];
    const WHITE = [255, 255, 255];
    const MUTED = [140, 140, 140];
    const AMBER = [255, 183, 77];
    const RED = [229, 57, 53];
    const YELLOW = [255, 214, 10];

    let curY = 0;
    let pageNum = 0;

    // ── Helpers ──

    function fillPage() {
      doc.setFillColor(...BG);
      doc.rect(0, 0, PAGE_W, PAGE_H, 'F');
    }

    function newPage() {
      doc.addPage();
      pageNum++;
      fillPage();
      curY = MARGIN;
    }

    function checkPageBreak(needed) {
      if (curY + needed > PAGE_H - 18) {
        newPage();
        return true;
      }
      return false;
    }

    function setFont(size, color, style) {
      doc.setFontSize(size);
      doc.setTextColor(...(color || WHITE));
      if (style === 'bold') {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
    }

    function drawRect(x, y, w, h, color) {
      doc.setFillColor(...color);
      doc.rect(x, y, w, h, 'F');
    }

    function stripHtml(str) {
      return (str || '').replace(/<[^>]+>/g, '');
    }

    /** Word-wrap text, return array of lines */
    function wrapText(text, maxWidth, fontSize) {
      doc.setFontSize(fontSize);
      return doc.splitTextToSize(text, maxWidth);
    }

    function drawSectionHeader(title) {
      checkPageBreak(14);
      setFont(13, ACCENT, 'bold');
      doc.text(title, MARGIN, curY);
      curY += 2;
      drawRect(MARGIN, curY, CONTENT_W, 0.5, ACCENT);
      curY += 6;
    }

    /** Draw a colored pill/tag at (x, y). Returns the width consumed. */
    function drawTag(text, x, y, bgColor) {
      setFont(8, null, 'normal');
      const tw = doc.getTextWidth(text) + 5;
      const th = 5.5;
      doc.setFillColor(...bgColor);
      doc.roundedRect(x, y, tw, th, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(text, x + 2.5, y + 3.9);
      return tw + 2;
    }

    /** Draw a horizontal macro bar + percentage labels */
    function drawMacroBar(x, y, w, macros) {
      const h = 7;
      const carbsW = (macros.carbs_pct / 100) * w;
      const protW = (macros.protein_pct / 100) * w;
      const fatW = (macros.fat_pct / 100) * w;

      // Background
      drawRect(x, y, w, h, [30, 30, 30]);
      // Segments
      drawRect(x, y, carbsW, h, ACCENT);
      drawRect(x + carbsW, y, protW, h, RED);
      drawRect(x + carbsW + protW, y, fatW, h, YELLOW);

      // Labels below
      setFont(9, ACCENT, 'bold');
      doc.text(`${macros.carbs_pct}% Carbs`, x, y + h + 5);
      setFont(9, RED, 'bold');
      doc.text(`${macros.protein_pct}% Protein`, x + w * 0.35, y + h + 5);
      setFont(9, YELLOW, 'bold');
      doc.text(`${macros.fat_pct}% Fat`, x + w * 0.7, y + h + 5);
    }

    /** Draw flow-wrapped tags. Returns new curY after all tags. */
    function drawTagsFlow(items, startY, bgColor) {
      if (!items || items.length === 0) return startY;
      let tx = MARGIN;
      let ty = startY;
      const tagH = 5.5;
      const rowGap = 2;

      items.forEach(item => {
        setFont(8, null, 'normal');
        const tw = doc.getTextWidth(item) + 5 + 2; // pill + gap
        if (tx + tw > MARGIN + CONTENT_W) {
          tx = MARGIN;
          ty += tagH + rowGap;
          if (ty + tagH > PAGE_H - 18) {
            newPage();
            ty = curY;
          }
        }
        drawTag(item, tx, ty, bgColor);
        tx += tw;
      });
      return ty + tagH + 4;
    }

    /** Draw a compact trait row for the genetics page */
    function drawTraitRow(title, statusLabel, statusClass, value) {
      checkPageBreak(10);
      const rowY = curY;

      // Title
      setFont(9, WHITE, 'normal');
      doc.text(title, MARGIN, rowY + 4);

      // Status pill
      const pillColors = {
        high: ACCENT,
        moderate: AMBER,
        low: [120, 120, 120]
      };
      const pillColor = pillColors[statusClass] || MUTED;
      const pillX = MARGIN + 85;
      setFont(7.5, null, 'normal');
      const pw = doc.getTextWidth(statusLabel) + 5;
      doc.setFillColor(...pillColor);
      doc.roundedRect(pillX, rowY, pw, 5.5, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(statusLabel, pillX + 2.5, rowY + 3.9);

      // Progress bar
      const barX = MARGIN + 120;
      const barW = CONTENT_W - 120;
      const barH = 3;
      const barY = rowY + 1.5;
      drawRect(barX, barY, barW, barH, [40, 40, 40]);
      const fillW = Math.max(0, (value / 100) * barW);
      drawRect(barX, barY, fillW, barH, pillColor);

      curY = rowY + 8;
    }

    // ── Legacy key map (duplicated from genetics.js) ──
    const legacyKeyMap = {
      lactase: 'lactase_persistence',
      amy1: 'starch_digestion',
      fads: 'pufa_metabolism',
      slc24a5: 'vitamin_d_metabolism',
      aldh2: 'alcohol_metabolism',
      crebrf: 'polynesian_energy_storage',
      cpt1a: 'arctic_fat_metabolism',
      edar: 'edar_adaptation',
      altitude: 'altitude_adaptation_epas1'
    };

    // ── Page Builders ──

    function buildCoverPage() {
      fillPage();
      pageNum = 1;

      // Top accent strip
      drawRect(0, 0, PAGE_W, 4, ACCENT);

      // Title
      curY = 30;
      setFont(24, ACCENT, 'bold');
      doc.text('ANCESTRAL DIET EXPLORER', PAGE_W / 2, curY, { align: 'center' });
      curY += 9;
      setFont(12, MUTED, 'normal');
      doc.text('Personalized Diet Report', PAGE_W / 2, curY, { align: 'center' });

      // User card
      curY += 14;
      drawRect(MARGIN, curY, CONTENT_W, 56, [18, 18, 18]);
      const cardX = MARGIN + 8;
      let cardY = curY + 9;

      setFont(14, WHITE, 'bold');
      doc.text(user.username || 'User', cardX, cardY);
      cardY += 7;

      // Mode badge
      const modeText = isMendelian ? 'MENDELIAN MODE' : 'DNA / BLENDED MODE';
      setFont(7.5, null, 'normal');
      const badgeW = doc.getTextWidth(modeText) + 6;
      doc.setFillColor(...ACCENT);
      doc.roundedRect(cardX, cardY - 3.5, badgeW, 5.5, 1.5, 1.5, 'F');
      doc.setTextColor(255, 255, 255);
      doc.text(modeText, cardX + 3, cardY);
      cardY += 9;

      // Ancestry list
      if (blended && blended.geos) {
        setFont(9, MUTED, 'normal');
        doc.text('Ancestry:', cardX, cardY);
        setFont(9, WHITE, 'normal');
        blended.geos.forEach((g, idx) => {
          const pct = Math.round(blended.weights[idx] * 100);
          cardY += 5;
          doc.text(`${g.name}  ${pct}%`, cardX + 2, cardY);
        });
        cardY += 6;
      }

      // Generated date
      setFont(8, MUTED, 'normal');
      const dateStr = saved.calculatedAt
        ? new Date(saved.calculatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      doc.text('Generated: ' + dateStr, cardX, cardY);

      curY += 60;

      // Macro preview
      if (blended && blended.blendedMacros) {
        curY += 8;
        drawSectionHeader('Macronutrient Profile');
        drawMacroBar(MARGIN, curY, CONTENT_W, blended.blendedMacros);
        curY += 22;
      }

      // Disclaimer
      curY = PAGE_H - 28;
      setFont(7, MUTED, 'normal');
      const disc = wrapText(
        'Disclaimer: This report is for educational and informational purposes only. It does not constitute medical or dietary advice. Genetic predictions are statistical estimates based on population-level data and Mendelian inheritance models. Consult a healthcare professional before making significant dietary changes.',
        CONTENT_W, 7
      );
      disc.forEach(line => {
        doc.text(line, MARGIN, curY);
        curY += 3.5;
      });
    }

    function buildTakeawaysPage() {
      if (!isMendelian) return;
      newPage();

      const { strengths, watchItems } = analyzeGeneticTraits(genetics);

      setFont(16, WHITE, 'bold');
      doc.text('Key Takeaways', MARGIN, curY);
      curY += 10;

      const colW = (CONTENT_W - 6) / 2;

      // Strengths column
      const leftX = MARGIN;
      let leftY = curY;
      setFont(11, ACCENT, 'bold');
      doc.text('Genetic Strengths', leftX, leftY);
      leftY += 7;

      strengths.forEach(s => {
        setFont(9, ACCENT, 'bold');
        // Green dot
        doc.setFillColor(...ACCENT);
        doc.circle(leftX + 1.5, leftY - 1, 1.2, 'F');
        doc.text(stripHtml(s.title), leftX + 5, leftY);
        leftY += 4.5;
        setFont(7.5, MUTED, 'normal');
        const lines = wrapText(stripHtml(s.detail), colW - 5, 7.5);
        lines.forEach(l => {
          doc.text(l, leftX + 5, leftY);
          leftY += 3.5;
        });
        leftY += 3;
      });

      // Watch items column
      const rightX = MARGIN + colW + 6;
      let rightY = curY;
      setFont(11, AMBER, 'bold');
      doc.text('Things to Watch', rightX, rightY);
      rightY += 7;

      watchItems.forEach(w => {
        setFont(9, AMBER, 'bold');
        doc.setFillColor(...AMBER);
        doc.circle(rightX + 1.5, rightY - 1, 1.2, 'F');
        doc.text(stripHtml(w.title), rightX + 5, rightY);
        rightY += 4.5;
        setFont(7.5, MUTED, 'normal');
        const lines = wrapText(stripHtml(w.detail), colW - 5, 7.5);
        lines.forEach(l => {
          doc.text(l, rightX + 5, rightY);
          rightY += 3.5;
        });
        rightY += 3;
      });

      curY = Math.max(leftY, rightY) + 4;
    }

    function buildGeneticsPages() {
      if (!isMendelian) return;
      newPage();

      setFont(16, WHITE, 'bold');
      doc.text('Genetic Profile', MARGIN, curY);
      curY += 10;

      Object.keys(genetics).forEach(key => {
        const trait = genetics[key];
        let meta = trait._meta;
        if (!meta) {
          const metaKey = legacyKeyMap[key] || key;
          meta = (typeof GENE_META !== 'undefined') ? GENE_META[metaKey] : null;
        }
        if (!meta) {
          meta = { title: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) };
        }

        const { value, statusLabel, statusClass } = getTraitMeterInfo(key, trait);
        drawTraitRow(meta.title, statusLabel, statusClass, value);
      });
    }

    function buildFoodsPage() {
      if (!blended) return;
      newPage();

      setFont(16, WHITE, 'bold');
      doc.text('Recommended Foods', MARGIN, curY);
      curY += 10;

      const sections = [
        { title: 'Common Foods', items: blended.commonFoods, color: ACCENT },
        { title: 'Proteins', items: blended.allProteins, color: RED },
        { title: 'Healthy Fats', items: blended.allFats, color: YELLOW },
        { title: 'Herbs & Spices', items: blended.allHerbs, color: [156, 110, 255] },
        { title: 'Cooking Methods', items: blended.allCooking, color: [100, 160, 200] }
      ];

      sections.forEach(sec => {
        if (!sec.items || sec.items.length === 0) return;
        checkPageBreak(16);
        drawSectionHeader(sec.title);
        curY = drawTagsFlow(sec.items, curY, sec.color);
        curY += 2;
      });
    }

    function buildAncestryPages() {
      if (!blended || !blended.geos) return;

      blended.geos.forEach((geo, idx) => {
        const diet = blended.diets[idx];
        if (!diet) return;

        // Always start a new page (or check break for large sets)
        newPage();

        const pct = Math.round(blended.weights[idx] * 100);

        // Card background
        const cardTop = curY;
        drawRect(MARGIN, cardTop, CONTENT_W, 12, [18, 18, 18]);
        setFont(13, WHITE, 'bold');
        doc.text(geo.name, MARGIN + 4, cardTop + 8);

        // Weight badge
        const badgeText = `${pct}%`;
        setFont(9, null, 'normal');
        const bw = doc.getTextWidth(badgeText) + 5;
        doc.setFillColor(...ACCENT);
        doc.roundedRect(MARGIN + CONTENT_W - bw - 4, cardTop + 3, bw, 6, 1.5, 1.5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.text(badgeText, MARGIN + CONTENT_W - bw - 1.5, cardTop + 7.5);

        curY = cardTop + 16;

        // Culture
        if (geo.culture) {
          setFont(8, MUTED, 'normal');
          doc.text(geo.culture, MARGIN, curY);
          curY += 5;
        }

        // Diet signature
        if (diet.diet_signature) {
          setFont(9, WHITE, 'normal');
          const sigLines = wrapText(stripHtml(diet.diet_signature), CONTENT_W, 9);
          sigLines.forEach(l => {
            checkPageBreak(5);
            doc.text(l, MARGIN, curY);
            curY += 4.5;
          });
          curY += 3;
        }

        // Staple foods as tags
        const staples = [...(diet.staples || []), ...(diet.common_foods || [])];
        if (staples.length > 0) {
          checkPageBreak(12);
          setFont(10, ACCENT, 'bold');
          doc.text('Staple Foods', MARGIN, curY);
          curY += 5;
          curY = drawTagsFlow(staples.slice(0, 20), curY, ACCENT);
          curY += 2;
        }

        // Individual macro bar
        if (diet.macros) {
          checkPageBreak(22);
          setFont(10, ACCENT, 'bold');
          doc.text('Macronutrient Profile', MARGIN, curY);
          curY += 5;
          drawMacroBar(MARGIN, curY, CONTENT_W * 0.75, diet.macros);
          curY += 22;
        }
      });
    }

    function addFooters() {
      const total = doc.getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        setFont(7, MUTED, 'normal');
        doc.text(`Ancestral Diet Explorer  |  Page ${i} of ${total}`, PAGE_W / 2, PAGE_H - 8, { align: 'center' });
      }
    }

    // ── Build the PDF ──
    buildCoverPage();
    buildTakeawaysPage();
    buildGeneticsPages();
    buildFoodsPage();
    buildAncestryPages();
    addFooters();

    doc.save(`ancestral-diet-${new Date().toISOString().slice(0, 10)}.pdf`);

    btn.classList.remove('exporting');
    btn.querySelector('.export-text').textContent = originalText;
    showToast('PDF saved to downloads!', 'success');
  } catch (error) {
    console.error('Export failed:', error);
    showToast('Failed to export PDF. Please try again.', 'error');
    btn.classList.remove('exporting');
    btn.querySelector('.export-text').textContent = originalText;
  }
}

/**
 * Initialize the application
 */
async function init() {
  // Load all data
  await loadData();

  // Populate dropdowns
  populateDropdowns();

  // Setup event handlers
  setupEventHandlers();

  // Setup header menu dropdown
  initHeaderMenu();

  // Setup settings modal (contact form + clear data)
  initSettingsModal();

  // Setup modal close handlers
  initModalHandlers();

  // Setup user profile handlers
  setupProfileEventHandlers();

  // Ensure user has a username (for existing users)
  ensureUsername();

  // Display username and update profile UI
  displayUsername();
  updateProfileUI();

  // Initialize onboarding (will skip if user has saved data)
  initOnboarding();

  // Restore user selections from cache
  if (userHasSavedData()) {
    restoreUserSelections();
  }
}

/**
 * Setup all event handlers
 */
function setupEventHandlers() {
  // Sidebar toggle (mobile)
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('visible');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('visible');
  });

  // Sidebar collapse (desktop)
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
  sidebarCollapseBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    // Update button icon
    sidebarCollapseBtn.innerHTML = sidebar.classList.contains('collapsed') ? '&#9654;' : '&#9664;';
  });

  // Collapsible sections
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.parentElement;
      section.classList.toggle('open');
    });
  });

  // Mode switching
  document.getElementById('family-mode-btn').addEventListener('click', () => {
    document.getElementById('family-mode-btn').classList.add('active');
    document.getElementById('dna-mode-btn').classList.remove('active');
    document.getElementById('family-tree-panel').classList.add('active');
    document.getElementById('dna-test-panel').classList.remove('active');
    setUserAncestryMode('family');
  });

  document.getElementById('dna-mode-btn').addEventListener('click', () => {
    document.getElementById('dna-mode-btn').classList.add('active');
    document.getElementById('family-mode-btn').classList.remove('active');
    document.getElementById('dna-test-panel').classList.add('active');
    document.getElementById('family-tree-panel').classList.remove('active');
    setUserAncestryMode('dna');
  });

  // Family Tree Mode - Calculate button
  document.getElementById('family-calculate-btn').addEventListener('click', handleFamilyCalculate);

  // Family Tree Mode - Clear button
  document.getElementById('family-clear-btn').addEventListener('click', () => {
    ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'].forEach(id => {
      document.getElementById(id).value = '';
    });
    hideResults();
    saveUserFamilyTree({ mgm: null, mgf: null, pgm: null, pgf: null });
    clearUserDiet();
  });

  // DNA Test Mode - percentage input handlers
  [1, 2, 3, 4].forEach(i => {
    document.getElementById(`ancestry${i}-percent`).addEventListener('input', updatePercentageTotal);
  });

  // DNA Test Mode - Calculate button
  document.getElementById('dna-calculate-btn').addEventListener('click', handleDNACalculate);

  // DNA Test Mode - Clear button
  document.getElementById('dna-clear-btn').addEventListener('click', () => {
    hideResults();

    [1, 2, 3, 4].forEach(i => {
      document.getElementById(`ancestry${i}-region`).value = '';
      document.getElementById(`ancestry${i}-percent`).value = 0;
    });

    updatePercentageTotal();
    saveUserDNATest([
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 },
      { regionId: null, percent: 0 }
    ]);
    clearUserDiet();
  });

  // Export results button
  document.getElementById('export-results-btn').addEventListener('click', exportResultsAsImage);

  // Results tab switching (event delegation)
  document.getElementById('diet-content').addEventListener('click', (e) => {
    // Top-level results tabs (Overview / Genetics / Diet / Foods)
    const topBtn = e.target.closest('.results-tabs button[data-tab]');
    if (topBtn) {
      const container = document.getElementById('diet-content');
      const tabName = topBtn.dataset.tab;
      container.querySelectorAll('.results-tabs button').forEach(b => b.classList.remove('active'));
      topBtn.classList.add('active');
      container.querySelectorAll('.results-tab-panel').forEach(p => p.classList.remove('active'));
      const panel = container.querySelector(`.results-tab-panel[data-tab-panel="${tabName}"]`);
      if (panel) panel.classList.add('active');
      return;
    }

    // Foods sub-filter tabs (All / Proteins / Fats / Herbs)
    const filterBtn = e.target.closest('.foods-filter-tabs button[data-filter]');
    if (filterBtn) {
      const tabsContainer = filterBtn.closest('.foods-filter-tabs');
      const browseSection = filterBtn.closest('.browse-foods-section');
      if (!tabsContainer || !browseSection) return;

      const filter = filterBtn.dataset.filter;
      tabsContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      filterBtn.classList.add('active');
      browseSection.querySelectorAll('.food-filter-group').forEach(g => {
        g.classList.toggle('food-filter-group--active', g.dataset.filterGroup === filter);
      });
    }
  });

  // Methodology modal buttons
  document.getElementById('methodology-btn').addEventListener('click', showMethodologyModal);
  document.getElementById('methodology-footer-btn').addEventListener('click', showMethodologyModal);
  document.getElementById('methodology-close').addEventListener('click', hideMethodologyModal);

  // Close modal on overlay click
  document.getElementById('methodology-modal').addEventListener('click', (e) => {
    if (e.target.id === 'methodology-modal') {
      hideMethodologyModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideMethodologyModal();
    }
  });
}

/**
 * Show results in the content area
 */
function showResults() {
  document.getElementById('results-placeholder').style.display = 'none';
  document.getElementById('results-content').style.display = 'block';
}

/**
 * Hide results and show placeholder
 */
function hideResults() {
  document.getElementById('results-placeholder').style.display = 'flex';
  document.getElementById('results-content').style.display = 'none';
}

/**
 * Handle Family Tree calculate button click
 */
function handleFamilyCalculate() {
  const grandparentIds = ['mgm-region', 'mgf-region', 'pgm-region', 'pgf-region'];
  // These are nationality IDs (e.g., 'polish') from the dropdowns
  const selectedNationalityIds = grandparentIds.map(id => document.getElementById(id).value);

  const numSelected = selectedNationalityIds.filter(id => id !== '').length;

  if (numSelected === 0) {
    showToast('Please select at least one grandparent ancestry', 'warning');
    return;
  }

  // For partial selection, confirm first before showing loading
  if (numSelected !== 4) {
    const confirm = window.confirm(
      `You've selected ${numSelected} out of 4 grandparents.\n\n` +
      `For the most accurate genetic predictions, we recommend selecting all 4 grandparents.\n\n` +
      `Continue with ${numSelected} grandparent${numSelected > 1 ? 's' : ''}?`
    );
    if (!confirm) return;
  }

  // Show loading overlay
  showLoading(numSelected === 4 ? 'Calculating Mendelian inheritance...' : 'Blending dietary traditions...');

  // Use setTimeout to allow the loading overlay to render
  setTimeout(() => {
    // Convert nationality IDs to region IDs for diet lookup
    const grandparentDiets = selectedNationalityIds.map(id => {
      if (!id) return null;
      const regionId = getRegionIdFromNationality(id);
      return regionId ? getDietById(regionId) : null;
    });

    // Get region IDs for diet blending
    const regionIds = selectedNationalityIds
      .filter(id => id !== '')
      .map(id => getRegionIdFromNationality(id))
      .filter(id => id !== null);

    // Save user's family tree selections (using nationality IDs for proper restoration)
    saveUserFamilyTree({
      mgm: selectedNationalityIds[0] || null,
      mgf: selectedNationalityIds[1] || null,
      pgm: selectedNationalityIds[2] || null,
      pgf: selectedNationalityIds[3] || null
    });

    // Update loading text
    updateLoadingText('Analyzing genetic traits...');

    setTimeout(() => {
      if (numSelected === 4) {
        // Use Mendelian genetics
        const mendelianGenetics = calculateMendelianGenetics(grandparentDiets);

        updateLoadingText('Building personalized recommendations...');

        setTimeout(() => {
          const weights = [0.25, 0.25, 0.25, 0.25];
          const blended = blendDiets(regionIds, weights);

          // Show results area and hide loading
          showResults();
          showBlendedDietWithMendelian(blended, mendelianGenetics);
          hideLoading();

          // Save calculated diet and update profile
          saveUserDiet({ type: 'mendelian', blended, mendelianGenetics });
          updateProfileUI();
        }, 200);
      } else {
        // Fallback: weighted averaging
        const weight = 1.0 / numSelected;
        const weights = new Array(numSelected).fill(weight);
        const blended = blendDiets(regionIds, weights);

        // Show results area and hide loading
        showResults();
        showBlendedDiet(blended);
        hideLoading();

        // Save calculated diet and update profile
        saveUserDiet({ type: 'blended', blended });
        updateProfileUI();
      }
    }, 300);
  }, 100);
}

/**
 * Handle DNA Test calculate button click
 */
function handleDNACalculate() {
  const regionIds = [];
  const weights = [];
  const dnaSelections = [];

  [1, 2, 3, 4].forEach(i => {
    // These are nationality IDs (e.g., 'polish') from the dropdowns
    const nationalityId = document.getElementById(`ancestry${i}-region`).value;
    const percent = parseFloat(document.getElementById(`ancestry${i}-percent`).value) || 0;

    // Save nationality ID for proper restoration
    dnaSelections.push({ regionId: nationalityId || null, percent });

    if (nationalityId && percent > 0) {
      // Convert to region ID for diet calculations
      const regionId = getRegionIdFromNationality(nationalityId);
      if (regionId) {
        regionIds.push(regionId);
        weights.push(percent / 100);
      }
    }
  });

  if (regionIds.length === 0) {
    showToast('Please select at least one ancestry and enter percentages', 'warning');
    return;
  }

  const total = weights.reduce((sum, w) => sum + w, 0);
  if (Math.abs(total - 1.0) > 0.01) {
    showToast('Percentages must total 100%', 'warning');
    return;
  }

  // Show loading overlay
  showLoading('Blending dietary traditions...');

  // Use setTimeout to allow the loading overlay to render
  setTimeout(() => {
    // Save user's DNA test selections (using nationality IDs for proper restoration)
    saveUserDNATest(dnaSelections);

    updateLoadingText('Building personalized recommendations...');

    setTimeout(() => {
      const blended = blendDiets(regionIds, weights);

      // Show results area and hide loading
      showResults();
      showBlendedDiet(blended);
      hideLoading();

      // Save calculated diet and update profile
      saveUserDiet({ type: 'dna', blended });
      updateProfileUI();
    }, 300);
  }, 100);
}

// Initialize on load
init();
