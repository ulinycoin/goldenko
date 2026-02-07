import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

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
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sūta...
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
        formStatus.textContent = 'Paldies! Jūsu ziņa ir nosūtīta. Mēs sazināsimies ar Jums drīzumā.'
        
        // GSAP success animation
        gsap.from(formStatus, { y: 20, opacity: 0, duration: 0.5, ease: 'back.out' })
        
        contactForm.reset()
      } else {
        // API Error
        throw new Error(result.message || 'Kļūda nosūtot ziņu.')
      }
    } catch (error) {
      // Network or other error
      formStatus.classList.remove('hidden', 'bg-green-100', 'text-green-700')
      formStatus.classList.add('bg-red-100', 'text-red-700')
      formStatus.textContent = 'Atvainojiet, radās kļūda. Lūdzu, mēģiniet vēlreiz vēlāk.'
      gsap.from(formStatus, { x: 10, repeat: 3, yoyo: true, duration: 0.1 })
    } finally {
      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false
        submitBtn.textContent = 'Nosūtīt Pieteikumu'
      }
    }
  })
}
