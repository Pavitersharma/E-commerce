import React from "react";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      {/* ─── Features Banner ─── */}
      <section className="border-t border-border bg-card py-12">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-6 max-w-7xl">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-secondary p-3 text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Free shipping</h4>
              <p className="text-xs text-muted-foreground mt-1">On orders over ₹1,499</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-secondary p-3 text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Easy returns</h4>
              <p className="text-xs text-muted-foreground mt-1">15-day free returns</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-full bg-secondary p-3 text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-foreground">Secure checkout</h4>
              <p className="text-xs text-muted-foreground mt-1">Razorpay protected</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Dark Newsletter Section ─── */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/75">Join the club</span>
              <h3 className="font-display text-2xl font-bold tracking-tight mt-2 sm:text-3xl">Style notes, drops & early access.</h3>
              <p className="text-sm text-primary-foreground/70 mt-2 max-w-md">Subscribe to get 10% off your first order and be first to know about new collections.</p>
            </div>
            <div className="w-full max-w-md lg:ml-auto">
              <form className="flex h-12 w-full items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 p-1 focus-within:border-primary-foreground/45">
                <input
                  aria-label="Email"
                  className="h-full flex-1 rounded-full bg-transparent px-4 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/50"
                  placeholder="your@email.com"
                  type="email"
                />
                <button type="submit" className="inline-flex h-full items-center gap-2 rounded-full bg-primary-foreground px-6 text-sm font-semibold text-primary transition hover:opacity-90">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main Footer ─── */}
      <footer className="bg-background border-t border-border py-16 md:py-24 text-muted-foreground text-sm">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Link to="/" className="font-display text-xl font-extrabold tracking-tight text-foreground md:text-2xl">
              Brand<span className="text-foreground">Shut</span>
            </Link>
            <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">
              Premium menswear designed for everyday elegance. Style, comfort, and quality in every piece.
            </p>
            <div className="flex gap-2.5 mt-2">
              <a aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:border-foreground hover:bg-secondary" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a aria-label="Twitter" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:border-foreground hover:bg-secondary" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:border-foreground hover:bg-secondary" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a aria-label="YouTube" className="grid h-10 w-10 place-items-center rounded-full border border-border text-foreground transition hover:border-foreground hover:bg-secondary" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-3">
            <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider">Shop</h5>
            <ul className="space-y-2 text-xs">
              <li><Link className="transition hover:text-foreground" to="/listing?category=shirt">Shirts</Link></li>
              <li><Link className="transition hover:text-foreground" to="/listing?category=jeans,trousers">Jeans & Trousers</Link></li>
              <li><Link className="transition hover:text-foreground" to="/listing?category=shoes">Shoes</Link></li>
              <li><Link className="transition hover:text-foreground" to="/listing?category=accessories">Watches</Link></li>
              <li><Link className="transition hover:text-foreground" to="/listing?category=accessories">Accessories</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider">Company</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="transition hover:text-foreground" href="#">About</a></li>
              <li><a className="transition hover:text-foreground" href="#">Journal</a></li>
              <li><a className="transition hover:text-foreground" href="#">Stores</a></li>
              <li><a className="transition hover:text-foreground" href="#">Careers</a></li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col gap-3">
            <h5 className="font-semibold text-foreground text-xs uppercase tracking-wider">Help</h5>
            <ul className="space-y-2 text-xs">
              <li><a className="transition hover:text-foreground" href="#">Contact</a></li>
              <li><a className="transition hover:text-foreground" href="#">Shipping</a></li>
              <li><a className="transition hover:text-foreground" href="#">Returns</a></li>
              <li><a className="transition hover:text-foreground" href="#">Privacy</a></li>
              <li><a className="transition hover:text-foreground" href="#">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="container mx-auto px-4 md:px-6 max-w-7xl mt-16 pt-8 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 BrandShut. All rights reserved.</p>
          <p className="text-muted-foreground/80">Crafted with care in India · Free shipping over ₹1,499</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
