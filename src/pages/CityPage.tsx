import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import locationsData from '@/data/locations.json';
import NotFound from './NotFound'; // Verify this import path is correct

interface LocationData {
  slug: string;
  name: string;
  type: string;
  city: string;
  state: string;
  pincode: string;
  discom: string;
  subsidy: string;
}

const CityPage: React.FC = () => {
  // Capture the entire segment (e.g. "solar-in-varanasi-cantt-varanasi")
  const { slug } = useParams<{ slug: string }>();

  // 1. Check if the URL starts correctly
  if (!slug || !slug.startsWith('solar-in-')) {
    // If it's just "/random-text", it's not a city page -> Show 404
    return <NotFound />;
  }

  // 2. Remove the prefix to get the real DB slug
  const dbSlug = slug.replace('solar-in-', '');

  // 3. Find the location in your JSON
  const location = (locationsData as LocationData[]).find(
    (loc) => loc.slug === dbSlug
  );

  // 4. If URL looks right ("solar-in-fake-city") but city doesn't exist
  if (!location) {
    return <NotFound />;
  }

  const displayLocation = location.name; 

  return (
    <>
      <Helmet>
        <title>Solar in {displayLocation} - Subsidy & Price List 2026</title>
        <meta 
          name="description" 
          content={`Get solar panels in ${displayLocation}, ${location.city}, ${location.state} (${location.pincode}). Avail government subsidy up to ₹${location.subsidy}.`} 
        />
        <link rel="canonical" href={`https://arpitsolar.com/solar-in-${location.slug}`} />
      </Helmet>

      <div className="max-w-4xl mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-4">
          Solar Panel Installation in {displayLocation}
        </h1>
        
        <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
          <p className="text-lg">
            Residents of <b>{displayLocation}</b> ({location.type}) in {location.city} can now get rooftop solar with 
            <b> ₹{location.subsidy} subsidy</b> under the PM Surya Ghar Yojana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded shadow-sm">
            <h3 className="font-bold text-gray-700">Service Area</h3>
            <p>{location.name}, {location.city}</p>
            <p className="text-sm text-gray-500">Pin: {location.pincode}</p>
          </div>
          
          <div className="p-4 border rounded shadow-sm">
            <h3 className="font-bold text-gray-700">Electricity Board</h3>
            <p>Net Metering available for <b>{location.discom}</b> consumers.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CityPage;