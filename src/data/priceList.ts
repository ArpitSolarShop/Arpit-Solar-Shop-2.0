import type { Product } from '../types/quote';

export const GST_RATE = 0.089;
export const EXTRA_HEIGHT_RATE = 1500; // ₹ per kWp

export const companyDetails = {
    name: "Arpit Solar",
    logo: "/logo.png",
    address: "Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003 (UP)",
};

// Tata Price List - On-Grid SPS
export const tataProducts: Product[] = [
    { kWp: 2.24, phase: 1, module: 560, qty: 4, price: 130000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 3.36, phase: 1, module: 560, qty: 6, price: 180000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 4.48, phase: 1, module: 560, qty: 8, price: 240000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 5.04, phase: 1, module: 560, qty: 9, price: 270000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 5.60, phase: 1, module: 560, qty: 9, price: 300000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 5.04, phase: 3, module: 560, qty: 9, price: 300000, wire: 225, outOfVns: 5000, supplier: 'tata' },
    { kWp: 6.16, phase: 3, module: 560, qty: 11, price: 345000, wire: 225, outOfVns: 5000, supplier: 'tata' },
    { kWp: 8.40, phase: 3, module: 560, qty: 15, price: 440000, wire: 225, outOfVns: 5000, supplier: 'tata' },
    { kWp: 10.08, phase: 3, module: 560, qty: 18, price: 510000, wire: 225, outOfVns: 5000, supplier: 'tata' },
];

// Waaree TOPCON Price List - On-Grid SPS
export const waareeTopconProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 135000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 180000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 185000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 245000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 275000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 5.80, phase: 1, module: 580, qty: 9, price: 305000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 5.04, phase: 3, module: 580, qty: 9, price: 305000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 6.38, phase: 3, module: 580, qty: 11, price: 350000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 8.12, phase: 3, module: 580, qty: 14, price: 430000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 10.44, phase: 3, module: 580, qty: 18, price: 515000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
];

// Adani TOPCON Price List - On-Grid SPS
export const adaniTopconProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 135000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 180000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 185000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 245000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 275000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 5.80, phase: 1, module: 580, qty: 9, price: 305000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 5.04, phase: 3, module: 580, qty: 9, price: 305000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 6.38, phase: 3, module: 580, qty: 11, price: 350000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 8.12, phase: 3, module: 580, qty: 14, price: 430000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 10.44, phase: 3, module: 580, qty: 18, price: 515000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
];

// Premier TOPCON Price List - On-Grid SPS
export const premierTopconProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 135000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 180000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 185000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 245000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 275000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 5.80, phase: 1, module: 580, qty: 9, price: 305000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 5.04, phase: 3, module: 580, qty: 9, price: 305000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 6.38, phase: 3, module: 580, qty: 11, price: 350000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 8.12, phase: 3, module: 580, qty: 14, price: 430000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 10.44, phase: 3, module: 580, qty: 18, price: 515000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
];

// Waaree TOPCON DCR Hybrid with Battery Price List
export const waareeHybridDcrWithBatteryProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 221500, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-battery' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 248000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-battery' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 260000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-battery' },
    { kWp: 4.06, phase: 1, module: 580, qty: 7, price: 305000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-battery' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 320000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-battery' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 360000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-battery' },
];

// Waaree TOPCON DCR Hybrid without Battery (WOBB) Price List
export const waareeHybridDcrNoBatteryProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 191500, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-nobattery' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 212000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-nobattery' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 225000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-nobattery' },
    { kWp: 4.06, phase: 1, module: 580, qty: 7, price: 265000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-nobattery' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 280000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-nobattery' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 325000, wire: 150, outOfVns: 5000, supplier: 'waaree-dcr-nobattery' },
];

// Waaree TOPCON N-DCR Hybrid with Battery Price List
export const waareeHybridNDcrWithBatteryProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 202940, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-battery' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 224000, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-battery' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 232160, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-battery' },
    { kWp: 4.06, phase: 1, module: 580, qty: 7, price: 272520, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-battery' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 282880, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-battery' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 318240, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-battery' },
];

// Waaree TOPCON N-DCR Hybrid without Battery (WOBB) Price List
export const waareeHybridNDcrNoBatteryProducts: Product[] = [
    { kWp: 2.32, phase: 1, module: 580, qty: 4, price: 172940, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-nobattery' },
    { kWp: 3.00, phase: 1, module: 600, qty: 5, price: 188000, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-nobattery' },
    { kWp: 3.48, phase: 1, module: 580, qty: 6, price: 197160, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-nobattery' },
    { kWp: 4.06, phase: 1, module: 580, qty: 7, price: 232520, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-nobattery' },
    { kWp: 4.64, phase: 1, module: 580, qty: 8, price: 242880, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-nobattery' },
    { kWp: 5.22, phase: 1, module: 580, qty: 9, price: 283240, wire: 150, outOfVns: 5000, supplier: 'waaree-ndcr-nobattery' },
];

// Combined products - Tata and all module variants
export const products: Product[] = [
    ...tataProducts,
    ...waareeTopconProducts,
    ...adaniTopconProducts,
    ...premierTopconProducts,
    ...waareeHybridDcrWithBatteryProducts,
    ...waareeHybridDcrNoBatteryProducts,
    ...waareeHybridNDcrWithBatteryProducts,
    ...waareeHybridNDcrNoBatteryProducts,
    ...waareeHybridNDcrNoBatteryProducts,
];

// Supplier groups for easy navigation
export const productsBySupplier = {
    tata: tataProducts,
    waareeTopcon: waareeTopconProducts,
    adaniTopcon: adaniTopconProducts,
    premierTopcon: premierTopconProducts,
    waareeHybridDcrBattery: waareeHybridDcrWithBatteryProducts,
    waareeHybridDcrNoBattery: waareeHybridDcrNoBatteryProducts,
    waareeHybridNDcrBattery: waareeHybridNDcrWithBatteryProducts,
    waareeHybridNDcrNoBattery: waareeHybridNDcrNoBatteryProducts,
};
