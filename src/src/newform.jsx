import React, { useState } from 'react';

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
 * 🗃️ The Full Page Order Form Component (OrderPage)
 * Displays product details, the gallery, and the order form.
 */
const OrderPage = ({ selectedProduct, onBack, langToggle }) => {
    // State for form inputs
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('UPI'); 

    // Payment Options
    const paymentOptions = [
        { value: 'UPI', label_ml: 'UPI / Google Pay / PhonePe', label_en: 'UPI / Google Pay / PhonePe' },
        { value: 'Bank Transfer', label_ml: 'ബാങ്ക് അക്കൗണ്ട് (Bank Account)', label_en: 'Bank Account (Transfer)' },
        { value: 'WhatsApp Pay', label_ml: 'WhatsApp Pay', label_en: 'WhatsApp Pay' },
    ];

    // Handle final order confirmation and redirect to WhatsApp
    const handleConfirmOrder = () => {
        // Basic validation
        if (quantity < 1 || address.trim() === '') {
            console.error(langToggle === 'ml' ? "എണ്ണവും വിലാസവും നിർബന്ധമാണ്." : "Quantity and Address are mandatory.");
            // Use a custom message box instead of alert()
            document.getElementById('validation-message').textContent = langToggle === 'ml' ? "എണ്ണവും വിലാസവും നിർബന്ധമാണ്." : "Quantity and Address are mandatory.";
            document.getElementById('validation-message').classList.remove('hidden');
            return;
        }

        const waMessage = `
*പുതിയ ഓർഡർ - New Order*
-----------------------------------
*ഉൽപ്പന്നം (Product):* ${selectedProduct.name}
*വില (Price):* ${selectedProduct.price}
*എണ്ണം (Quantity):* ${quantity}
*വിലാസം (Address):* ${address.trim()}
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
            <p id="validation-message" className="hidden bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert"></p>

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
                
                {/* 🟢 NEW: Product Gallery Component */}
                <ProductGallery product={selectedProduct} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-200 pb-2">
                {langToggle === 'ml' ? "ഓർഡർ വിശദാംശങ്ങൾ" : "Order Details"}
            </h2>

            {/* 🔢 Quantity Input */}
            <div className="mb-6">
                <label htmlFor="qty" className="block text-sm font-medium text-gray-700 mb-1">
                    {langToggle === 'ml' ? "എണ്ണം (Quantity)" : "Quantity"}
                </label>
                <input
                    id="qty"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => {
                        document.getElementById('validation-message').classList.add('hidden'); // Clear error on interaction
                        setQuantity(Math.max(1, Number(e.target.value)))
                    }}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 text-lg"
                />
            </div>

            {/* 🏠 Address Input */}
            <div className="mb-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    {langToggle === 'ml' ? "വിലാസം (Shipping Address)" : "Shipping Address"}
                </label>
                <textarea
                    id="address"
                    value={address}
                    onChange={(e) => {
                        document.getElementById('validation-message').classList.add('hidden'); // Clear error on interaction
                        setAddress(e.target.value)
                    }}
                    rows="4" 
                    placeholder={langToggle === 'ml' ? "പൂർണ്ണമായ വിലാസം, പിൻ കോഡ്, ഫോൺ നമ്പർ എന്നിവ നൽകുക" : "Enter full shipping address, pin code, and phone number here"}
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-base"
                />
            </div>
            
            {/* 💳 Payment Method Selector */}
            <div className="mb-8">
                <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-1">
                    {langToggle === 'ml' ? "പേയ്‌മെൻ്റ് രീതി (Preferred Payment Method)" : "Preferred Payment Method"}
                </label>
                <select
                    id="payment"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
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
                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl transition-colors hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-400 shadow-xl text-xl"
            >
                💬 {langToggle === 'ml' ? "ഓർഡർ സ്ഥിരീകരിക്കുക" : "Confirm Order"}
            </button>
        </div>
    );
};

export default OrderPage;