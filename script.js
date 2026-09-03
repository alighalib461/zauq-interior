/**
 * Ba Zauq Interiors - Interactive Experience Engine
 * Features: Scroll reveal animations, animated counters, interactive quote calculator,
 * service filter & lightbox, inquiry form handler, dynamic popping WhatsApp CTA.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initStatsCounter();
  initServicesFilter();
  initModalsAndLightboxes();
  initQuoteCalculator();
  initInquiryForm();
  initWhatsAppFloatingCTA();
  initSmoothScroll();
});

/* ==========================================================================
   1. Scroll Progress Bar
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scrollProgressBar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/* ==========================================================================
   2. Sticky Header Transition
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   3. Mobile Navigation Menu
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    toggleBtn.classList.toggle('active');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggleBtn.classList.remove('active');
    });
  });
}

/* ==========================================================================
   4. Smooth Intersection Observer (Fade-In & Slide-Up Animations)
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // keep active class so it stays visible
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   5. Animated Stats Number Counters
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let animated = false;

  const statsSection = document.getElementById('statsSection');
  if (!statsSection || statNumbers.length === 0) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target') || '0', 10);
          if (target > 0) {
            animateCount(stat, 0, target, 1800);
          }
        });
      }
    });
  }, { threshold: 0.2 });

  statsObserver.observe(statsSection);
}

function animateCount(element, start, end, duration) {
  let startTime = null;
  const isThousands = end > 999;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const current = Math.floor(easeOutQuad * (end - start) + start);
    
    if (isThousands) {
      element.textContent = current.toLocaleString();
    } else {
      element.textContent = current;
    }

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = isThousands ? end.toLocaleString() : end;
    }
  }

  window.requestAnimationFrame(step);
}

/* ==========================================================================
   6. Services Category Filter
   ========================================================================== */
function initServicesFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!filterBtns.length || !serviceCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Modals & Lightbox Engine (Quote Modal, Service Details, Gallery Preview)
   ========================================================================== */
