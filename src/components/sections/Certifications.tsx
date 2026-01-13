
// import React from "react";
// import clientsImage from "@/assets/clients.jpg";

// const Certifications = () => {
//   return (
//     <section className="py-16 bg-yellow-100">
//       <div className="container mx-auto px-4 text-center">
//         <h2 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">
//           <span className="text-black">Our Trusted </span>
//           <span className="text-yellow-500">Partners</span>
//         </h2>
//         <p className="text-black mb-10 max-w-2xl mx-auto">
//           We proudly collaborate with government bodies, energy corporations, and global solar technology leaders.
//         </p>

//         <div className="flex justify-center">
//           <img
//             src={clientsImage}
//             alt="Partner and Certification Logos"
//             className="rounded-xl shadow-lg max-w-full w-full md:max-w-4xl object-contain"
//             loading="lazy"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Certifications;









import React from "react";
import relianceCert from "@/assets/Reliance Solar Certificate.jpg";
import shaktiCert from "@/assets/Shkti Solar Certificate.jpg";

const Certifications = () => {
  return (
    <section className="py-16 bg-yellow-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold tracking-tight mb-6 md:text-5xl">
          <span className="text-black">Our </span>
          <span className="text-yellow-500">Certifications</span>
        </h2>
        <p className="text-black mb-10 max-w-2xl mx-auto">
          We proudly hold certifications from leading solar corporations,
          ensuring reliability, trust, and excellence in our solutions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          <img
            src={relianceCert.src}
            alt="Reliance Solar Certificate"
            className="rounded-xl shadow-lg w-full max-w-md object-contain"
            loading="lazy"
          />
          <img
            src={shaktiCert.src}
            alt="Shakti Solar Certificate"
            className="rounded-xl shadow-lg w-full max-w-md object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default Certifications;
