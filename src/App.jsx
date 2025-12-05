
import React, { useState, useEffect } from 'react';
// 🟢 NEW: Import the OrderPage component (File name set to newform.jsx)
import OrderPage from './src/newform';

// --- CONFIGURATION CONSTANTS ---
/**
 * ⚠️ IMPORTANT: REPLACE '91XXXXXXXXXX' with the seller's actual WhatsApp number.
 * Use country code + number, NO '+' or dashes. Example: '919876543210'
 */
const WHATSAPP_NUMBER = "919645637618";

// Generic WhatsApp messages for the Header/Footer Contact button
const GENERIC_MESSAGE_ML = "നിങ്ങളുടെ പ്രോഡക്ട്‌ സംബന്ധിച്ച് കൂടുതൽ വിവരങ്ങൾ ലഭിക്കാമോ?";
const GENERIC_MESSAGE_EN = "I'd like more details about your products.";

// 🎥 List of Video Sources for Slideshow (3 Videos)
const VIDEO_SOURCES = [
  "/vedio/a1.mp4", 
  "/vedio/f1.mp4", 
  "/vedio/m1.mp4", 
];

// Product Data Array - 🖼️ Gallery images added here!
const PRODUCTS = [
  {
    id: 1,
    name: "Motion Sensor LED Lights",
    price: "₹1399",
    image: "/images/motion1.jpg", 
    // 🟢 Gallery images (Add your actual image paths here)
    gallery: [
      "/images/motion-led-lights-02.jpg", 
      "/images/motion-led-lights-03.jpg", 
      "/images/motion-led-lights-04.jpg", 
    ],
    alt: "Automatic Motion Sensor LED Lights for cabinets and hallways",
    tagline_ml: "ചലനം തിരിച്ചറിഞ്ഞ് ഓട്ടോമാറ്റിക് പ്രകാശം",
    tagline_en: "Automatic light on motion detection",
  },
  {
    id: 2,
    name: "Automatic Water Dispenser",
    price: "₹849",
    image: "/images/auto1.jpg", 
    // 🟢 Gallery images (Add your actual image paths here)
    gallery: [
      "/images/dispenser-02.jpg", 
      "/images/dispenser-03.jpg", 
      "/images/dispenser-04.jpg", 
    ],
    alt: "Rechargeable automatic water dispensing pump for 20L bottles",
    tagline_ml: "ഒറ്റ ടച്ചിൽ വെള്ളം, എളുപ്പത്തിൽ ഉപയോഗിക്കാം",
    tagline_en: "Water at a single touch, easy to use",
  },
  {
    id: 3,
    name: "Mini Portable Mop/Cleaner",
    price: "₹1099",
    image: "/images/mini1.jpg", 
    // 🟢 Gallery images (Add your actual image paths here)
    gallery: [
      "/images/mop-02.jpg", 
      "/images/mop-03.jpg", 
      "/images/mop-04.jpg", 
    ],
    alt: "Compact and portable self-wringing mini mop for quick cleaning",
    tagline_ml: "കുറഞ്ഞ സ്ഥലത്ത് കൂടുതൽ ക്ലീനിംഗ്",
    tagline_en: "Maximum cleaning in minimal space",
  },
];
// -------------------------------

function buildWhatsAppLink(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * 🛒 Product Card Component - UPDATED with object-contain for full image view
 */
const ProductCard = ({ product, langToggle, onOrder }) => {
  const { name, price, image, alt, tagline_ml, tagline_en } = product;

  return (
    // 🎨 UPDATED CLASS: More attractive card style
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden transform transition duration-500 hover:scale-[1.03] hover:shadow-indigo-300/50 flex flex-col">
      {/* 🖼️ Image display with object-contain for full view */}
      <div className="w-full h-64 bg-gray-100 flex items-center justify-center p-2">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-contain object-center" // 🟢 Key change: object-contain
        />
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-indigo-600 font-medium italic mb-3 transition-colors duration-200">
          {langToggle === 'ml' ? tagline_ml : tagline_en}
        </p>
        <p className="text-3xl font-extrabold text-indigo-700 mt-auto mb-5">{price}</p> 
        
        {/* 🟢 CTA Button: Calls onOrder function to switch page */}
        <button
          onClick={() => onOrder(product)} 
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-full text-center transition-colors duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-70 shadow-lg"
        >
          🛒 {langToggle === 'ml' ? "ഓർഡർ ചെയ്യുക" : "Place Order"}
        </button>
      </div>
    </div>
  );
};


/**
 * 🎬 Hero Video Section Component
 */
const HeroSection = ({ langToggle }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const currentVideoSrc = VIDEO_SOURCES[currentVideoIndex];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex(prevIndex => (prevIndex + 1) % VIDEO_SOURCES.length);
    }, 5000); 

    return () => clearInterval(interval);
  }, []); 

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 min-h-[450px] flex items-center justify-center">
      
      {/* Video Block */}
      <video
        key={currentVideoSrc} 
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity duration-1000"
        poster="/images/promo-poster.jpg"
        title={`Product Promotion Video ${currentVideoIndex + 1}`}
      >
        <source src={currentVideoSrc} type="video/mp4" />
        
        {/* Graceful Fallback Content */}
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center p-4 text-center">
          <p className="text-white text-xl font-bold">
            {langToggle === 'ml' ? "വീഡിയോ ലഭ്യമല്ല. പുതിയ ഓഫറുകൾക്കായി ചുവടെ കാണുക." : "Video not available. Scroll down for our latest offers."}
          </p>
          <img
            src="/images/promo-poster.jpg" 
            alt="Product Promotion"
            className="w-full h-full object-cover"
          />
        </div>
      </video>

      {/* Hero Text Overlay */}
      <div className="relative z-10 text-center p-6 bg-black bg-opacity-40 rounded-xl max-w-3xl mx-auto shadow-2xl">
        <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 animate-fadeInUp">
          {langToggle === 'ml' ? "മികച്ച ഉൽപ്പന്നങ്ങൾ, നിങ്ങളുടെ വീട്ടുവാതിൽക്കൽ!" : "Great Products, Delivered to Your Doorstep!"}
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 font-light">
          {langToggle === 'ml' ? "വേഗത, വിശ്വാസ്യത, - കുറഞ്ഞ വില!" : "Speed, Reliability, low Price!"}
        </p>
      </div>
    </section>
  );
};


