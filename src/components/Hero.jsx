import { getActiveOutlet } from "../utils/getActiveOutlets";
import '../styles/Hero.css'
const Hero = () => {
  const activeOutlet = getActiveOutlet();
  
  const outletBackgrounds = {
    'pharmacy': '/hero.png',
    'lounge': '/Lounge.png',      
    'restaurant': '/Restaurant.png',
  };

  const scrollToProducts = () => {
    const productsSection = document.querySelector('.product-showcases-container');
    if (productsSection) {
      productsSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const backgroundImage = outletBackgrounds[activeOutlet];
  const heroStyle = {
    backgroundImage: `url('${backgroundImage}')`,
    justifyContent:  `${activeOutlet === 'lounge' ? 'flex-start' : 'flex-end'}`
  };

  return (
    <section className="hero-section" style={heroStyle}>
      <div className="hero-overlay">
        <div className={`hero-content ${activeOutlet === 'lounge' ? 'hero-content-left' : ''}`}>
          <h1 className="hero-title">Welcome to Our Store</h1>
          <p className="hero-subtitle">
            Discover top-quality products delivered to your door.
          </p>
          <button className="hero-button" onClick={scrollToProducts}>
            See Products
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero