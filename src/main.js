import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { translations } from './i18n.js'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

// --- i18n Logic ---
let currentLang = localStorage.getItem('goldenko_lang') || 'lv'

function updateContent(lang) {
  // Update text content
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key]
    }
  })

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder')
    if (translations[lang] && translations[lang][key]) {
      el.placeholder = translations[lang][key]
    }
  })

  // Update active state of language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('text-primary', 'font-bold')
      btn.classList.remove('text-slate-400')
    } else {
      btn.classList.remove('text-primary', 'font-bold')
      btn.classList.add('text-slate-400')
    }
  })

  // Update form hidden fields if any (e.g. subject)
  const subjectInput = document.querySelector('input[name="subject"]')
  if (subjectInput && translations[lang] && translations[lang].form_subject) {
    subjectInput.value = translations[lang].form_subject
  }

  // Update html lang attribute
  document.documentElement.lang = lang
}

// Language switch event listeners
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    const lang = btn.getAttribute('data-lang')
    if (lang && lang !== currentLang) {
      currentLang = lang
      localStorage.setItem('goldenko_lang', lang)
      updateContent(lang)
    }
  })
})

// Initial load
updateContent(currentLang)

// --- UI Logic ---
// Navbar scroll logic
const navbar = document.getElementById('navbar')
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('shadow-md', 'bg-white/95', 'backdrop-blur-sm')
  } else {
    navbar.classList.remove('shadow-md', 'bg-white/95', 'backdrop-blur-sm')
  }
})

if (!prefersReducedMotion) {
  // Hero Animations
  const tl = gsap.timeline()
  tl.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.2
  })

  // General Section Animations
  const sections = document.querySelectorAll('section')
  sections.forEach(section => {
    // Animate content inside container
    const container = section.querySelector('.container')
    if (container) {
      gsap.from(container.children, {
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power2.out'
      })
    }
  })
}

// Form Submission Logic
const contactForm = document.getElementById('contact-form')
const formStatus = document.getElementById('form-status')
const submitBtn = contactForm?.querySelector('button[type="submit"]')

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    // UI state: Loading
    if (submitBtn) {
      submitBtn.disabled = true
      const originalText = translations[currentLang].form_submit
      const loadingText = translations[currentLang].form_sending
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${loadingText}
      `
    }

    const formData = new FormData(contactForm)
    const object = Object.fromEntries(formData)
    const json = JSON.stringify(object)

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })

      const result = await response.json()

      if (response.status === 200) {
        // Success
        formStatus.classList.remove('hidden', 'bg-red-100', 'text-red-700')
        formStatus.classList.add('bg-green-100', 'text-green-700')
        formStatus.textContent = translations[currentLang].form_success

        // GSAP success animation
        gsap.from(formStatus, { y: 20, opacity: 0, duration: 0.5, ease: 'back.out' })

        contactForm.reset()
      } else {
        // API Error
        throw new Error(result.message || translations[currentLang].form_error)
      }
    } catch (error) {
      // Network or other error
      formStatus.classList.remove('hidden', 'bg-green-100', 'text-green-700')
      formStatus.classList.add('bg-red-100', 'text-red-700')
      formStatus.textContent = translations[currentLang].form_error
      gsap.from(formStatus, { x: 10, repeat: 3, yoyo: true, duration: 0.1 })
    } finally {
      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = translations[currentLang].form_submit
      }
    }
  })
}
