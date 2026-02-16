
import json
import os
import re

# The list provided by the user
new_localities = [
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
]

file_path = r'c:\Users\arpit\OneDrive\Desktop\arpit-solar-shop-next-app\src\data\locations.json'

def to_slug(name):
    s = name.lower()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'\s+', '-', s)
    return f"{s}-varanasi"

def main():
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    existing_slugs = {item['slug'] for item in data}
    existing_names = {item['name'].lower() for item in data}

    added_count = 0

    for loc in new_localities:
        slug = to_slug(loc)
        
        # Check if already exists (fuzzy check on name or exact slug)
        if slug in existing_slugs or loc.lower() in existing_names:
            print(f"Skipping {loc} (already exists)")
            continue

        # Create new entry
        new_entry = {
            "slug": slug,
            "name": loc,
            "type": "Locality", # Using Locality to distinguish
            "city": "Varanasi",
            "state": "Uttar Pradesh",
            "pincode": "221001", # Default fallback, user can update later if needed
            "discom": "PuVVNL",
            "subsidy": "108000"
        }
        
        data.append(new_entry)
        print(f"Adding {loc}")
        added_count += 1

    if added_count > 0:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        print(f"Successfully added {added_count} new locations.")
    else:
        print("No new locations to add.")

if __name__ == "__main__":
    main()