const serviceData = {
  'wallpapers': {
    title: 'Wall Papers & Murals',
    desc: 'Premium imported 3D, textured, and vinyl wallpapers with bespoke modern and classic patterns for feature walls.',
    features: ['Imported European & Asian Collections', 'Seamless installation', 'Moisture and fade resistant', 'Over 500+ patterns in catalog']
  },
  'pvc-panels': {
    title: 'PVC Wall Panels',
    desc: 'Waterproof, termite-proof fluted and acoustic PVC louvers offering contemporary vertical accents for TV lounges and bedrooms.',
    features: ['100% Waterproof & Termite Proof', 'Scratch Resistant UV Coating', 'Fast Clean Installation', 'Multiple Woodgrain Textures']
  },
  'wpc-panels': {
    title: 'WPC Wall Panels & Louvers',
    desc: 'Heavy-duty wood plastic composite fluted panels suitable for luxury interior backdrops, exterior elevations, and partitions.',
    features: ['High durability & Weatherproof', 'Realistic Natural Wood Look', 'Fire Retardant Grade', 'Eco-friendly composite']
  },
  'window-blinds': {
    title: 'Window Blinds & Motorized Shades',
    desc: 'Custom motorized and manual Zebra, Roller, Vertical, and Wooden Venetian blinds designed for sun control and privacy.',
    features: ['Motorized Smart Remote Controls', 'Blackout & Translucent Fabrics', 'Custom Sizing & Fitting', 'UV Protection Coating']
  },
  'roof-ceilings': {
    title: 'Roof Ceilings & Gypsum Works',
    desc: 'Contemporary false gypsum ceilings with integrated warm LED strip coving, spot lights, and magnetic track lighting.',
    features: ['Gypsum & POP false ceiling designs', 'Concealed LED strip coves', 'Acoustic sound dampening', 'Custom 3D geometric ceiling designs']
  },
  'wooden-floors': {
    title: 'Wooden & Parquet Floors',
    desc: 'High-grade German & Turkish laminate, semi-solid, and hardwood herringbone parquet flooring for warm luxury aesthetics.',
    features: ['AC4 & AC5 commercial grade wear layer', 'Herringbone & straight plank styles', 'Underlay sound insulation', '15+ Years warranty']
  },
  'vinyl-flooring': {
    title: 'Vinyl & SPC Flooring',
    desc: 'Stone Polymer Composite (SPC) and luxury vinyl plank flooring that is 100% waterproof, silent, and easy to maintain.',
    features: ['100% Waterproof Rigid Core', 'Anti-slip textured surface', 'Click-lock seamless installation', 'Ideal for kitchens & high-traffic zones']
  },
  'decking-floors': {
    title: 'Decking Floors / WPC Exterior Decking',
    desc: 'Weatherproof outdoor composite decking boards for terraces, balconies, swimming pools, and garden patios.',
    features: ['Heavy-duty UV resistance', 'Splinter-free & anti-skid', 'Zero maintenance vs natural wood', 'Available in Teak, Charcoal & Walnut']
  },
  'carpet-tiles': {
    title: 'Carpet Tiles & Wall-to-Wall Carpets',
    desc: 'Modular acoustic carpet tiles and plush broadloom carpets for executive corporate offices, call centers, and cinema halls.',
    features: ['Stain resistant nylon fibers', 'Bitumen/PVC acoustic backing', 'Modular replacement ease', 'High foot-traffic durability']
  },
  'artificial-grass': {
    title: 'Artificial Grass Turf',
    desc: 'High-density 25mm to 50mm lush green synthetic turf for rooftop gardens, balconies, patios, and indoor sports corners.',
    features: ['4-Tone natural green blades', 'UV stabilized & colorfast', 'Perforated drainage backing', 'Zero mowing or watering needed']
  },
  '3d-wall-patterns': {
    title: '3D Wall Patterns & Acoustic Panels',
    desc: 'Architectural geometric 3D wall tiles and felt acoustic boards that transform ordinary blank walls into tactile sculptures.',
    features: ['Acoustic sound absorption', 'Custom paintable surface', 'Modern geometric aesthetics', 'Lightweight & durable']
  },
  'canvas-pictures': {
    title: 'Canvas Wall Pictures & Art Frames',
    desc: 'Curated large-format Islamic calligraphy, abstract gold foil, and contemporary framed wall art matching your interior palette.',
    features: ['High definition gallery wrap canvas', 'Brushed gold & black floating frames', 'Custom sizing tailored to wall dimensions', 'Archival pigment inks']
  },
  'pvc-french-mouldings': {
    title: 'PVC French Mouldings & Wainscoting',
    desc: 'High-density polystyrene and PVC wall mouldings for classic neoclassical frames, chair rails, and French wainscoting.',
    features: ['Pre-primed ready to paint', 'Precision 45-degree mitering', 'Resistant to dampness and pests', 'Timeless royal aesthetic']
  },
  'ss-bars': {
    title: 'Stainless Steel PVD Profiles & Bars',
    desc: 'Gold, Rose Gold, and Black PVD titanium coated stainless steel T-bars, U-channels, and luxury partition privacy screens.',
    features: ['Grade 304 Titanium PVD coating', 'Anti-fingerprint finish', 'Seamless marble/wood joints', 'Never tarnishes or rusts']
  },
  'moss-hedges': {
    title: 'Moss Matt & Artificial Green Hedges',
    desc: 'Preserved natural reindeer moss walls and UV-treated faux botanical vertical gardens for biophilic interior luxury.',
    features: ['Zero maintenance preserved moss', 'Realistic dense foliage', 'Sound dampening biophilic design', 'Indoor and covered outdoor use']
  },
  'antique-stone': {
    title: 'Antique Stone & Brick Cladding Work',
    desc: 'Natural slate, travertine, stacked ledge stone, and antique brick veneers for rustic fireplaces and luxury feature facades.',
    features: ['Authentic natural stone textures', 'Reinforced mechanical fixing', 'Interior & exterior durability', 'Sealed against moisture and stains']
  },
  'paint-polish': {
    title: 'Paint, Polish & High Gloss Finishes',
    desc: 'Ultra-luxurious velvet matt wall paints, decorative stucco/marble effects, and PU/polyurethane mirror wood polishes.',
    features: ['Velvet touch washable emulsions', 'High gloss PU Italian wood finishes', 'Stucco & metallic texture paint', 'Dustless surface preparation']
  },
  'wooden-steel': {
    title: 'Wooden & Steel Custom Fabrication',
    desc: 'Bespoke entertainment media consoles, walk-in closets, kitchen cabinets, and minimalist architectural steel glass dividers.',
    features: ['Commercial grade MDF/Plywood & Solid Ash', 'Soft-close Austrian hardware', 'Powder-coated slimline steel frames', 'Custom 3D CAD fabrication']
  },
  'electrical-plumbing': {
    title: 'Electrical, Smart Lighting & Plumbing',
    desc: 'Complete architectural lighting planning, magnetic track lights, smart automation, and premium sanitary plumbing solutions.',
    features: ['Smart home lighting control', 'Magnetic track spot & linear lights', 'Concealed plumbing and luxury fittings', 'Certified safety standards']
  }
};

