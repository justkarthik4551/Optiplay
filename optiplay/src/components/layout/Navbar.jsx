import iitrLogo from '../../assets/iitr_logo.png';
import iitrSeal from '../../assets/iitr_seal.png';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar glass" id="main-navbar">
      <div className="navbar-inner">
        <a href="/" className="navbar-brand">
          <span className="navbar-logo">◉</span>
          <span className="navbar-title">OptiPlay</span>
        </a>
        <div className="navbar-right">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="navbar-link">
            About
          </a>
          <div className="navbar-divider" />
          <img src={iitrLogo} alt="IIT Roorkee" className="navbar-iitr-logo navbar-iitr-logo--desktop" />
          <img src={iitrSeal} alt="IIT Roorkee" className="navbar-iitr-logo navbar-iitr-logo--mobile" />
        </div>
      </div>
    </nav>
  );
}
