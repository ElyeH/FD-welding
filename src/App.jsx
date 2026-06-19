import './App.css'

function App() {
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
          <form className="form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="5" required></textarea>
            <button type="submit" className="btn">Send Message</button>
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
