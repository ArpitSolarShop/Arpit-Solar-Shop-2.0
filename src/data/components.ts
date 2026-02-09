export const defaultComponents = [
    { name: 'Acdb', brand: 'Tata Kit', quantity: '1 nos' },
    { name: 'Dcdb', brand: 'Tata Kit', quantity: '1 nos' },
    { name: 'Ac Cable', brand: 'Polycab/KEI', quantity: '10 mtr' },
    { name: 'Dc Cable', brand: 'Polycab/KEI', quantity: '40 mtr' },
    { name: 'Module M. Structure', spec: "GI 3'X6'", quantity: "3'X6'" },
    { name: 'Earthing Rod', brand: 'Tata Kit', quantity: '3 nos' },
    { name: 'Earthing Chemical', brand: 'Tata Kit', quantity: '3 nos' },
    { name: 'Earthing Wire', spec: 'Al 10mm', quantity: '90 mtr' },
    { name: 'Lighting Arrestor', brand: 'Tata Kit', quantity: '1 pc' },
] as const;

export type DefaultComponent = typeof defaultComponents[number];
