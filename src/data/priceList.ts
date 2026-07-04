import type { Product } from '../types/quote';

export const GST_RATE = 0.089;
export const EXTRA_HEIGHT_RATE = 1500; // ₹ per kWp

export const companyDetails = {
    name: "Arpit Solar",
    logo: "/logo.webp",
    address: "Sh16/114-25-K-2, Sharvodayanagar, Kadipur, Shivpur, Varanasi 221003 (UP)",
};

// Tata Price List - On-Grid SPS (DCR)
export const tataProducts: Product[] = [
    { kWp: 2.36, phase: 1, module: 590, qty: 4, price: 145000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 3.54, phase: 1, module: 590, qty: 6, price: 195000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 4.72, phase: 1, module: 590, qty: 8, price: 255000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 5.31, phase: 1, module: 590, qty: 9, price: 295000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 5.90, phase: 1, module: 590, qty: 10, price: 310000, wire: 150, outOfVns: 5000, supplier: 'tata' },
    { kWp: 5.31, phase: 3, module: 590, qty: 9, price: 325000, wire: 225, outOfVns: 5000, supplier: 'tata' },
    { kWp: 6.49, phase: 3, module: 590, qty: 11, price: 375500, wire: 225, outOfVns: 5000, supplier: 'tata' },
    { kWp: 8.85, phase: 3, module: 590, qty: 15, price: 480000, wire: 225, outOfVns: 5000, supplier: 'tata' },
    { kWp: 10.62, phase: 3, module: 590, qty: 18, price: 551000, wire: 225, outOfVns: 5000, supplier: 'tata' },
];

// Waaree TOPCON Price List - On-Grid SPS
export const waareeTopconProducts: Product[] = [
    { kWp: 2.14, phase: 1, module: 535, qty: 4, price: 135000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 3.21, phase: 1, module: 535, qty: 6, price: 185000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 4.28, phase: 1, module: 535, qty: 8, price: 245000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 5.35, phase: 1, module: 535, qty: 10, price: 285000, wire: 150, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 6.42, phase: 3, module: 535, qty: 12, price: 362000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 8.02, phase: 3, module: 535, qty: 15, price: 445000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
    { kWp: 10.16, phase: 3, module: 535, qty: 19, price: 540000, wire: 225, outOfVns: 5000, supplier: 'waaree-topcon' },
];

// Adani TOPCON Price List - On-Grid SPS
export const adaniTopconProducts: Product[] = [
    { kWp: 2.14, phase: 1, module: 535, qty: 4, price: 135000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 3.21, phase: 1, module: 535, qty: 6, price: 185000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 4.28, phase: 1, module: 535, qty: 8, price: 245000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 5.35, phase: 1, module: 535, qty: 10, price: 285000, wire: 150, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 6.42, phase: 3, module: 535, qty: 12, price: 362000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 8.02, phase: 3, module: 535, qty: 15, price: 445000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
    { kWp: 10.16, phase: 3, module: 535, qty: 19, price: 540000, wire: 225, outOfVns: 5000, supplier: 'adani-topcon' },
];

// Premier TOPCON Price List - On-Grid SPS
export const premierTopconProducts: Product[] = [
    { kWp: 2.14, phase: 1, module: 535, qty: 4, price: 135000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 3.21, phase: 1, module: 535, qty: 6, price: 185000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 4.28, phase: 1, module: 535, qty: 8, price: 245000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 5.35, phase: 1, module: 535, qty: 10, price: 285000, wire: 150, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 6.42, phase: 3, module: 535, qty: 12, price: 362000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 8.02, phase: 3, module: 535, qty: 15, price: 445000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
    { kWp: 10.16, phase: 3, module: 535, qty: 19, price: 540000, wire: 225, outOfVns: 5000, supplier: 'premier-topcon' },
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
