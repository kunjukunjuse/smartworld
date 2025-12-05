import React, { useState } from 'react';
import { Mail, Phone, MapPin, Package, DollarSign, Send, ShoppingCart, User } from 'lucide-react'; // For icons

// ⚠️ Note: These constants are copied from App.jsx for simplicity.
function buildWhatsAppLink(phone, message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

// 📞 IMPORTANT: REPLACE with the seller's actual WhatsApp number.
const WHATSAPP_NUMBER = "919645637618"; 

// -------------------------------------------------------------

/**
 * 🖼️ Product Gallery Component: Displays the main image and clickable thumbnails.
 */
const ProductGallery = ({ product }) => {
    // 1. Initial image is the main product image
    const [mainImage, setMainImage] = useState(product.image);
    
    // 2. Combine main image and gallery images for the full list
    // Ensures the main image is always the first thumbnail
    const images = [product.image, ...(product.gallery || [])].filter((v, i, a) => a.indexOf(v) === i);

    return (
        // Flex container for gallery (vertical on mobile, horizontal on desktop)
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            
            {/* Left Side: Thumbnail Gallery (Vertical scroll on desktop) */}
            <div className="flex md:flex-col order-2 md:order-1 gap-3 overflow-x-auto md:w-[100px] md:h-[400px]">
                {images.map((imgSrc, index) => (
                    <div 
                        key={index}
                        // 🎨 Thumbnail Container
                        className={`
                            w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-1 bg-white rounded-lg border-2 transition-all duration-200 cursor-pointer flex-shrink-0
                            ${mainImage === imgSrc ? 'border-indigo-600 shadow-md' : 'border-gray-200 hover:border-indigo-300'}
                        `}
                        onClick={() => setMainImage(imgSrc)}
                    >
                        <img
                            src={imgSrc}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-contain"
                        />
                    </div>
                ))}
            </div>

            {/* Right Side: Main Image Display */}
            <div className="order-1 md:order-2 md:flex-grow bg-gray-100 rounded-xl overflow-hidden shadow-lg p-4 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                <img
                    src={mainImage}
                    alt={product.name}
                    className="object-contain w-full h-full max-h-[500px]" // Image fit style
                />
            </div>
        </div>
    );
};

/**
 * ⚙️ Reusable Input Field Component (Moved outside OrderPage)
 */
const InputField = ({ labelMl, labelEn, id, type = 'text', value, onChange, placeholderMl, placeholderEn, Icon, required = false, langToggle, clearError }) => (
    <div className="mb-6">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            <Icon size={16} className="inline-block mr-2 text-indigo-500" />
            {langToggle === 'ml' ? labelMl : labelEn}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <input
            id={id}
            type={type}
            value={value}
            onChange={(e) => { 
                onChange(e.target.value); 
                clearError(); // Use clearError prop
            }}
            placeholder={langToggle === 'ml' ? placeholderMl : placeholderEn}
            required={required}
            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-base"
        />
    </div>
);


/**
 * 🗃️ The Full Page Order Form Component (OrderPage)
 * Displays product details, the gallery, and the order form.
 */
const OrderPage = ({ selectedProduct, onBack, langToggle }) => {
    // State for form inputs (UPDATED: Added stateName)
    const [quantity, setQuantity] = useState(1);
    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [houseName, setHouseName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [stateName, setStateName] = useState(''); // NEW STATE
    const [pincode, setPincode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI'); 
    
    // State for validation message display
    const [validationError, setValidationError] = useState('');


    // Payment Options
    const paymentOptions = [
        { value: 'UPI', label_ml: 'UPI / Google Pay / PhonePe', label_en: 'UPI / Google Pay / PhonePe' },
        { value: 'Bank Transfer', label_ml: 'ബാങ്ക് അക്കൗണ്ട് (Bank Account)', label_en: 'Bank Account (Transfer)' },
        { value: 'WhatsApp Pay', label_ml: 'WhatsApp Pay', label_en: 'WhatsApp Pay' },
    ];

    // Function to clear errors on input change
    const clearError = () => setValidationError('');


    // Handle final order confirmation and redirect to WhatsApp
    const handleConfirmOrder = () => {
        // Basic validation (UPDATED: Added stateName check)
        if (quantity < 1 || fullName.trim() === '' || phoneNumber.trim() === '' || houseName.trim() === '' || city.trim() === '' || stateName.trim() === '' || pincode.trim() === '') {
            const errorMsg = langToggle === 'ml' ? "എല്ലാ പ്രധാന വിവരങ്ങളും (പേര്, ഫോൺ, വിലാസം, പിൻകോഡ്) നൽകുന്നത് നിർബന്ധമാണ്." : "All mandatory fields (Name, Phone, Address, Pincode) must be filled.";
            setValidationError(errorMsg);
            return;
        }

        // Combine shipping details into one clean address string (UPDATED: Added stateName)
        const shippingAddress = `
            ${houseName.trim()}, 
            ${street.trim() ? street.trim() + ', ' : ''}
            ${city.trim()}, ${stateName.trim()} - ${pincode.trim()}
        `.trim().replace(/,(\s*),/g, ',').replace(/\s*,\s*$/, '').replace(/\s*\n\s*/g, ' '); // Clean up extra commas/spaces
        
        const waMessage = `
*പുതിയ ഓർഡർ - New Order*
-----------------------------------
*ഉൽപ്പന്നം (Product):* ${selectedProduct.name}
*വില (Price):* ${selectedProduct.price}
*എണ്ണം (Quantity):* ${quantity}

*ഷിപ്പിംഗ് വിവരങ്ങൾ (Shipping Details)*
-----------------------------------
*പേര് (Name):* ${fullName.trim()}
*ഫോൺ (Phone):* ${phoneNumber.trim()}
*വിലാസം (Address):* ${shippingAddress}
*പേയ്‌മെൻ്റ് രീതി (Payment Method):* ${paymentMethod}
-----------------------------------
ദയവായി ഓർഡർ ഉറപ്പാക്കുക.
        `.trim();

        const waLink = buildWhatsAppLink(WHATSAPP_NUMBER, waMessage);
        
        // Open WhatsApp in a new tab
        window.open(waLink, '_blank');
        onBack(); // Go back to product list after submission
    };


    return (
        // 🎨 UPDATED STYLING: Wider content area for gallery
        <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8 lg:px-10 bg-white shadow-2xl rounded-3xl my-10 border border-gray-100">
            
            {/* Validation Message Box (for error display) */}
            {validationError && (
                 <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 font-medium" role="alert">
                    {validationError}
                 </p>
            )}

            <button 
                onClick={onBack} 
                className="text-indigo-600 font-semibold mb-8 flex items-center hover:text-indigo-800 transition-colors text-lg"
            >
                &larr; {langToggle === 'ml' ? "ഉൽപ്പന്നങ്ങളിലേക്ക് തിരികെ പോകുക" : "Back to Products"}
            </button>
            
            {/* Product Gallery Section */}
            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{selectedProduct.name}</h1>
                <p className="text-3xl font-bold text-indigo-700 mb-6">{selectedProduct.price}</p>
                
                {/* 🟢 Product Gallery Component */}
                <ProductGallery product={selectedProduct} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-200 pb-2 flex items-center">
                <ShoppingCart className="mr-3 text-indigo-600" size={28} />
                {langToggle === 'ml' ? "ഓർഡർ വിശദാംശങ്ങൾ" : "Order Details"}
            </h2>

            {/* 🔢 Quantity Input */}
            <div className="mb-8 p-4 bg-indigo-50 rounded-xl">
                <label htmlFor="qty" className="block text-sm font-medium text-indigo-800 mb-2 font-semibold">
                    <Package size={16} className="inline-block mr-2" />
                    {langToggle === 'ml' ? "എണ്ണം (Quantity)" : "Quantity"}
                    <span className="text-red-500 ml-1">*</span>
                </label>
                <input
                    id="qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                        clearError(); // Clear error on interaction
                        setQuantity(Math.max(1, Number(e.target.value)))
                    }}
                    className="w-full border border-indigo-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-lg font-bold"
                />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-200 pb-2 flex items-center">
                <MapPin className="mr-3 text-indigo-600" size={28} />
                {langToggle === 'ml' ? "ഷിപ്പിംഗ് വിലാസം" : "Shipping Address"}
            </h2>

            {/* 👤 Full Name Input */}
            <InputField 
                id="fullName" 
                labelMl="പൂർണ്ണമായ പേര്" 
                labelEn="Full Name" 
                value={fullName} 
                onChange={setFullName}
                placeholderMl="ഇവിടെ നിങ്ങളുടെ പേര് നൽകുക"
                placeholderEn="Enter your full name here"
                Icon={User}
                required
                langToggle={langToggle}
                clearError={clearError}
            />

            {/* 📞 Phone Number Input */}
            <InputField 
                id="phoneNumber" 
                labelMl="ഫോൺ നമ്പർ" 
                labelEn="Phone Number" 
                type="tel"
                value={phoneNumber} 
                onChange={setPhoneNumber}
                placeholderMl="10 അക്ക ഫോൺ നമ്പർ"
                placeholderEn="10 digit phone number"
                Icon={Phone}
                required
                langToggle={langToggle}
                clearError={clearError}
            />

            {/* Address Row 1: House/Building Name */}
            <InputField 
                id="houseName" 
                labelMl="വീട്ടുപേര് / കെട്ടിടത്തിൻ്റെ പേര്" 
                labelEn="House / Building Name" 
                value={houseName} 
                onChange={setHouseName}
                placeholderMl="ഭവനം, അപ്പാർട്ട്മെൻ്റ്, അല്ലെങ്കിൽ സ്ഥാപനം"
                placeholderEn="House, Apartment, or Establishment"
                Icon={MapPin}
                required
                langToggle={langToggle}
                clearError={clearError}
            />

            {/* Address Row 2: Street / Locality */}
            <InputField 
                id="street" 
                labelMl="തെരുവ് / സ്ഥലം" 
                labelEn="Street / Locality" 
                value={street} 
                onChange={setStreet}
                placeholderMl="പ്രധാനപ്പെട്ട റോഡ് അല്ലെങ്കിൽ സമീപസ്ഥലം"
                placeholderEn="Major street or locality"
                Icon={MapPin}
                langToggle={langToggle}
                clearError={clearError}
            />

            {/* Address Row 3: City, State, and Pincode */}
            {/* UPDATED: Split into 3 columns for City, State, and Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InputField 
                    id="city" 
                    labelMl="നഗരം / ജില്ല" 
                    labelEn="City / District" 
                    value={city} 
                    onChange={setCity}
                    placeholderMl="സ്ഥലം, ജില്ല"
                    placeholderEn="City, District"
                    Icon={MapPin}
                    required
                    langToggle={langToggle}
                    clearError={clearError}
                />
                
                {/* 📍 NEW STATE FIELD */}
                <InputField 
                    id="state" 
                    labelMl="സംസ്ഥാനം" 
                    labelEn="State" 
                    value={stateName} 
                    onChange={setStateName}
                    placeholderMl="സംസ്ഥാനത്തിൻ്റെ പേര്"
                    placeholderEn="State Name"
                    Icon={MapPin}
                    required
                    langToggle={langToggle}
                    clearError={clearError}
                />
                
                <InputField 
                    id="pincode" 
                    labelMl="പിൻകോഡ്" 
                    labelEn="Pincode" 
                    type="number"
                    value={pincode} 
                    onChange={setPincode}
                    placeholderMl="6 അക്ക പിൻകോഡ്"
                    placeholderEn="6 digit Pincode"
                    Icon={Mail}
                    required
                    langToggle={langToggle}
                    clearError={clearError}
                />
            </div>

            {/* 💳 Payment Method Selector */}
            <div className="mb-8 mt-6">
                <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">
                    <DollarSign size={16} className="inline-block mr-2 text-indigo-500" />
                    {langToggle === 'ml' ? "പേയ്‌മെൻ്റ് രീതി (Preferred Payment Method)" : "Preferred Payment Method"}
                </label>
                <select
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => { setPaymentMethod(e.target.value); clearError(); }}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-base"
                >
                    {paymentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {langToggle === 'ml' ? option.label_ml : option.label_en}
                        </option>
                    ))}
                </select>
            </div>

            {/* Confirm Order Button */}
            <button
                onClick={handleConfirmOrder}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-xl text-xl flex items-center justify-center"
            >
                <Send className="mr-3" size={24} />
                💬 {langToggle === 'ml' ? "ഓർഡർ സ്ഥിരീകരിക്കുക (വാട്ട്‌സ്ആപ്പ് വഴി)" : "Confirm Order (Via WhatsApp)"}
            </button>
        </div>
    );
};

export default OrderPage;