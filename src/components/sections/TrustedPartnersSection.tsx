"use client"

// Define the TrustedPartnersSection component
const TrustedPartnersSection: React.FC = () => {
  return (
    // Full-width section background
    <section
      className="py-16 px-4 sm:px-6 lg:px-8 w-full mt-12 mb-12"
      style={{
        background: 'linear-gradient(to bottom, #FFFDE7, #FFFF8A)',
      }}
    >
      {/* Inner content container (keeps text & cards centered) */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Section Heading */}
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-6 leading-tight">
            Our Trusted Partners:{' '}
            <span className="text-amber-500">Leaders in Their Fields</span>
          </h2>

          {/* Section Description */}
          <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We are proud to collaborate with some of the most respected and innovative companies in India.
            Our partners are not just suppliers; they are leaders in their respective industries, known for
            their unwavering commitment to quality, cutting-edge technology, and exceptional service.
          </p>
          <p className="mt-2 text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Together, we work to bring you the very best, ensuring every product and solution we offer is
            reliable, efficient, and meets the highest standards. We believe that by partnering with the
            best, we can deliver an unparalleled experience to our customers.
          </p>
        </div>

        {/* Grid for partner logos/cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Partner Logo 1: Shakti Solar */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-200 flex flex-col items-center justify-center text-center">
            <img
              src="/Shakti Solar.png"
              alt="Shakti Solar Logo"
              className="h-16 w-auto mb-4 rounded-md object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/120x60/cccccc/000000?text=Shakti+Solar';
              }}
            />
            <h3 className="text-xl font-semibold text-gray-800">Shakti Solar</h3>
            <p className="text-gray-600 text-sm mt-2">
              A leading name in solar panel manufacturing and innovation.
            </p>
          </div>

          {/* Partner Logo 2: Tata Power Solar */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-200 flex flex-col items-center justify-center text-center">
            <img
              src="/Tata Power Solar.png"
              alt="Tata Power Solar Logo"
              className="h-16 w-auto mb-4 rounded-md object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/120x60/cccccc/000000?text=Tata+Power+Solar';
              }}
            />
            <h3 className="text-xl font-semibold text-gray-800">Tata Power Solar</h3>
            <p className="text-gray-600 text-sm mt-2">
              Pioneering integrated solar solutions across India.
            </p>
          </div>

          {/* Partner Logo 3: Reliance Industries Ltd. */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-200 flex flex-col items-center justify-center text-center">
            <img
              src="/reliance-industries-ltd.png"
              alt="Reliance Industries Ltd. Logo"
              className="h-16 w-auto mb-4 rounded-md object-contain"
              onError={(e) => {
                e.currentTarget.src =
                  'https://placehold.co/120x60/cccccc/000000?text=Reliance';
              }}
            />
            <h3 className="text-xl font-semibold text-gray-800">
              Reliance Industries Ltd.
            </h3>
            <p className="text-gray-600 text-sm mt-2">
              Driving innovation in various sectors, including renewable energy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App component to render the section
const App: React.FC = () => {
  return (
    <div className="min-h-screen font-sans text-gray-900">
      <TrustedPartnersSection />
    </div>
  );
};

export default App;
