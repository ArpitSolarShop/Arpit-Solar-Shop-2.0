
const fs = require('fs');
const path = require('path');

const newLocalities = [
    "Ashapur",
    "Assi Ghat",
    "Ayar",
    "Bangali Tola",
    "Basani Bazaar",
    "Bazardiha",
    "Bhagwanpur",
    "Bhelupur",
    "Bhelupura",
    "Bhikhampur",
    "Bhulanpur PSC",
    "Birapatti",
    "Chandpur Industrial Estate",
    "Chetganj",
    "Dafi",
    "Daranagar",
    "Dashaswmedh Road",
    "Dheerendra Mahila Maha Vidyalaya",
    "DurgaKund",
    "Gai Ghat",
    "Hanumaan Ghat",
    "Harhua",
    "Ishwargangi Pokhra",
    "Jaitpura",
    "Jansa Bazar",
    "Kamachha Road",
    "Kandawa Chauraha",
    "Kedar Ghat",
    "Khajuri Road",
    "Lahartara",
    "Lanka",
    "Luxa Road",
    "Maheshpur",
    "Mahmoorganj",
    "Manduadih",
    "Murdaha Bazar",
    "Nagar Mahapalika Hospital",
    "Narayanpur",
    "Naya Ghat",
    "Newada",
    "Om Nagar Colony",
    "Paharia",
    "Pandeypur",
    "Phulpur",
    "Pindra",
    "Piyari",
    "Rajpur",
    "Ramaipatti",
    "Ramapura Luxa",
    "Rameshwar",
    "Ramnagar",
    "Sarnath",
    "Shivala",
    "Shivpur",
    "Shivraj nagar",
    "Shri Kashi Vishwanath Temple",
    "Sidhgiribagh",
    "Sigra",
    "Sikraul",
    "Sindhora",
    "Singhpur",
    "Sunderpur",
    "Susuwahi Road",
    "Tapovan Ashram",
    "Vidyapeeth Road"
];

const filePath = path.join(__dirname, '../data/locations.json');

const toSlug = (name) => {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-') + '-varanasi';
};

const main = () => {
    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const existingSlugs = new Set(data.map(item => item.slug));
        const existingNames = new Set(data.map(item => item.name.toLowerCase()));

        let addedCount = 0;

        newLocalities.forEach(loc => {
            const slug = toSlug(loc);

            // Fuzzy check
            if (existingSlugs.has(slug) || existingNames.has(loc.toLowerCase())) {
                console.log(`Skipping ${loc} (already exists)`);
                return;
            }

            const newEntry = {
                slug: slug,
                name: loc,
                type: "Locality",
                city: "Varanasi",
                state: "Uttar Pradesh",
                pincode: "221001",
                discom: "PuVVNL",
                subsidy: "108000"
            };

            data.push(newEntry);
            console.log(`Adding ${loc}`);
            addedCount++;
        });

        if (addedCount > 0) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            console.log(`Successfully added ${addedCount} new locations.`);
        } else {
            console.log("No new locations to add.");
        }

    } catch (err) {
        console.error("Error:", err);
    }
};

main();