function initModalsAndLightboxes() {
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalContent = document.getElementById('modalContent');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (!modalBackdrop || !modalContent) return;

  function closeModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // Attach Service Card Clicks
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-service-key');
      const imgSrc = card.querySelector('img')?.getAttribute('src') || '';
      const data = serviceData[key] || {
        title: card.querySelector('.service-card-title')?.textContent || 'Interior Service',
        desc: 'Professional high quality interior design and finishing solution tailored to your space.',
        features: ['Premium Quality Materials', 'Expert Workmanship', 'Fast Execution', '100% Satisfaction Guarantee']
      };

      modalContent.innerHTML = `
        <div style="text-align: left;">
          <div style="border-radius: 12px; overflow: hidden; height: 220px; margin-bottom: 20px;">
            <img src="${imgSrc}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <span style="color: var(--primary); font-weight: 700; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Ba Zauq Interior Services</span>
          <h3 style="font-size: 1.6rem; color: var(--primary-dark); font-weight: 800; margin: 4px 0 12px;">${data.title}</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; margin-bottom: 18px;">${data.desc}</p>
          
          <h4 style="font-size: 1rem; font-weight: 700; color: var(--primary); margin-bottom: 10px;">Key Features & Specifications:</h4>
          <ul style="list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px;">
            ${data.features.map(f => `<li style="display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: #334155;"><span style="color: var(--primary); font-weight: bold;">✓</span> ${f}</li>`).join('')}
          </ul>

          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="https://wa.me/923315508454?text=Hello%20Ba%20Zauq%20Interiors,%20I%20am%20interested%20in%20${encodeURIComponent(data.title)}" target="_blank" class="btn-primary" style="flex: 1; justify-content: center; padding: 12px 20px;">
              Inquire via WhatsApp 💬
            </a>
            <button onclick="document.getElementById('modalBackdrop').classList.remove('active'); document.getElementById('contactSection').scrollIntoView({behavior:'smooth'});" class="btn-outline" style="flex: 1; justify-content: center; padding: 12px 20px;">
              Send Inquiry Form
            </button>
          </div>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Attach Work Gallery Lightbox
  document.querySelectorAll('.work-item').forEach(item => {
    item.addEventListener('click', () => {
      const imgSrc = item.querySelector('img')?.getAttribute('src') || '';
      const title = item.querySelector('.work-item-title')?.textContent || 'Project Showcase';
      const category = item.querySelector('.work-item-category')?.textContent || 'Interior Design';

      modalContent.innerHTML = `
        <div style="text-align: center;">
          <div style="border-radius: 12px; overflow: hidden; max-height: 480px; margin-bottom: 18px; box-shadow: var(--shadow-lg);">
            <img src="${imgSrc}" alt="${title}" style="width: 100%; height: auto; display: block;" />
          </div>
          <span style="color: var(--primary); font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">${category}</span>
          <h3 style="font-size: 1.5rem; color: var(--primary-dark); font-weight: 800; margin: 4px 0 16px;">${title}</h3>
          <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 20px;">Crafted with excellence and precision by Ba Zauq Interiors, Rawalpindi.</p>
          <a href="https://wa.me/923315508454?text=Hello%20Ba%20Zauq%20Interiors,%20I%20saw%20your%20project%20'${encodeURIComponent(title)}'%20and%20want%20a%20similar%20design." target="_blank" class="btn-primary" style="margin: 0 auto;">
            Get a Quote for this Style 🚀
          </a>
        </div>
      `;

      modalBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
}

/* ==========================================================================
   8. Interactive Quote Calculator
   ========================================================================== */
function initQuoteCalculator() {
  const quoteTriggerBtns = document.querySelectorAll('.btn-quote-modal-trigger');
  const quoteModal = document.getElementById('quoteModal');
  const quoteCloseBtn = document.getElementById('quoteModalClose');

  if (!quoteModal) return;

  function openQuoteModal() {
    quoteModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    calculateEstimate();
  }

  function closeQuoteModal() {
    quoteModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  quoteTriggerBtns.forEach(btn => btn.addEventListener('click', openQuoteModal));
  if (quoteCloseBtn) quoteCloseBtn.addEventListener('click', closeQuoteModal);
  quoteModal.addEventListener('click', (e) => {
    if (e.target === quoteModal) closeQuoteModal();
  });

  // Calculation Logic
  const spaceTypeSelect = document.getElementById('calcSpaceType');
  const areaSlider = document.getElementById('calcAreaSlider');
  const areaDisplay = document.getElementById('calcAreaDisplay');
  const serviceCheckboxes = document.querySelectorAll('.calc-service-check');
  const resultDisplay = document.getElementById('calcResultValue');
  const calcWhatsAppBtn = document.getElementById('calcWhatsAppBtn');

  if (!spaceTypeSelect || !areaSlider || !areaDisplay || !resultDisplay) return;

  areaSlider.addEventListener('input', () => {
    areaDisplay.textContent = areaSlider.value + ' sq. ft.';
    calculateEstimate();
  });

  spaceTypeSelect.addEventListener('change', calculateEstimate);
  serviceCheckboxes.forEach(cb => cb.addEventListener('change', calculateEstimate));

  function calculateEstimate() {
    const spaceMultiplier = parseFloat(spaceTypeSelect.value) || 1;
    const area = parseInt(areaSlider.value, 10) || 350;

    let baseRatePerSqFt = 450; // PKR base average
    let selectedServicesList = [];

    serviceCheckboxes.forEach(cb => {
      if (cb.checked) {
        baseRatePerSqFt += parseInt(cb.value, 10);
        selectedServicesList.push(cb.getAttribute('data-name'));
      }
    });

    const minEstimate = Math.round(area * baseRatePerSqFt * spaceMultiplier);
    const maxEstimate = Math.round(minEstimate * 1.25);

    resultDisplay.innerHTML = `<strong>PKR ${minEstimate.toLocaleString()} - ${maxEstimate.toLocaleString()}</strong> <span style="font-size: 0.85rem; font-weight: normal; color: #64748b;">(Approximate Range)</span>`;

    if (calcWhatsAppBtn) {
      const spaceText = spaceTypeSelect.options[spaceTypeSelect.selectedIndex].text;
      const message = `Hello Ba Zauq Interiors! I calculated an estimate for my ${spaceText} (${area} sq.ft) with services: ${selectedServicesList.join(', ')}. Estimated budget: PKR ${minEstimate.toLocaleString()} - ${maxEstimate.toLocaleString()}. I would like to book a site consultation.`;
      calcWhatsAppBtn.href = `https://wa.me/923315508454?text=${encodeURIComponent(message)}`;
    }
  }
}

