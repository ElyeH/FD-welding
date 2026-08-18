import { useState } from 'react'
import './App.css'
import kitchenHood from './assets/gallery/kitchen-hood-fabrication.jpg'
import handrailFrame from './assets/gallery/handrail-frame-install.jpg'
import stairwellWelding from './assets/gallery/stairwell-rail-welding.jpg'
import demoWall from './assets/gallery/demo-concrete-wall.jpg'
import glassStairRailing from './assets/gallery/glass-stair-railing-finished.jpg'

const GALLERY = [
  {
    src: glassStairRailing,
    alt: 'Finished glass and stainless steel staircase railing in an office lobby',
    caption: 'Glass & stainless stair railing — commercial lobby',
  },
  {
    src: stairwellWelding,
    alt: 'Welder fabricating a stainless steel handrail on a staircase',
    caption: 'On-site handrail welding',
  },
  {
    src: handrailFrame,
    alt: 'Stainless steel handrail frame staged for installation',
    caption: 'Custom handrail frame — fit-up',
  },
  {
    src: kitchenHood,
    alt: 'Fabricating a stainless steel commercial kitchen hood surround',
    caption: 'Stainless kitchen hood fabrication',
  },
  {
    src: demoWall,
    alt: 'Demolition of a concrete block wall ahead of a fabrication project',
    caption: 'Site demo & prep work',
  },
]

const EMPTY_FORM = { name: '', email: '', message: '', company: '' }

function App() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [navOpen, setNavOpen] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Honeypot: real users never fill this hidden field, bots often do.
    if (form.company) {
      setStatus('success')
      setForm(EMPTY_FORM)
      return
    }

    setStatus('sending')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }

      setStatus('success')
      setForm(EMPTY_FORM)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <div className="logo">A To Z Weld &amp; Build</div>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={navOpen}
            aria-controls="primary-nav"
            aria-label={navOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setNavOpen((open) => !open)}
          >
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
            <span className="nav-toggle-bar" />
          </button>
          <ul id="primary-nav" className={`nav-links${navOpen ? ' nav-links--open' : ''}`}>
            <li><a href="#services" onClick={() => setNavOpen(false)}>Services</a></li>
            <li><a href="#about" onClick={() => setNavOpen(false)}>About</a></li>
            <li><a href="#work" onClick={() => setNavOpen(false)}>Our Work</a></li>
            <li><a href="#contact" onClick={() => setNavOpen(false)}>Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>A To Z Weld &amp; Build</h1>
          <p>25+ years of quality craftsmanship — residential &amp; commercial.</p>
          <a href="#contact" className="btn">Get a Quote</a>
        </section>

        <section id="services" className="section">
          <h2>Our Services</h2>
          <div className="grid">
            <div className="card">
              <h3>Custom Welding</h3>
              <p>Skilled welding tailored to your exact specifications — structural, decorative, and everything in between.</p>
            </div>
            <div className="card">
              <h3>Glass Railing</h3>
              <p>Sleek, modern glass railing systems for stairs, balconies, and decks — designed for safety and style.</p>
            </div>
            <div className="card">
              <h3>Metal Fabrication</h3>
              <p>Stainless steel, aluminum, and custom metal fabrication built to last for residential and commercial clients.</p>
            </div>
            <div className="card">
              <h3>Custom Gates &amp; Railings</h3>
              <p>Handcrafted gates and railings built to your design, plus expert repair service on existing installations.</p>
            </div>
            <div className="card">
              <h3>Home Renovation &amp; Repairs</h3>
              <p>Full-service home renovation metalwork and structural repairs — done right the first time.</p>
            </div>
            <div className="card">
              <h3>Maintenance</h3>
              <p>Ongoing maintenance programs to keep your metalwork, railings, and gates in peak condition year-round.</p>
            </div>
          </div>
        </section>

        <section id="about" className="section section--alt">
          <h2>About Us</h2>
          <div className="about-body">
            <p>A To Z Weld &amp; Build has been delivering exceptional metalwork and fabrication for over <strong>25 years</strong>. What started as a passion for the craft has grown into a trusted name across the residential and commercial construction industry. Our team brings decades of hands-on experience to every project — no job is too big or too small.</p>
            <p>Over the years we've had the privilege of working with a wide range of clients and industries. From franchise food service — including projects with <strong>Five Guys</strong> — to <strong>senior living homes</strong>, <strong>schools</strong>, <strong>daycares</strong>, and large-scale <strong>commercial apartment buildings</strong>, we understand that each environment comes with its own standards, timelines, and expectations. We take pride in meeting all of them.</p>
            <p>Whether it's a set of custom glass railings for a luxury condo, a security gate for a commercial property, or routine maintenance for an institutional facility, A To Z Weld &amp; Build brings the same commitment to quality and craftsmanship to every job site. Our reputation is built on reliability, attention to detail, and work that stands the test of time.</p>
          </div>
        </section>

        <section id="work" className="section">
          <h2>Our Work</h2>
          <div className="gallery">
            {GALLERY.map((item) => (
              <figure className="gallery-item" key={item.src}>
                <img src={item.src} alt={item.alt} loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section id="contact" className="section">
          <h2>Contact Us</h2>
          <div className="contact-layout">
            <div className="contact-info">
              <div className="contact-item">
                <span className="contact-label">Phone</span>
                <a href="tel:+14168438036">Fahd: (416) 843-8036</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email</span>
                <a href="mailto:atozweldbuild@gmail.com">atozweldbuild@gmail.com</a>
              </div>
              <div className="contact-item">
                <span className="contact-label">Address</span>
                <address>
                  1565 Britannia Rd E, Unit 43<br />
                  Mississauga, ON L4W 2V6
                </address>
              </div>
            </div>

            <form className="form" onSubmit={handleSubmit} noValidate>
              <div className="form-honeypot" aria-hidden="true">
                <label htmlFor="company">Company</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={handleChange}
                />
              </div>

              <label className="visually-hidden" htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                maxLength={100}
                autoComplete="name"
                required
              />
              <label className="visually-hidden" htmlFor="email">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                maxLength={200}
                autoComplete="email"
                required
              />
              <label className="visually-hidden" htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                maxLength={5000}
                required
              ></textarea>
              <button type="submit" className="btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <p className="form-status form-status--success">
                  Thanks! Your message has been sent — we'll be in touch soon.
                </p>
              )}
              {status === 'error' && (
                <p className="form-status form-status--error">{errorMessage}</p>
              )}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} A To Z Weld &amp; Build. All rights reserved.</p>
        <p className="footer-contact">
          <a href="tel:+14168438036">(416) 843-8036</a> &nbsp;·&nbsp;
          <a href="mailto:atozweldbuild@gmail.com">atozweldbuild@gmail.com</a> &nbsp;·&nbsp;
          1565 Britannia Rd E, Unit 43, Mississauga, ON L4W 2V6
        </p>
      </footer>
    </div>
  )
}

export default App
