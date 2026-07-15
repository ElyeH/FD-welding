import { useState } from 'react'
import './App.css'

const EMPTY_FORM = { name: '', email: '', message: '' }

function App() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
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
          <div className="logo">FD Welding</div>
          <ul className="nav-links">
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="hero">
          <h1>Professional Welding Services</h1>
          <p>Quality craftsmanship you can count on.</p>
          <a href="#contact" className="btn">Get a Quote</a>
        </section>

        <section id="services" className="section">
          <h2>Our Services</h2>
          <div className="grid">
            <div className="card">
              <h3>MIG Welding</h3>
              <p>Fast and efficient welding for structural and fabrication work.</p>
            </div>
            <div className="card">
              <h3>TIG Welding</h3>
              <p>Precision welding for thin metals and detailed work.</p>
            </div>
            <div className="card">
              <h3>Custom Fabrication</h3>
              <p>Bespoke metal fabrication built to your specs.</p>
            </div>
          </div>
        </section>

        <section id="about" className="section section--alt">
          <h2>About Us</h2>
          <p>With years of experience in the industry, FD Welding delivers reliable, high-quality metalwork for residential, commercial, and industrial clients.</p>
        </section>

        <section id="contact" className="section">
          <h2>Contact Us</h2>
          <form className="form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={form.message}
              onChange={handleChange}
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
        </section>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} FD Welding. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
