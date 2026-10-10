const Footer = () => {
  return (
    <footer className="w-full border-t border-subtle bg-canvas">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-xl font-semibold text-content">
            Gadget Heaven
          </h2>
          <p className="text-sm text-faint">
            Leading the way in cutting-edge technology and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <nav className="flex flex-col gap-2">
            <h6 className="mb-1 text-sm font-semibold text-content">
              Services
            </h6>
            <a className="text-sm text-faint hover:text-content">
              Product Support
            </a>
            <a className="text-sm text-faint hover:text-content">
              Order Tracking
            </a>
            <a className="text-sm text-faint hover:text-content">
              Shipping and delivery
            </a>
            <a className="text-sm text-faint hover:text-content">
              Returns
            </a>
          </nav>
          <nav className="flex flex-col gap-2">
            <h6 className="mb-1 text-sm font-semibold text-content">
              Company
            </h6>
            <a className="text-sm text-faint hover:text-content">
              About us
            </a>
            <a className="text-sm text-faint hover:text-content">
              Careers
            </a>
            <a className="text-sm text-faint hover:text-content">
              Contact
            </a>
          </nav>
          <nav className="flex flex-col gap-2">
            <h6 className="mb-1 text-sm font-semibold text-content">
              Legal
            </h6>
            <a className="text-sm text-faint hover:text-content">
              Terms of Service
            </a>
            <a className="text-sm text-faint hover:text-content">
              Privacy policy
            </a>
            <a className="text-sm text-faint hover:text-content">
              Cookie policy
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