/* ==========================================================================
   9. Interactive Inquiry Form Submission Handler & Toast Notification
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="full_name"]')?.value || 'Valued Client';
    const phone = form.querySelector('[name="phone"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || 'Not provided';
    const service = form.querySelector('[name="service"]')?.value || 'Complete Interior Design';
    const type = form.querySelector('[name="project_type"]')?.value || 'Residential';
    const location = form.querySelector('[name="location"]')?.value || 'Rawalpindi / Islamabad';
    const message = form.querySelector('[name="message"]')?.value || '';

    if (!phone) {
      showToast('⚠️ Please provide your phone number so we can reach you.');
      return;
    }

    // Submit state feedback
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending Inquiry... ⏳';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = 'Inquiry Sent! ✓';
      showToast(`✨ Thank you, ${name}! Your consultation request has been received. Malik Naveed Shareef or our team will contact you shortly.`);

      // Prompt to open in WhatsApp for immediate response
      const waMessage = `*New Website Inquiry*\nName: ${name}\nPhone: ${phone}\nEmail: ${email}\nService: ${service}\nScope: ${type}\nLocation: ${location}\nDetails: ${message}`;
      const waUrl = `https://wa.me/923315508454?text=${encodeURIComponent(waMessage)}`;

      setTimeout(() => {
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Open WhatsApp in new tab for direct conversation
        window.open(waUrl, '_blank');
      }, 1200);
    }, 800);
  });
}

function showToast(msg) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

/* ==========================================================================
   10. ATTRACTIVE POPPING WHATSAPP FLOATING CTA
   ========================================================================== */
function initWhatsAppFloatingCTA() {
  const chatBubble = document.getElementById('whatsappChatBubble');
  const closeBubbleBtn = document.getElementById('closeBubbleBtn');
  const mainWhatsAppBtn = document.getElementById('whatsappFloatingBtn');

  if (!mainWhatsAppBtn) return;

  // Auto show greeting bubble after 3.2 seconds
  setTimeout(() => {
    if (chatBubble) {
      chatBubble.classList.add('active');
    }
  }, 3200);

  if (closeBubbleBtn && chatBubble) {
    closeBubbleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatBubble.classList.remove('active');
    });
  }

  mainWhatsAppBtn.addEventListener('click', () => {
    window.open('https://wa.me/923315508454?text=Hello%20Ba%20Zauq%20Interiors!%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20consult%20about%20interior%20design%20services.', '_blank');
  });
}

/* ==========================================================================
   11. Smooth Navigation Scroll Spy & Back To Top
   ========================================================================== */
function initSmoothScroll() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active navigation highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