/**
 * 👆 Primary Header Component
 */
const Header = ({ langToggle, onToggle }) => {
  const genericWALink = buildWhatsAppLink(WHATSAPP_NUMBER, `${GENERIC_MESSAGE_ML} / ${GENERIC_MESSAGE_EN}`);
  
  return (
    <header className="bg-white shadow-lg sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Brand Name */}
        <div className="text-2xl font-extrabold text-indigo-600">
          <a href="/" className="focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 rounded-md">
            Smart World ! {/* ⬅️ Website Name (Can be customized) */}
          </a>
        </div>
        
        {/* Right-side actions */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <button
            onClick={onToggle}
            className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label={`Switch language to ${langToggle === 'ml' ? 'English' : 'Malayalam'}`}
          >
            {langToggle === 'ml' ? 'English' : 'മലയാളം'}
          </button>
          
          {/* WhatsApp Contact Button */}
          <a
            href={genericWALink}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-block bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-70 shadow-md"
          >
            💬 {langToggle === 'ml' ? "വാട്ട്‌സ്ആപ്പിൽ ബന്ധപ്പെടുക" : "Contact on WhatsApp"}
          </a>
        </div>
      </div>
    </header>
  );
};

/**
 * ⬇️ Footer Component
 */
const Footer = ({ langToggle }) => {
  return (
    <footer className="bg-gray-800 text-white mt-12 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold mb-3 text-indigo-400">
              {langToggle === 'ml' ? "ഉൽപ്പന്നങ്ങൾ" : "Products"}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              {PRODUCTS.map(p => (
                <li key={p.id}>
                  <a href="#products" className="hover:text-white transition-colors duration-200">{p.name}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 text-indigo-400">
              {langToggle === 'ml' ? "ഉപകാരപ്രദം" : "Helpful Links"}
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/privacy" className="hover:text-white transition-colors duration-200">{langToggle === 'ml' ? "സ്വകാര്യത" : "Privacy Policy"}</a></li>
              <li><a href="/returns" className="hover:text-white transition-colors duration-200">{langToggle === 'ml' ? "റിട്ടേണുകൾ" : "Returns Policy"}</a></li>
              <li><a href="mailto:support@localsellerco.com" className="hover:text-white transition-colors duration-200">{langToggle === 'ml' ? "ബന്ധപ്പെടുക" : "Contact"}</a></li>
            </ul>
          </div>
          <div className="col-span-2">
            <h4 className="font-bold mb-3 text-indigo-400">
              {langToggle === 'ml' ? "ഞങ്ങളെക്കുറിച്ച്" : "About Us"}
            </h4>
            <p className="text-sm text-gray-400">
              {langToggle === 'ml'
                ? "നിങ്ങളുടെ പ്രാദേശിക വിതരണക്കാർ, എപ്പോഴും മികച്ച ഡീലുകൾ നൽകുന്നു."
                : "Your local supplier, always delivering the best deals."
              }
            </p>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} My Own Shop. {langToggle === 'ml' ? "എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം." : "All rights reserved."}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Powered by React & Tailwind CSS.
          </p>
        </div>
      </div>
    </footer>
  );
};


/**
 * 🏠 Main Application Component - UPDATED with Routing Logic
 */
function App() {
  const [langToggle, setLangToggle] = useState('ml');
  const [selectedProduct, setSelectedProduct] = useState(null); 

  const toggleLanguage = () => {
    setLangToggle(prev => prev === 'ml' ? 'en' : 'ml');
  };

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    window.scrollTo(0, 0); 
  };
  
  // JSON-LD useEffect remains the same...
  useEffect(() => {
    const oldScript = document.getElementById('json-ld-schema');
    if (oldScript) {
      oldScript.remove();
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "My Own Shop Product Catalog",
    };
    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      if (document.getElementById('json-ld-schema')) {
          document.getElementById('json-ld-schema').remove();
      }
    };
  }, []); 


  // 1. If a product is selected, show the OrderPage
  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <Header langToggle={langToggle} onToggle={toggleLanguage} />
        <main>
          <OrderPage 
            selectedProduct={selectedProduct} 
            onBack={() => setSelectedProduct(null)} 
            langToggle={langToggle} 
          />
        </main>
        <Footer langToggle={langToggle} />
      </div>
    );
  }

  // 2. If no product is selected (default view), show the Product List (Homepage)
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      <Header langToggle={langToggle} onToggle={toggleLanguage} />

      <main>
        <HeroSection langToggle={langToggle} />

        {/* 🎨 UPDATED SECTION STYLING */}
        <section id="products" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-12">
              {langToggle === 'ml' ? "ഞങ്ങളുടെ മികച്ച ഉൽപ്പന്നങ്ങൾ" : "Our Bestselling Products"}
            </h2>
            
            {/* 🟢 Improved Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {PRODUCTS.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  langToggle={langToggle} 
                  onOrder={handleOrderClick}
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer langToggle={langToggle} />
    </div>
  );
}

export default App;