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
