// import Navbar
// import Footer
import Reliance_Price_Data from "@/assets/reliance";

// Images
import Banner from "@/assets/Reliance New Energy/newenergy-banner.jpg";
import GreenEnergy from "@/assets/Reliance New Energy/green-energy.jpg";
import EndSolarPV from "@/assets/Reliance New Energy/end-solar-pv-ecosystem.jpg";
import NexWafeLogo from "@/assets/Reliance New Energy/NexWafe-logo.jpg";
import RecGroupLogo from "@/assets/Reliance New Energy/recgroup-logo.jpg";
import SenseHawkLogo from "@/assets/Reliance New Energy/sensehawk-logo.jpg";
import SterlingWilsonLogo from "@/assets/Reliance New Energy/sterlingandwilson-logo.jpg";

const Reliance = () => {
  return (
    <div className="min-h-screen bg-white">


      {/* Hero Section */}
      <section
        className="relative w-full h-[83vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${Banner.src})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white max-w-4xl px-6">
          {/* Reliance Industries Logo added here */}
          <img
            src="/reliance-industries-ltd.png"
            alt="Reliance Industries Ltd. Logo"
            className="h-24 md:h-32 mx-auto mb-6" // Adjust height and margin as needed
          />
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Energizing India Sustainably
          </h1>
          <p className="text-lg md:text-2xl">
            Moving to a Greener Economy
          </p>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="bg-white py-16 px-6 md:px-20 max-w-6xl mx-auto space-y-6 text-gray-800 leading-relaxed">
        <p>
          Reliance has committed to an ambitious target of achieving net-zero carbon
          status by 2035. Our New Energy proposition is key to achieving this.
        </p>
        <p>
          Through active investments and partnerships and by building a scalable and
          enabling energy ecosystem, we aim to build one of the world's leading New
          Energy and New Materials businesses that can bridge the green energy divide
          in India and globally.
        </p>
        <p>
          The business will be based on the principle of Carbon Recycle and Circular
          Economy with a portfolio of advanced and specialty materials. We aim to create
          a fully integrated manufacturing ecosystem with secure and self-sufficient
          supply chains.
        </p>
        <p>
          Our New Energy and New Materials business is uniquely positioned to address
          Indiaâ€™s â€˜Energy trilemmaâ€™â€”affordability, sustainability, securityâ€”with the
          production of Green Energy.
        </p>
        <p>
          With our indigenous technology ownership and manufacturing capabilities, we
          aim to enable India to transform itself from a net energy importer to a net
          energy exporter.
        </p>
      </section>

      {/* Helping India Lead */}
      <section className="bg-white py-16 px-6 md:px-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-700 mb-6">
            Helping India Lead in the Green Energy Future
          </h2>
          <p className="mb-4">
            At the RIL Annual General Meet in 2021, Chairman and Managing Director Mukesh D. Ambani
            announced an investment of over Rs 75,000 crore (USD 10 billion) in building the most
            comprehensive ecosystem for New Energy and New Materials in India to secure the promise
            of a sustainable future for generations to come.
          </p>
          <p className="mb-4">
            We are committed to helping India lead in the Green New Energy future and are bridging the
            Green Energy divide in India and the world.
          </p>
          <p>
            Our New Energy and New Materials business will be an optimal mix of reliable, clean and
            affordable energy solutions with hydrogen, wind, solar, fuel cells, and batteries.
          </p>
        </div>
        <div>
          <img src={GreenEnergy.src} alt="Green Energy" className="rounded-lg shadow-lg" />
        </div>
      </section>

      {/* Fully Integrated Renewable Energy Ecosystem */}
      <section className="bg-blue-900 text-white py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            A Fully Integrated Renewable Energy Ecosystem
          </h2>
          <p>
            Jamnagar, the cradle of our old energy business, is also the cradle of our New Energy business.
          </p>
          <p>
            We are constructing the Dhirubhai Ambani Green Energy Giga Complex over 5,000 acres in Jamnagar
            with five giga factories for:
          </p>
          <ul className="list-disc list-inside text-left md:text-center mx-auto max-w-md space-y-1">
            <li>Photovoltaic panels</li>
            <li>Fuel cell system</li>
            <li>Green Hydrogen</li>
            <li>Energy storage</li>
            <li>Power electronics</li>
          </ul>
          <p>
            The Dhirubhai Ambani Green Energy Giga Complex will be among the largest such integrated renewable
            energy manufacturing facilities in the world.
          </p>
          <p>
            Additionally, we are pursuing wind power generation by developing a manufacturing ecosystem for
            cost-efficient wind power generation at giga scale.
          </p>
        </div>
      </section>

      {/* End-to-End Solar PV */}
      <section className="bg-white py-16 px-6 md:px-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="order-2 md:order-1">
          <img src={EndSolarPV.src} alt="Solar PV" className="rounded-lg shadow-lg" />
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl font-bold text-yellow-700 mb-6">
            End-to-End Solar PV Ecosystem
          </h2>
          <p className="mb-4">
            We are constructing a fully integrated, end-to-end solar photovoltaics (PV) manufacturing
            ecosystem, which will be one of the largest, most technologically advanced, flexible, and most
            cost-competitive solar giga factories globally.
          </p>
          <p className="mb-4">
            The Jamnagar solar PV and cell module factory will be the first-of-its-kind 'quartz-to-module'
            facility globally, with components from quartz to metallurgical silicon, polysilicon, and
            ingots/wafers, that will be integrated with cells and modules.
          </p>
          <p>
            This will take us a step closer to our target of establishing and enabling at least 100 giga
            watts (GW) of solar energy by 2030.
          </p>
        </div>
      </section>

      {/* Investments & Acquisitions */}
      <section className="bg-[#FFF3DC] py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto space-y-10">
          <h3 className="text-3xl font-bold text-yellow-900 text-center">
            Our Investments & Acquisitions in New Energy and Clean Mobility
          </h3>

          {[
            { title: "REC Solar Holdings AS (REC Group)", text: "RNEL has acquired REC Solar Holdings AS (REC Group), one of the worldâ€™s leading solar cells/panels and polysilicon manufacturing companies, for an enterprise value of USD 771 million.", link: "https://www.recgroup.com", img: RecGroupLogo },
            { title: "SenseHawk", text: "Reliance has invested USD 32 million to acquire a majority stake in SenseHawk, an early-stage California-based developer of software-based management tools for the solar energy generation industry. Founded in 2018, SenseHawk helps accelerate solar projects from planning to production by helping companies streamline processes and use automation. SenseHawk has helped 140+ customers in 15 countries adopt new technology for their 600+ sites and assets totalling 100+ GW. SenseHawkâ€™s Solar Digital Platform offers end-to-end management of solar asset lifecycles.", link: "https://www.sensehawk.com", img: SenseHawkLogo }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-blue-900 mb-3">{item.title}</h4>
                <p className="text-gray-700 mb-3">{item.text}</p>
                {/* Link button styling - already has rounded-lg */}
                <a
                  href={item.link}
                  target="_blank"
                  className="inline-block px-4 py-2 border border-blue-900 rounded-lg bg-white text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  {item.link.replace("https://", "")}
                </a>
              </div>
              {/* Increased image size */}
              <img src={item.img.src} alt={item.title} className="h-32 w-auto ml-8 object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Partnerships */}
      <section className="bg-[#D2A556] py-16 px-6 md:px-20 text-white">
        <div className="max-w-6xl mx-auto space-y-10">
          <h3 className="text-3xl font-bold text-center">
            Forging Global Partnerships for Sustainable Growth
          </h3>
          <p className="text-center mb-6">
            We have forged strong global partnerships to co-create New Energy solutions for India and the world.
          </p>

          {[
            { title: "Sterling & Wilson Solar", text: "RNEL has acquired a 40% stake in Sterling & Wilson Solar, one of the largest EPC and O&M providers globally, to provide turnkey solutions in the New Energy value chain.", link: "https://www.sterlingandwilson.com", img: SterlingWilsonLogo },
            { title: "NexWafe", text: "RNEL has invested USD 29 million (EUR 25 million) in Germanyâ€™s NexWafe and partnered with them for the joint technology development and commercialization of high-efficiency monocrystalline â€œgreen solar wafersâ€ . NexWafeâ€™s unique patented technology is expected to drastically lower costs and make solar photovoltaics the lowest-cost form of renewable energy available and build large-scale wafer manufacturing facilities in India.", link: "https://www.nexwafe.com", img: NexWafeLogo }
          ].map((item, idx) => (
            <div key={idx} className="bg-white text-gray-800 p-6 rounded-xl shadow flex flex-col md:flex-row items-center justify-between">
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-blue-900 mb-3">{item.title}</h4>
                <p className="text-gray-700 mb-3">{item.text}</p>
                {/* Link button styling - already has rounded-lg */}
                <a
                  href={item.link}
                  target="_blank"
                  className="inline-block px-4 py-2 border border-blue-900 rounded-lg bg-white text-blue-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-opacity-50 transition duration-300 ease-in-out"
                >
                  {item.link.replace("https://", "")}
                </a>
              </div>
              {/* Increased image size */}
              <img src={item.img.src} alt={item.title} className="h-32 w-auto ml-8 object-contain" />
            </div>
          ))}
        </div>
      </section>

      {/* Price Section */}
      <section className="bg-gray-100 py-16 px-6 md:px-20">
        <Reliance_Price_Data />
      </section>


    </div>
  );
};

export default Reliance;










