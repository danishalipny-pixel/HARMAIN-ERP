const bcrypt = require('bcryptjs');

function getHashedPassword(password) {
  return bcrypt.hashSync(password, 10);
}

const defaultPasswordHash = getHashedPassword('harmain123');
const adminPasswordHash = getHashedPassword('admin123');

const seedData = {
  settings: [
    {
      id: 'settings_main',
      agencyName: 'HARMAIN ERP',
      tagline: 'ONE PLATFORM. EVERY JOURNEY.',
      productDescription: 'Complete Hajj, Umrah & Travel Agency Management System',
      dtsLicense: 'DTS-ISB-2024-8849',
      iataCode: 'PK-2749102',
      munazzamId: 'MNZ-77192',
      hajjQuota: 250,
      email: 'operations@harmainerp.com',
      phone: '+92 51 8849200',
      whatsapp: '+966 50 123 4567',
      address: 'Harmain Tower, Blue Area, Islamabad, Pakistan / Al-Siteen St, Makkah Al-Mukarramah, KSA',
      baseCurrency: 'PKR',
      exchangeRates: {
        SAR: 74.50, // 1 SAR = 74.50 PKR
        USD: 278.50, // 1 USD = 278.50 PKR
        EUR: 302.00
      },
      bankAccounts: [
        {
          bankName: 'Meezan Bank Ltd',
          accountTitle: 'Harmain Travel & Tours Pvt Ltd',
          accountNumber: '01010108849201',
          iban: 'PK42MEZN0001010108849201',
          branch: 'Blue Area Islamabad',
          currency: 'PKR'
        },
        {
          bankName: 'Al-Rajhi Bank',
          accountTitle: 'Harmain Umrah Services KSA',
          accountNumber: '482001928471',
          iban: 'SA0380000482001928471000',
          branch: 'Clock Tower Branch Makkah',
          currency: 'SAR'
        }
      ],
      enableNotifications: true,
      vatPercentage: 15, // Saudi VAT
      updatedAt: new Date().toISOString()
    }
  ],

  branches: [
    {
      id: 'BR-01',
      code: 'ISB-HQ',
      name: 'Islamabad Head Office',
      city: 'Islamabad',
      country: 'Pakistan',
      address: 'Suite 401-404, Harmain Tower, Jinnah Avenue, Blue Area',
      phone: '+92 51 8849200',
      manager: 'Muhammad Usman Tariq',
      isHeadOffice: true,
      staffCount: 18,
      status: 'Active'
    },
    {
      id: 'BR-02',
      code: 'KHI-01',
      name: 'Karachi Executive Branch',
      city: 'Karachi',
      country: 'Pakistan',
      address: 'Executive Tower, Clifton Block 9',
      phone: '+92 21 3584910',
      manager: 'Syed Farhan Ali',
      isHeadOffice: false,
      staffCount: 9,
      status: 'Active'
    },
    {
      id: 'BR-03',
      code: 'LHE-01',
      name: 'Lahore Mall Branch',
      city: 'Lahore',
      country: 'Pakistan',
      address: 'Main Boulevard, Gulberg III',
      phone: '+92 42 3578901',
      manager: 'Kamran Siddiqui',
      isHeadOffice: false,
      staffCount: 8,
      status: 'Active'
    },
    {
      id: 'BR-04',
      code: 'MAK-01',
      name: 'Makkah Al-Mukarramah Operations',
      city: 'Makkah',
      country: 'Saudi Arabia',
      address: 'Al-Siteen Street, Near Al-Shohada',
      phone: '+966 12 5421098',
      manager: 'Sheikh Tariq Al-Mansoor',
      isHeadOffice: false,
      staffCount: 14,
      status: 'Active'
    },
    {
      id: 'BR-05',
      code: 'MED-01',
      name: 'Madinah Al-Munawwarah Operations',
      city: 'Madinah',
      country: 'Saudi Arabia',
      address: 'Northern Central Area, Near Gate 25',
      phone: '+966 14 8210987',
      manager: 'Hamza Abdul Rahman',
      isHeadOffice: false,
      staffCount: 10,
      status: 'Active'
    }
  ],

  users: [
    {
      id: 'USR-01',
      name: 'Dr. Tariq Al-Harmain',
      email: 'admin@harmain.com',
      passwordHash: adminPasswordHash,
      role: 'Super Admin',
      branchId: 'BR-01',
      phone: '+92 300 8501234',
      status: 'Active',
      permissions: ['ALL']
    },
    {
      id: 'USR-02',
      name: 'Muhammad Usman Tariq',
      email: 'manager@harmain.com',
      passwordHash: defaultPasswordHash,
      role: 'Branch Manager',
      branchId: 'BR-01',
      phone: '+92 300 8505678',
      status: 'Active',
      permissions: ['BOOKINGS', 'PILGRIMS', 'FINANCE', 'REPORTS', 'OPERATIONS']
    },
    {
      id: 'USR-03',
      name: 'Ayesha Siddiqua',
      email: 'consultant@harmain.com',
      passwordHash: defaultPasswordHash,
      role: 'Travel Consultant',
      branchId: 'BR-01',
      phone: '+92 321 4455667',
      status: 'Active',
      permissions: ['BOOKINGS', 'PILGRIMS', 'PACKAGES', 'FLIGHTS', 'DOCUMENTS']
    },
    {
      id: 'USR-04',
      name: 'Zubair Ahmed Qureshi',
      email: 'visa@harmain.com',
      passwordHash: defaultPasswordHash,
      role: 'Visa Officer',
      branchId: 'BR-01',
      phone: '+92 333 9988776',
      status: 'Active',
      permissions: ['VISAS', 'PILGRIMS', 'DOCUMENTS']
    },
    {
      id: 'USR-05',
      name: 'Rashid Mehmood, ACMA',
      email: 'finance@harmain.com',
      passwordHash: defaultPasswordHash,
      role: 'Accountant',
      branchId: 'BR-01',
      phone: '+92 345 5566778',
      status: 'Active',
      permissions: ['FINANCE', 'ACCOUNTS', 'PAYMENTS', 'EXPENSES', 'SUPPLIERS', 'REPORTS']
    },
    {
      id: 'USR-06',
      name: 'Haji Abdul Qayyum',
      email: 'pilgrim@harmain.com',
      passwordHash: defaultPasswordHash,
      role: 'Customer',
      branchId: 'BR-01',
      phone: '+92 300 1122334',
      status: 'Active',
      permissions: ['PORTAL']
    }
  ],

  packages: [
    {
      id: 'PKG-HAJ-01',
      type: 'Hajj',
      code: 'HAJ-1447-PLT',
      title: 'Executive Non-Shifting Platinum Hajj 1447H',
      year: 1447,
      category: 'Platinum 5-Star VIP',
      shiftingType: 'Non-Shifting',
      durationDays: 21,
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      makkahNights: 10,
      madinahHotel: 'The Oberoi Madinah',
      madinahNights: 8,
      maktabNumber: 'Maktab 01 (VIP Zone A)',
      minaTentType: 'VIP Air-Conditioned Gypsum-Board Tents with Sofa Beds',
      arafatFacility: 'Air-Conditioned Marquees with Buffet Catering',
      transportType: 'Private Luxury Mercedes Pullman Coasters',
      foodBoard: 'Full Board (Buffet 3 Meals)',
      qurbaniIncluded: true,
      ziyaratIncluded: true,
      zamzamProvided: true,
      totalSeats: 60,
      bookedSeats: 48,
      costPricePKR: 2850000,
      sellingPricePKR: 3450000,
      costPriceSAR: 38255,
      sellingPriceSAR: 46308,
      sellingPriceUSD: 12387,
      status: 'Available',
      description: 'Exclusive, premier non-shifting Hajj experience with 0-meter courtyard access in Makkah and Madinah and VIP Maktab 1.'
    },
    {
      id: 'PKG-HAJ-02',
      type: 'Hajj',
      code: 'HAJ-1447-GLD',
      title: 'Classic Shifting Gold Hajj 1447H',
      year: 1447,
      category: 'Gold 5-Star / 4-Star',
      shiftingType: 'Shifting',
      durationDays: 30,
      makkahHotel: 'Swissôtel Al Maqam Makkah + Aziziyah Building',
      makkahNights: 14,
      madinahHotel: 'Dar Al Taqwa Hotel Madinah',
      madinahNights: 8,
      maktabNumber: 'Maktab 04 (Zone B)',
      minaTentType: 'Standard A/C Tents with Mattress & Pillow',
      arafatFacility: 'Standard German Tents with Food Packets',
      transportType: 'SAPTCO VIP AC Coaches',
      foodBoard: 'Half Board (Breakfast & Dinner)',
      qurbaniIncluded: true,
      ziyaratIncluded: true,
      zamzamProvided: true,
      totalSeats: 120,
      bookedSeats: 94,
      costPricePKR: 2100000,
      sellingPricePKR: 2550000,
      costPriceSAR: 28187,
      sellingPriceSAR: 34228,
      sellingPriceUSD: 9156,
      status: 'Available',
      description: 'Well-balanced Hajj package combining luxury Clock Tower stay before Hajj, Azizia stay during Manasik, and courtyard hotel in Madinah.'
    },
    {
      id: 'PKG-UMR-01',
      type: 'Umrah',
      code: 'UMR-2026-RAM-LAST10',
      title: 'Ramadan 2026 - Last 10 Days Itikaf Luxury',
      category: '5-Star Luxury Haram Front',
      durationDays: 14,
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      makkahNights: 9,
      madinahHotel: 'Anwar Al Madinah Mövenpick',
      madinahNights: 5,
      transportType: 'Private GMC Yukon XL / Haramain Bullet Train VIP',
      foodBoard: 'Suhoor & Iftar Buffet',
      ziyaratIncluded: true,
      zamzamProvided: true,
      totalSeats: 80,
      bookedSeats: 62,
      costPricePKR: 890000,
      sellingPricePKR: 1150000,
      costPriceSAR: 11946,
      sellingPriceSAR: 15436,
      sellingPriceUSD: 4129,
      sharingTiers: {
        double: 1250000,
        triple: 1150000,
        quad: 1050000
      },
      status: 'Available',
      description: 'Spend Laylatul Qadr and Eid in the Haramain with elite hospitality, Suhoor & Iftar buffets, and private airport VIP reception.'
    },
    {
      id: 'PKG-UMR-02',
      type: 'Umrah',
      code: 'UMR-2026-FAM-14D',
      title: 'Premium Family Umrah 14-Day Package',
      category: '5-Star Clock Tower & Courtyard',
      durationDays: 14,
      makkahHotel: 'Swissôtel Al Maqam Makkah',
      makkahNights: 8,
      madinahHotel: 'Frontel Al Harithia Hotel',
      madinahNights: 6,
      transportType: 'Private Toyota Coaster VIP / HiAce',
      foodBoard: 'Breakfast Buffet Included',
      ziyaratIncluded: true,
      zamzamProvided: true,
      totalSeats: 150,
      bookedSeats: 118,
      costPricePKR: 540000,
      sellingPricePKR: 695000,
      costPriceSAR: 7248,
      sellingPriceSAR: 9328,
      sellingPriceUSD: 2495,
      sharingTiers: {
        double: 780000,
        triple: 695000,
        quad: 620000,
        sharing: 560000
      },
      status: 'Available',
      description: 'Our top-rated family package with walking distance to both Holy Harams, comprehensive guided Ziyarat, and round-trip transfers.'
    },
    {
      id: 'PKG-UMR-03',
      type: 'Umrah',
      code: 'UMR-2026-ECO-15D',
      title: 'Economy Comfort 15-Day Umrah',
      category: '4-Star with Shuttle Bus',
      durationDays: 15,
      makkahHotel: 'Voco Makkah an IHG Hotel',
      makkahNights: 8,
      madinahHotel: 'Taiba Front Hotel',
      madinahNights: 7,
      transportType: 'AC Coach Group Bus',
      foodBoard: 'Room Only (Buffet Optional)',
      ziyaratIncluded: true,
      zamzamProvided: true,
      totalSeats: 200,
      bookedSeats: 165,
      costPricePKR: 360000,
      sellingPricePKR: 445000,
      costPriceSAR: 4832,
      sellingPriceSAR: 5973,
      sellingPriceUSD: 1597,
      sharingTiers: {
        double: 495000,
        triple: 460000,
        quad: 445000,
        sharing: 410000
      },
      status: 'Available',
      description: 'High-value economy package featuring the comfortable Voco Makkah with 24/7 dedicated air-conditioned shuttle to Haram Kudai gate.'
    }
  ],

  hotels: [
    {
        "id": "HTL-MAK-01",
        "name": "Fairmont Makkah Clock Royal Tower",
        "city": "Makkah",
        "starRating": 5,
        "courtyardDistanceMeters": 0,
        "locationDescription": "Abraj Al Bait Complex, Directly in front of King Abdulaziz Gate",
        "contactPerson": "Adel Al-Ghamdi (Director of Sales)",
        "phone": "+966 12 571 7777",
        "email": "makkah.reservations@fairmont.com",
        "contractType": "Corporate Master Allotment",
        "totalContractedRooms": 45,
        "allocatedRooms": 38,
        "coverImage": "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
        "gallery": [
            {
                "url": "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
                "category": "Views",
                "title": "Holy Kaaba & Mataf Courtyard View",
                "description": "Panoramic view of the Holy Kaaba and Mataf courtyard directly from suite windows."
            },
            {
                "url": "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200&q=80",
                "category": "Exterior",
                "title": "Makkah Clock Royal Tower Facade",
                "description": "Iconic Clock Royal Tower soaring 601 meters above the Holy Haram."
            },
            {
                "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
                "category": "Lobby",
                "title": "Grand Royal Reception & Lounge",
                "description": "Opulent marble entrance, dedicated group concierge, and complimentary chilled Zamzam fountain."
            },
            {
                "url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Presidential Kaaba View Suite",
                "description": "Plush king-sized bed with automated blackout curtains and live Haram prayer audio."
            },
            {
                "url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Deluxe Haram View Double Room",
                "description": "Contemporary Arabian luxury double bedroom with direct Haram courtyard sightlines."
            },
            {
                "url": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Executive Twin Bedroom",
                "description": "Two orthopedic single beds, work desk, and high-speed Wi-Fi."
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
                "category": "Bathrooms",
                "title": "Italian Marble Bath & Soaking Tub",
                "description": "Deep soaking bathtub, separate glass rainfall shower, and luxury aromatherapy bath amenities."
            },
            {
                "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
                "category": "Facilities",
                "title": "Al Dira International Buffet Restaurant",
                "description": "Extensive multi-cuisine dining serving Suhoor, Iftar, and international breakfast buffets."
            }
        ],
        "roomCategories": [
            {
                "name": "Presidential Kaaba View Suite",
                "capacity": 2,
                "bedType": "1 King Bed",
                "view": "Direct Holy Kaaba View",
                "rateSAR": 2200,
                "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80"
            },
            {
                "name": "Deluxe Haram View Double",
                "capacity": 2,
                "bedType": "2 Single / 1 Double",
                "view": "Grand Mosque Courtyard",
                "rateSAR": 1600,
                "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"
            },
            {
                "name": "Signature Twin Room",
                "capacity": 2,
                "bedType": "2 Single Beds",
                "view": "City / Complex View",
                "rateSAR": 1200,
                "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
            },
            {
                "name": "Family Quad Suite",
                "capacity": 4,
                "bedType": "4 Single Beds",
                "view": "Courtyard Partial View",
                "rateSAR": 2800,
                "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
            }
        ],
        "amenities": [
            "Direct Haram Courtyard Access",
            "Kaaba View Suites",
            "9 International Restaurants",
            "Complimentary Zamzam",
            "Dedicated Group Check-in Lounge",
            "Wheelchair Assistance"
        ],
        "rates": {
            "standardSAR": 1200,
            "haramViewSAR": 1600,
            "kaabaViewSAR": 2200,
            "ramadanSAR": 3800
        },
        "status": "Active"
    },
    {
        "id": "HTL-MAK-02",
        "name": "Swissôtel Al Maqam Makkah",
        "city": "Makkah",
        "starRating": 5,
        "courtyardDistanceMeters": 0,
        "locationDescription": "King Abdul Aziz Endowment, Ibrahim Al Khalil St",
        "contactPerson": "Sami Bin Qasim",
        "phone": "+966 12 577 5555",
        "email": "reservations.almaqam@swissotel.com",
        "contractType": "Guaranteed Block Allotment",
        "totalContractedRooms": 50,
        "allocatedRooms": 42,
        "coverImage": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
        "gallery": [
            {
                "url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                "category": "Exterior",
                "title": "Swissôtel Tower Grand Facade",
                "description": "Prominent facade overlooking the Ibrahim Al Khalil Street entrance to the Grand Mosque."
            },
            {
                "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
                "category": "Lobby",
                "title": "Modern Swiss-Arabian Lobby",
                "description": "Spacious reception lounge with express check-in kiosks and Arabian welcome hospitality."
            },
            {
                "url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Classic King Haram View Room",
                "description": "Elegantly furnished king room with warm timber tones and courtyard sightlines."
            },
            {
                "url": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Family Quad Room (4 Single Beds)",
                "description": "Ideal for family pilgrim groups, featuring 4 comfortable single beds."
            },
            {
                "url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
                "category": "Bathrooms",
                "title": "Contemporary Glass Rain Shower",
                "description": "Walk-in rainfall shower, marble washbasin, and lighted magnifying vanity mirror."
            },
            {
                "url": "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80",
                "category": "Views",
                "title": "Direct Sight of Grand Mosque",
                "description": "Direct elevated view over the courtyard and minarets of Masjid al-Haram."
            },
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
                "category": "Facilities",
                "title": "Al-Khairat International Buffet",
                "description": "Grand dining hall catering to up to 2,000 guests with live cooking stations."
            }
        ],
        "roomCategories": [
            {
                "name": "Classic King Haram View",
                "capacity": 2,
                "bedType": "1 King Bed",
                "view": "Haram View",
                "rateSAR": 1350,
                "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"
            },
            {
                "name": "Deluxe Twin Room",
                "capacity": 2,
                "bedType": "2 Single Beds",
                "view": "Courtyard View",
                "rateSAR": 950,
                "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
            },
            {
                "name": "Family Quad Room",
                "capacity": 4,
                "bedType": "4 Single Beds",
                "view": "City / Complex",
                "rateSAR": 1800,
                "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
            }
        ],
        "amenities": [
            "Direct Mall & Courtyard Access",
            "Al-Khairat Buffet",
            "High Speed WiFi",
            "24h Room Service"
        ],
        "rates": {
            "standardSAR": 950,
            "haramViewSAR": 1350,
            "kaabaViewSAR": 1800,
            "ramadanSAR": 3200
        },
        "status": "Active"
    },
    {
        "id": "HTL-MAK-03",
        "name": "Voco Makkah an IHG Hotel",
        "city": "Makkah",
        "starRating": 4,
        "courtyardDistanceMeters": 1200,
        "locationDescription": "At Taqwa Street, Kudai, Makkah",
        "contactPerson": "Fahad Al-Harbi",
        "phone": "+966 12 526 8888",
        "email": "info.vocoomakkah@ihg.com",
        "contractType": "Seasonal Fixed Rate",
        "totalContractedRooms": 80,
        "allocatedRooms": 65,
        "coverImage": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
        "gallery": [
            {
                "url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
                "category": "Exterior",
                "title": "Voco Modern Towers Architecture",
                "description": "Expansive modern hotel property in Kudai with dedicated private bus bays."
            },
            {
                "url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80",
                "category": "Lobby",
                "title": "Vibrant Lobby & Shuttle Departure Hub",
                "description": "24/7 lobby lounge with quick check-in desks and direct boarding for Haram buses."
            },
            {
                "url": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Superior Modern Double Bedroom",
                "description": "Fresh, colorful, soundproof bedroom featuring ergonomic bedding and coffee station."
            },
            {
                "url": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Comfort Triple & Quad Room",
                "description": "High-capacity room configuration designed specifically for budget-conscious Umrah groups."
            },
            {
                "url": "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80",
                "category": "Bathrooms",
                "title": "Modern Ensuite Shower",
                "description": "Functional tiled bathroom with pressure shower and eco-friendly toiletries."
            },
            {
                "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
                "category": "Facilities",
                "title": "Large Dining Hall & 24/7 Shuttle Terminal",
                "description": "Dedicated buses depart every 5 minutes directly to Kudai Gate of Masjid al-Haram."
            }
        ],
        "roomCategories": [
            {
                "name": "Superior Double Room",
                "capacity": 2,
                "bedType": "2 Single / 1 Double",
                "view": "City View",
                "rateSAR": 420,
                "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
            },
            {
                "name": "Triple Sharing Room",
                "capacity": 3,
                "bedType": "3 Single Beds",
                "view": "City View",
                "rateSAR": 520,
                "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
            },
            {
                "name": "Family Quad Room",
                "capacity": 4,
                "bedType": "4 Single Beds",
                "view": "City View",
                "rateSAR": 600,
                "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
            }
        ],
        "amenities": [
            "24/7 Dedicated Haram Shuttle Bus (Every 5 mins)",
            "Spacious Modern Rooms",
            "Large Dining Hall",
            "Luggage Porterage"
        ],
        "rates": {
            "standardSAR": 420,
            "tripleSAR": 520,
            "quadSAR": 600,
            "ramadanSAR": 1400
        },
        "status": "Active"
    },
    {
        "id": "HTL-MED-01",
        "name": "The Oberoi Madinah",
        "city": "Madinah",
        "starRating": 5,
        "courtyardDistanceMeters": 0,
        "locationDescription": "Directly on Northern Courtyard, Opposite Ladies Gate 25 & Main Gate",
        "contactPerson": "Khurram Shehzad (Group Sales)",
        "phone": "+966 14 828 2222",
        "email": "reservations.med@oberoihotels.com",
        "contractType": "VIP Master Allotment",
        "totalContractedRooms": 35,
        "allocatedRooms": 30,
        "coverImage": "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=1200&q=80",
        "gallery": [
            {
                "url": "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=1200&q=80",
                "category": "Views",
                "title": "Prophet's Mosque Courtyard & Green Dome View",
                "description": "Direct view of the sacred Green Dome and courtyard umbrellas right from your window."
            },
            {
                "url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                "category": "Exterior",
                "title": "The Oberoi Madinah Palatial Facade",
                "description": "Zero-meter front courtyard hotel facing Gate 25 for effortless prayer access."
            },
            {
                "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
                "category": "Lobby",
                "title": "Royal Palatial Lobby & Persian Carpets",
                "description": "World-renowned lobby decorated with hand-crafted carpets, gold leafing, and Arabian dates."
            },
            {
                "url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Royal Suite (Mosque Front View)",
                "description": "Opulent suite with private dining area and front-facing views of the Prophet's Mosque."
            },
            {
                "url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Executive Haram Double Room",
                "description": "Custom teak furnishings, silk cushions, and direct audio link to rawdah prayers."
            },
            {
                "url": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Deluxe Courtyard Twin Room",
                "description": "Two plush beds overlooking the tranquil Madinah piazza."
            },
            {
                "url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1200&q=80",
                "category": "Bathrooms",
                "title": "Golden Marble Bathroom with Deep Tub",
                "description": "Finest Italian marble vanity with deep soak tub and luxury brass fixtures."
            },
            {
                "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
                "category": "Facilities",
                "title": "Al-Ansar Gourmet Restaurant & Butler Lounge",
                "description": "Exceptional dining offering Continental, South Asian, and Middle Eastern specialities."
            }
        ],
        "roomCategories": [
            {
                "name": "Royal Suite (Green Dome View)",
                "capacity": 2,
                "bedType": "1 King Bed",
                "view": "Prophet's Mosque Front",
                "rateSAR": 2100,
                "image": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80"
            },
            {
                "name": "Executive Haram View Double",
                "capacity": 2,
                "bedType": "2 Single / 1 Double",
                "view": "Northern Courtyard",
                "rateSAR": 1400,
                "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"
            },
            {
                "name": "Deluxe Twin Room",
                "capacity": 2,
                "bedType": "2 Single Beds",
                "view": "Courtyard View",
                "rateSAR": 1100,
                "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
            }
        ],
        "amenities": [
            "Zero Distance to Prophet Mosque Courtyard",
            "Al-Ansar Restaurant",
            "Private Butler Service",
            "Executive Business Center"
        ],
        "rates": {
            "standardSAR": 1400,
            "prophetMosqueViewSAR": 2100,
            "ramadanSAR": 3900
        },
        "status": "Active"
    },
    {
        "id": "HTL-MED-02",
        "name": "Dar Al Taqwa Hotel Madinah",
        "city": "Madinah",
        "starRating": 5,
        "courtyardDistanceMeters": 0,
        "locationDescription": "Off King Fahd Gate, North Central Haram Courtyard",
        "contactPerson": "Hassan Mansoor",
        "phone": "+966 14 829 1111",
        "email": "info@daraltaqwahotel.com",
        "contractType": "Corporate Allotment",
        "totalContractedRooms": 40,
        "allocatedRooms": 32,
        "coverImage": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=80",
        "gallery": [
            {
                "url": "https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?w=1200&q=80",
                "category": "Views",
                "title": "Courtyard Umbrella Canopy View",
                "description": "Direct view of the magnificent opening and closing umbrellas of the Prophet's Mosque."
            },
            {
                "url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
                "category": "Exterior",
                "title": "Dar Al Taqwa Courtyard Entrance",
                "description": "Step right out from the hotel lobby directly onto the marble courtyard of the Prophet's Mosque."
            },
            {
                "url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
                "category": "Lobby",
                "title": "Warm Arabian Hospitality Lobby",
                "description": "Elegant lounge serving complimentary Saudi coffee, organic Madinah dates, and tea."
            },
            {
                "url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Executive Double Room",
                "description": "Comfortable double room with premium carpets, high-speed internet, and prayer rugs."
            },
            {
                "url": "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
                "category": "Bathrooms",
                "title": "Marble Bathroom with Rain Shower",
                "description": "Modern walk-in glass shower, plush bathrobes, and slippers."
            },
            {
                "url": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80",
                "category": "Facilities",
                "title": "Al Marwa Tea Garden & Dining",
                "description": "Relaxed dining environment overlooking the Prophet's Mosque courtyard."
            }
        ],
        "roomCategories": [
            {
                "name": "Executive Courtyard View Double",
                "capacity": 2,
                "bedType": "1 King Bed",
                "view": "Courtyard View",
                "rateSAR": 1650,
                "image": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80"
            },
            {
                "name": "Standard Twin Room",
                "capacity": 2,
                "bedType": "2 Single Beds",
                "view": "City / North View",
                "rateSAR": 1100,
                "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
            }
        ],
        "amenities": [
            "Courtyard Front Facing",
            "Al Marwa Tea Lounge",
            "Al Qaza Tea Garden",
            "Complimentary Arabic Dates & Coffee"
        ],
        "rates": {
            "standardSAR": 1100,
            "haramViewSAR": 1650,
            "ramadanSAR": 3100
        },
        "status": "Active"
    },
    {
        "id": "HTL-MED-03",
        "name": "Frontel Al Harithia Hotel",
        "city": "Madinah",
        "starRating": 5,
        "courtyardDistanceMeters": 150,
        "locationDescription": "Central Markazia Area, Northern Gate proximity",
        "contactPerson": "Waleed Al-Otaibi",
        "phone": "+966 14 820 0111",
        "email": "frontel.madinah@alharithia.com",
        "contractType": "Standard Contract",
        "totalContractedRooms": 60,
        "allocatedRooms": 51,
        "coverImage": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
        "gallery": [
            {
                "url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80",
                "category": "Exterior",
                "title": "Frontel Al Harithia Markazia Building",
                "description": "Situated in the central Markazia district, a short 2-minute stroll to Gate 21."
            },
            {
                "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
                "category": "Lobby",
                "title": "Spacious Central Markazia Reception",
                "description": "Quick-service check-in with 6 high-speed elevators for seamless prayer times."
            },
            {
                "url": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Superior Family Triple Room",
                "description": "Equipped with 3 full-sized beds, flat-screen TV, mini-fridge, and prayer directional marker."
            },
            {
                "url": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80",
                "category": "Bedrooms",
                "title": "Quad Bedded Family Room",
                "description": "Spacious accommodation for 4 pilgrims with separate wardrobe space."
            },
            {
                "url": "https://images.unsplash.com/photo-1620626011761-996317b8d101?w=1200&q=80",
                "category": "Bathrooms",
                "title": "Modern Ensuite Vanity & Shower",
                "description": "Clean modern bathroom with combined bathtub and shower."
            },
            {
                "url": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
                "category": "Facilities",
                "title": "Al-Riyadh Dining Hall & Gym",
                "description": "Comprehensive breakfast and dinner buffets catering to international pilgrims."
            }
        ],
        "roomCategories": [
            {
                "name": "Standard Double Room",
                "capacity": 2,
                "bedType": "2 Single Beds",
                "view": "City View",
                "rateSAR": 750,
                "image": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
            },
            {
                "name": "Family Triple Room",
                "capacity": 3,
                "bedType": "3 Single Beds",
                "view": "Markazia View",
                "rateSAR": 920,
                "image": "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80"
            },
            {
                "name": "Family Quad Room",
                "capacity": 4,
                "bedType": "4 Single Beds",
                "view": "Markazia View",
                "rateSAR": 1080,
                "image": "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80"
            }
        ],
        "amenities": [
            "Short 2-Min Walk to Courtyard",
            "Fitness Center",
            "Multiple Elevators for Quick Prayer Access"
        ],
        "rates": {
            "standardSAR": 750,
            "tripleSAR": 920,
            "quadSAR": 1080,
            "ramadanSAR": 2200
        },
        "status": "Active"
    }
],

  rooms: [
    {
      id: 'RM-MAK-1204',
      hotelId: 'HTL-MAK-01',
      hotelName: 'Fairmont Makkah Clock Royal Tower',
      roomNumber: '1204',
      floor: 12,
      type: 'Double (Kaaba View)',
      capacity: 2,
      occupiedBeds: 2,
      assignedPilgrims: [
        { pilgrimId: 'HRM-PLG-2026-0001', name: 'Haji Abdul Qayyum', gender: 'Male' },
        { pilgrimId: 'HRM-PLG-2026-0002', name: 'Begum Parveen Akhtar', gender: 'Female' }
      ],
      checkInDate: '2026-11-12',
      checkOutDate: '2026-11-21',
      status: 'Occupied'
    },
    {
      id: 'RM-MAK-1408',
      hotelId: 'HTL-MAK-01',
      hotelName: 'Fairmont Makkah Clock Royal Tower',
      roomNumber: '1408',
      floor: 14,
      type: 'Triple (Haram View)',
      capacity: 3,
      occupiedBeds: 3,
      assignedPilgrims: [
        { pilgrimId: 'HRM-PLG-2026-0003', name: 'Chaudhry Muhammad Aslam', gender: 'Male' },
        { pilgrimId: 'HRM-PLG-2026-0004', name: 'Mrs. Kaneez Fatima', gender: 'Female' },
        { pilgrimId: 'HRM-PLG-2026-0005', name: 'Hamza Aslam (Son)', gender: 'Male' }
      ],
      checkInDate: '2026-11-12',
      checkOutDate: '2026-11-21',
      status: 'Occupied'
    },
    {
      id: 'RM-MAK-1601',
      hotelId: 'HTL-MAK-02',
      hotelName: 'Swissôtel Al Maqam Makkah',
      roomNumber: '1601',
      floor: 16,
      type: 'Quad (Standard)',
      capacity: 4,
      occupiedBeds: 2,
      assignedPilgrims: [
        { pilgrimId: 'HRM-PLG-2026-0006', name: 'Tariq Javed', gender: 'Male' },
        { pilgrimId: 'HRM-PLG-2026-0007', name: 'Bilal Javed', gender: 'Male' }
      ],
      checkInDate: '2026-11-15',
      checkOutDate: '2026-11-25',
      status: 'Partially Available'
    },
    {
      id: 'RM-MED-305',
      hotelId: 'HTL-MED-01',
      hotelName: 'The Oberoi Madinah',
      roomNumber: '305',
      floor: 3,
      type: 'Double (Haram View)',
      capacity: 2,
      occupiedBeds: 2,
      assignedPilgrims: [
        { pilgrimId: 'HRM-PLG-2026-0001', name: 'Haji Abdul Qayyum', gender: 'Male' },
        { pilgrimId: 'HRM-PLG-2026-0002', name: 'Begum Parveen Akhtar', gender: 'Female' }
      ],
      checkInDate: '2026-11-21',
      checkOutDate: '2026-11-26',
      status: 'Occupied'
    },
    {
      id: 'RM-MED-410',
      hotelId: 'HTL-MED-02',
      hotelName: 'Dar Al Taqwa Hotel Madinah',
      roomNumber: '410',
      floor: 4,
      type: 'Double (Standard)',
      capacity: 2,
      occupiedBeds: 0,
      assignedPilgrims: [],
      checkInDate: '2026-11-20',
      checkOutDate: '2026-11-27',
      status: 'Available'
    }
  ],

  flights: [
    {
      id: 'FLT-01',
      airlineCode: 'SV',
      airlineName: 'Saudi Arabian Airlines (Saudia)',
      flightNumber: 'SV-739',
      aircraft: 'Boeing 777-300ER',
      originAirport: 'ISB (Islamabad International)',
      destinationAirport: 'JED (King Abdulaziz International, Terminal 1)',
      departureDateTime: '2026-11-12T04:30:00.000Z',
      arrivalDateTime: '2026-11-12T08:15:00.000Z',
      transit: 'Direct (Non-stop)',
      baggageAllowance: '2 x 23 KG Bags + 7 KG Hand Carry + 5L Zamzam',
      totalBlockSeats: 60,
      confirmedSeats: 48,
      availableSeats: 12,
      costPricePerSeatPKR: 198000,
      sellingPricePerSeatPKR: 245000,
      status: 'Scheduled'
    },
    {
      id: 'FLT-02',
      airlineCode: 'SV',
      airlineName: 'Saudi Arabian Airlines (Saudia)',
      flightNumber: 'SV-738',
      aircraft: 'Boeing 777-300ER',
      originAirport: 'JED (King Abdulaziz International, Terminal 1)',
      destinationAirport: 'ISB (Islamabad International)',
      departureDateTime: '2026-11-26T11:45:00.000Z',
      arrivalDateTime: '2026-11-26T19:00:00.000Z',
      transit: 'Direct (Non-stop)',
      baggageAllowance: '2 x 23 KG Bags + 7 KG Hand Carry + 5L Zamzam',
      totalBlockSeats: 60,
      confirmedSeats: 48,
      availableSeats: 12,
      costPricePerSeatPKR: 198000,
      sellingPricePerSeatPKR: 245000,
      status: 'Scheduled'
    },
    {
      id: 'FLT-03',
      airlineCode: 'PK',
      airlineName: 'Pakistan International Airlines (PIA)',
      flightNumber: 'PK-741',
      aircraft: 'Boeing 777-200ER',
      originAirport: 'KHI (Jinnah International Karachi)',
      destinationAirport: 'MED (Prince Mohammad Bin Abdulaziz Madinah)',
      departureDateTime: '2026-11-14T07:15:00.000Z',
      arrivalDateTime: '2026-11-14T10:45:00.000Z',
      transit: 'Direct (Non-stop)',
      baggageAllowance: '2 x 23 KG + 7 KG Hand Carry + 5L Zamzam',
      totalBlockSeats: 40,
      confirmedSeats: 35,
      availableSeats: 5,
      costPricePerSeatPKR: 185000,
      sellingPricePerSeatPKR: 230000,
      status: 'Scheduled'
    },
    {
      id: 'FLT-04',
      airlineCode: 'XY',
      airlineName: 'Flynas',
      flightNumber: 'XY-318',
      aircraft: 'Airbus A320neo',
      originAirport: 'LHE (Allama Iqbal International Lahore)',
      destinationAirport: 'JED (King Abdulaziz International, Terminal 1)',
      departureDateTime: '2026-11-16T15:20:00.000Z',
      arrivalDateTime: '2026-11-16T19:30:00.000Z',
      transit: 'Direct',
      baggageAllowance: '30 KG Checked + 7 KG Hand + 5L Zamzam',
      totalBlockSeats: 50,
      confirmedSeats: 42,
      availableSeats: 8,
      costPricePerSeatPKR: 172000,
      sellingPricePerSeatPKR: 215000,
      status: 'Scheduled'
    }
  ],

  pnrs: [
    {
      id: 'PNR-01',
      pnrCode: 'SV79KX',
      airline: 'Saudia (SV)',
      flightNumbers: ['SV-739', 'SV-738'],
      bookingRef: 'HRM-BK-2026-0001',
      passengerCount: 2,
      passengers: ['Abdul Qayyum', 'Parveen Akhtar'],
      issueDate: '2026-11-01',
      ticketNumbers: ['065-2490182910', '065-2490182911'],
      supplier: 'Saudia Direct Consolidator',
      purchasePricePKR: 396000,
      sellingPricePKR: 490000,
      marginPKR: 94000,
      status: 'Ticketed & Confirmed'
    },
    {
      id: 'PNR-02',
      pnrCode: 'PK882J',
      airline: 'PIA (PK)',
      flightNumbers: ['PK-741', 'PK-742'],
      bookingRef: 'HRM-BK-2026-0002',
      passengerCount: 3,
      passengers: ['Muhammad Aslam', 'Kaneez Fatima', 'Hamza Aslam'],
      issueDate: '2026-11-03',
      ticketNumbers: ['214-9912048121', '214-9912048122', '214-9912048123'],
      supplier: 'Travelport GDS Pakistan',
      purchasePricePKR: 555000,
      sellingPricePKR: 690000,
      marginPKR: 135000,
      status: 'Ticketed & Confirmed'
    },
    {
      id: 'PNR-03',
      pnrCode: 'XY449T',
      airline: 'Flynas (XY)',
      flightNumbers: ['XY-318', 'XY-319'],
      bookingRef: 'HRM-BK-2026-0003',
      passengerCount: 2,
      passengers: ['Tariq Javed', 'Bilal Javed'],
      issueDate: '2026-11-04',
      ticketNumbers: ['429-1002948190', '429-1002948191'],
      supplier: 'Flynas KSA Direct Agent',
      purchasePricePKR: 344000,
      sellingPricePKR: 430000,
      marginPKR: 86000,
      status: 'Ticketed & Confirmed'
    }
  ],

  vehicles: [
    {
        "id": "VEH-01",
        "vehicleName": "GMC Yukon XL Denali 2025",
        "type": "VIP Luxury SUV",
        "registrationPlate": "4892 KSA",
        "seatingCapacity": 7,
        "luggageCapacity": "6 Large Bags",
        "supplier": "Harmain Executive Fleet KSA",
        "dailyRateSAR": 1200,
        "image": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
        "amenities": [
            "Leather Interior",
            "Complimentary WiFi",
            "Chilled Zamzam & Refreshments",
            "English/Urdu/Arabic Speaking Chauffeur"
        ],
        "status": "Assigned",
        "currentDriver": "Tariq Al-Otaibi"
    },
    {
        "id": "VEH-02",
        "vehicleName": "Toyota Coaster Luxury 2024",
        "type": "Executive Minibus",
        "registrationPlate": "1823 KSA",
        "seatingCapacity": 28,
        "luggageCapacity": "25 Bags",
        "supplier": "Al-Jazeera Transport Co.",
        "dailyRateSAR": 1600,
        "image": "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80",
        "amenities": [
            "High-roof A/C",
            "Microphone System for Tour Guide / Ameer",
            "Reclining Seats"
        ],
        "status": "Available",
        "currentDriver": "Muhammad Saeed"
    },
    {
        "id": "VEH-03",
        "vehicleName": "Toyota HiAce Grand Cabin 2024",
        "type": "Commuter Van",
        "registrationPlate": "3391 KSA",
        "seatingCapacity": 13,
        "luggageCapacity": "10 Bags",
        "supplier": "Harmain Ground Services",
        "dailyRateSAR": 950,
        "image": "https://images.unsplash.com/photo-1559297434-fae8a1916a79?w=1200&q=80",
        "amenities": [
            "High Roof AC",
            "Luggage Carrier",
            "USB Charging Ports",
            "Rear Passenger Climate Control"
        ],
        "status": "Available",
        "currentDriver": "Faisal Mehmood"
    },
    {
        "id": "VEH-04",
        "vehicleName": "Mercedes-Benz VIP Sprinter 2024",
        "type": "Luxury Van",
        "registrationPlate": "7721 KSA",
        "seatingCapacity": 14,
        "luggageCapacity": "12 Bags",
        "supplier": "Harmain Executive Fleet KSA",
        "dailyRateSAR": 1500,
        "image": "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?w=1200&q=80",
        "amenities": [
            "Captains Chairs",
            "USB Chargers at Each Seat",
            "Privacy Curtains",
            "Overhead LED Mood Lighting"
        ],
        "status": "Assigned",
        "currentDriver": "Bilal Ahmed"
    },
    {
        "id": "VEH-05",
        "vehicleName": "Cadillac Escalade ESV Platinum 2025",
        "type": "Luxury SUV",
        "registrationPlate": "6602 KSA",
        "seatingCapacity": 7,
        "luggageCapacity": "6 Large Bags",
        "supplier": "Harmain Executive Fleet KSA",
        "dailyRateSAR": 1450,
        "image": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
        "amenities": [
            "AKG Studio Audio",
            "Semi-Aniline Leather",
            "Rear Seat Screens",
            "Chilled Zamzam Bottle Service"
        ],
        "status": "Available",
        "currentDriver": "Zubair Al-Ghamdi"
    },
    {
        "id": "VEH-06",
        "vehicleName": "Mercedes-Benz S-Class S580 2025",
        "type": "VIP Executive Sedan",
        "registrationPlate": "1111 KSA",
        "seatingCapacity": 4,
        "luggageCapacity": "3 Bags",
        "supplier": "Harmain Royal Protocol Fleet",
        "dailyRateSAR": 2200,
        "image": "https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&q=80",
        "amenities": [
            "Executive Rear Reclining Seats",
            "Massage Function",
            "Burmester 4D Sound",
            "Airport VIP Apron Meet & Assist"
        ],
        "status": "Available",
        "currentDriver": "Sultan Al-Harbi"
    },
    {
        "id": "VEH-07",
        "vehicleName": "Toyota Camry Hybrid Executive 2024",
        "type": "Executive Sedan",
        "registrationPlate": "5428 KSA",
        "seatingCapacity": 4,
        "luggageCapacity": "3 Bags",
        "supplier": "Al-Haramain Express Cabs",
        "dailyRateSAR": 550,
        "image": "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
        "amenities": [
            "Smooth Hybrid Quiet Ride",
            "Dual Air Conditioning",
            "Clean Executive Interior"
        ],
        "status": "Available",
        "currentDriver": "Kareemullah Khan"
    },
    {
        "id": "VEH-08",
        "vehicleName": "SAPTCO VIP Luxury Coach 2025",
        "type": "Luxury 50-Seater Coach",
        "registrationPlate": "9941 KSA",
        "seatingCapacity": 49,
        "luggageCapacity": "60 Large Bags",
        "supplier": "SAPTCO Official Fleet",
        "dailyRateSAR": 2800,
        "image": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
        "amenities": [
            "Onboard Restroom",
            "Dual Zone Climate Control",
            "Overhead Luggage Compartments",
            "PA System & Prayer Announcements"
        ],
        "status": "Available",
        "currentDriver": "Abdullah Al-Harbi"
    },
    {
        "id": "VEH-09",
        "vehicleName": "Hyundai Staria VIP Lounge 2024",
        "type": "Executive Van",
        "registrationPlate": "8120 KSA",
        "seatingCapacity": 7,
        "luggageCapacity": "5 Bags",
        "supplier": "Harmain Ground Services",
        "dailyRateSAR": 1100,
        "image": "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&q=80",
        "amenities": [
            "Relaxation Captain Seats",
            "Panoramic Windows",
            "Smart Power Sliding Doors"
        ],
        "status": "Available",
        "currentDriver": "Imran Qureshi"
    }
],

  drivers: [
    {
      id: 'DRV-01',
      fullName: 'Tariq Al-Otaibi',
      nationality: 'Saudi Arabian',
      iqamaNumber: '1098234190',
      licenseNumber: 'KSA-DL-492019',
      mobileNumber: '+966 54 819 0281',
      whatsapp: '+966 54 819 0281',
      languages: ['Arabic', 'Urdu', 'English'],
      assignedVehicleId: 'VEH-01',
      assignedVehicleName: 'GMC Yukon XL Denali 2025',
      rating: 4.9,
      status: 'Active'
    },
    {
      id: 'DRV-02',
      fullName: 'Muhammad Saeed',
      nationality: 'Pakistani (Saudi Resident)',
      iqamaNumber: '2489102938',
      licenseNumber: 'KSA-DL-881920',
      mobileNumber: '+966 50 771 9023',
      whatsapp: '+966 50 771 9023',
      languages: ['Urdu', 'Arabic', 'Punjabi'],
      assignedVehicleId: 'VEH-02',
      assignedVehicleName: 'Toyota Coaster Luxury 2024',
      rating: 4.8,
      status: 'Active'
    },
    {
      id: 'DRV-03',
      fullName: 'Bilal Ahmed',
      nationality: 'Pakistani',
      iqamaNumber: '2390184719',
      licenseNumber: 'KSA-DL-771928',
      mobileNumber: '+966 55 443 2190',
      whatsapp: '+966 55 443 2190',
      languages: ['Urdu', 'English', 'Pashto', 'Arabic'],
      assignedVehicleId: 'VEH-03',
      assignedVehicleName: 'Mercedes-Benz VIP Sprinter 2024',
      rating: 4.9,
      status: 'Active'
    },
    {
      id: 'DRV-04',
      fullName: 'Abdullah Al-Harbi',
      nationality: 'Saudi Arabian',
      iqamaNumber: '1029481920',
      licenseNumber: 'KSA-DL-119284',
      mobileNumber: '+966 56 129 0481',
      whatsapp: '+966 56 129 0481',
      languages: ['Arabic', 'English'],
      assignedVehicleId: 'VEH-04',
      assignedVehicleName: 'SAPTCO VIP Coach 2025',
      rating: 4.7,
      status: 'Active'
    }
  ],

  transfers: [
    {
      id: 'TRF-01',
      bookingId: 'HRM-BK-2026-0001',
      groupOrLeadName: 'Haji Abdul Qayyum & Spouse',
      transferType: 'Airport Arrival Pickup',
      pickupLocation: 'Jeddah King Abdulaziz Airport (Terminal 1)',
      dropoffLocation: 'Fairmont Makkah Clock Royal Tower',
      flightNumber: 'SV-739',
      estimatedArrival: '2026-11-12T08:15:00.000Z',
      assignedVehicle: 'GMC Yukon XL Denali 2025',
      assignedDriver: 'Tariq Al-Otaibi',
      driverPhone: '+966 54 819 0281',
      bannerSignText: 'HARMAIN ERP: HAJI ABDUL QAYYUM',
      passengerCount: 2,
      luggageCount: 4,
      status: 'Scheduled',
      notes: 'VIP Meet & Assist at immigration gate with porter'
    },
    {
      id: 'TRF-02',
      bookingId: 'HRM-BK-2026-0002',
      groupOrLeadName: 'Chaudhry Muhammad Aslam Family',
      transferType: 'Airport Arrival Pickup',
      pickupLocation: 'Madinah Prince Mohammad Airport',
      dropoffLocation: 'Dar Al Taqwa Hotel Madinah',
      flightNumber: 'PK-741',
      estimatedArrival: '2026-11-14T10:45:00.000Z',
      assignedVehicle: 'Mercedes-Benz VIP Sprinter 2024',
      assignedDriver: 'Bilal Ahmed',
      driverPhone: '+966 55 443 2190',
      bannerSignText: 'HARMAIN ERP: CHAUDHRY M. ASLAM',
      passengerCount: 3,
      luggageCount: 6,
      status: 'Scheduled',
      notes: 'Provide wheelchairs at luggage claim'
    },
    {
      id: 'TRF-03',
      bookingId: 'HRM-BK-2026-0001',
      groupOrLeadName: 'Haji Abdul Qayyum & Spouse',
      transferType: 'Inter-City Transfer',
      pickupLocation: 'Fairmont Makkah Clock Royal Tower',
      dropoffLocation: 'The Oberoi Madinah',
      flightNumber: 'Haramain Train HHR-140',
      estimatedArrival: '2026-11-21T14:30:00.000Z',
      assignedVehicle: 'Haramain High-Speed Train First Class VIP',
      assignedDriver: 'Station Chauffeur Service',
      driverPhone: '+966 50 123 4567',
      bannerSignText: 'HARMAIN ERP: HAJI ABDUL QAYYUM',
      passengerCount: 2,
      luggageCount: 4,
      status: 'Scheduled',
      notes: 'First Class bullet train tickets confirmed. Hotel-to-station transfer included.'
    }
  ],

  visas: [
    {
      id: 'HRM-VSA-2026-0001',
      pilgrimId: 'HRM-PLG-2026-0001',
      pilgrimName: 'Haji Abdul Qayyum',
      passportNumber: 'BL4920194',
      visaType: 'Umrah E-Visa (KSA Single Entry 90 Days)',
      mofaNumber: 'MOFA-9821049281',
      visaNumber: 'KSA-9941829401',
      submissionDate: '2026-10-25',
      issueDate: '2026-10-28',
      expiryDate: '2027-01-26',
      insurancePolicyNo: 'TAWUNIYA-4910298',
      stage: 'Issued & Delivered',
      agencyFeeSAR: 450,
      agencyFeePKR: 33525,
      costFeeSAR: 380,
      costFeePKR: 28310,
      profitPKR: 5215,
      tasheerStatus: 'Biometrics Completed',
      status: 'Delivered',
      notes: 'E-Visa PDF generated and linked to profile.'
    },
    {
      id: 'HRM-VSA-2026-0002',
      pilgrimId: 'HRM-PLG-2026-0002',
      pilgrimName: 'Begum Parveen Akhtar',
      passportNumber: 'BL8819203',
      visaType: 'Umrah E-Visa (KSA Single Entry 90 Days)',
      mofaNumber: 'MOFA-9821049282',
      visaNumber: 'KSA-9941829402',
      submissionDate: '2026-10-25',
      issueDate: '2026-10-28',
      expiryDate: '2027-01-26',
      insurancePolicyNo: 'TAWUNIYA-4910299',
      stage: 'Issued & Delivered',
      agencyFeeSAR: 450,
      agencyFeePKR: 33525,
      costFeeSAR: 380,
      costFeePKR: 28310,
      profitPKR: 5215,
      tasheerStatus: 'Biometrics Completed',
      status: 'Delivered',
      notes: 'Linked with Mahram Haji Abdul Qayyum.'
    },
    {
      id: 'HRM-VSA-2026-0003',
      pilgrimId: 'HRM-PLG-2026-0003',
      pilgrimName: 'Chaudhry Muhammad Aslam',
      passportNumber: 'CJ1092849',
      visaType: 'Umrah E-Visa (KSA Single Entry 90 Days)',
      mofaNumber: 'MOFA-7719204918',
      visaNumber: 'KSA-8839201940',
      submissionDate: '2026-11-01',
      issueDate: '2026-11-03',
      expiryDate: '2027-02-01',
      insurancePolicyNo: 'MEDGULF-9910291',
      stage: 'Issued & Delivered',
      agencyFeeSAR: 450,
      agencyFeePKR: 33525,
      costFeeSAR: 380,
      costFeePKR: 28310,
      profitPKR: 5215,
      tasheerStatus: 'Biometrics Completed',
      status: 'Delivered'
    },
    {
      id: 'HRM-VSA-2026-0004',
      pilgrimId: 'HRM-PLG-2026-0006',
      pilgrimName: 'Tariq Javed',
      passportNumber: 'DF7719201',
      visaType: 'Umrah E-Visa (KSA Single Entry 90 Days)',
      mofaNumber: 'MOFA-3391820491',
      visaNumber: '',
      submissionDate: '2026-11-04',
      issueDate: '',
      expiryDate: '',
      insurancePolicyNo: '',
      stage: 'MOFA Application Submitted',
      agencyFeeSAR: 450,
      agencyFeePKR: 33525,
      costFeeSAR: 380,
      costFeePKR: 28310,
      profitPKR: 5215,
      tasheerStatus: 'Biometrics Verified at Tasheer Center Islamabad',
      status: 'In Process',
      notes: 'Awaiting Saudi Foreign Ministry e-approval.'
    }
  ],

  groups: [
    {
      id: 'HRM-GRP-2026-0001',
      groupCode: 'GRP-UMR-NOV-01',
      name: 'Al-Khair Executive Umrah Caravan',
      type: 'Umrah',
      caravanLeaderName: 'Maulana Hafiz Rashid Mahmood',
      caravanLeaderPhone: '+92 300 4455889',
      departureDate: '2026-11-12',
      returnDate: '2026-11-26',
      originCity: 'Islamabad',
      targetPilgrims: 35,
      confirmedPilgrims: 32,
      assignedFlightCode: 'SV-739 / SV-738',
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      madinahHotel: 'The Oberoi Madinah',
      busLeader: 'Muhammad Saeed (+966 50 771 9023)',
      status: 'Departing Soon',
      notes: 'Executive pre-departure orientation session scheduled for 2026-11-10 at Islamabad HQ.'
    },
    {
      id: 'HRM-GRP-2026-0002',
      groupCode: 'GRP-RAM-2026-01',
      name: 'Ramadan 2026 Elite Itikaf Caravan',
      type: 'Umrah Ramadan',
      caravanLeaderName: 'Dr. Tariq Al-Mansoor',
      caravanLeaderPhone: '+966 50 123 4567',
      departureDate: '2026-03-08',
      returnDate: '2026-03-22',
      originCity: 'Islamabad / Lahore / Karachi',
      targetPilgrims: 50,
      confirmedPilgrims: 42,
      assignedFlightCode: 'SV-739 / SV-738',
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      madinahHotel: 'Anwar Al Madinah Mövenpick',
      busLeader: 'Abdullah Al-Harbi',
      status: 'Open for Bookings'
    },
    {
      id: 'HRM-GRP-2026-0003',
      groupCode: 'GRP-HAJ-1447-01',
      name: 'Harmain VIP Non-Shifting Hajj Group 1447H',
      type: 'Hajj Platinum',
      caravanLeaderName: 'Sheikh Tariq Al-Mansoor & Mufti Usman',
      caravanLeaderPhone: '+92 300 8501234',
      departureDate: '2026-05-20',
      returnDate: '2026-06-10',
      originCity: 'Islamabad',
      targetPilgrims: 60,
      confirmedPilgrims: 48,
      assignedFlightCode: 'Saudia Hajj Dedicated Charter',
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      madinahHotel: 'The Oberoi Madinah',
      busLeader: 'SAPTCO VIP Special Fleet',
      status: 'Confirmed & Training In-Progress'
    }
  ],

  ziyarat: [
    {
      id: 'ZIY-MAK-01',
      city: 'Makkah Al-Mukarramah',
      title: 'Grand Makkah Holy Heritage Tour',
      scheduleDate: '2026-11-15',
      departureTime: '06:30 AM (Post Fajr)',
      meetingPoint: 'Clock Tower Ground Floor Group Entrance',
      guideName: 'Maulana Qari Zubair (Licensed Islamic Scholar)',
      guideContact: '+966 55 991 0293',
      assignedVehicle: 'Toyota Coaster Luxury 2024 (Plate: 1823 KSA)',
      driverName: 'Muhammad Saeed',
      destinations: [
        { name: 'Jabal al-Nour & Cave of Hira', description: 'Site of the first revelation of the Holy Quran' },
        { name: 'Jabal Thawr & Cave of Thawr', description: 'Sanctuary of Prophet Muhammad (PBUH) & Abu Bakr (RA) during Hijrah' },
        { name: 'Mina Valley & Jamarat Pillars', description: 'The city of tents and stoning ritual sites' },
        { name: 'Muzdalifah Plains', description: 'Sacred overnight stay location during Hajj' },
        { name: 'Jabal al-Rahmah & Plain of Arafat', description: 'Mount of Mercy and site of the Farewell Sermon' },
        { name: 'Masjid Nimrah & Masjid al-Jinn', description: 'Historical landmark mosques in Makkah' }
      ],
      durationHours: 4.5,
      refreshmentsProvided: 'Bottled Zamzam, Fresh Juices & Dates',
      status: 'Scheduled'
    },
    {
      id: 'ZIY-MED-01',
      city: 'Madinah Al-Munawwarah',
      title: 'Historical Madinah Holy Landmarks Tour',
      scheduleDate: '2026-11-23',
      departureTime: '07:00 AM (Post Ishraq)',
      meetingPoint: 'Oberoi Madinah Northern Entrance',
      guideName: 'Allama Hamza Abdul Rahman',
      guideContact: '+966 14 8210987',
      assignedVehicle: 'Toyota Coaster Luxury 2024 (Plate: 1823 KSA)',
      driverName: 'Muhammad Saeed',
      destinations: [
        { name: 'Masjid Quba', description: 'The first mosque in Islam; 2 rakats equal to reward of Umrah' },
        { name: 'Mount Uhud & Shuhada Cemetery', description: 'Resting place of Sayyidna Hamza (RA) and the Uhud Martyrs' },
        { name: 'Masjid al-Qiblatayn', description: 'Mosque of the Two Qiblas where direction of prayer was shifted' },
        { name: 'Seven Mosques (Saba Masajid / Battle of Trench)', description: 'Historical battle positions at Khandaq' },
        { name: 'Madinah Date Palm Farms & Market', description: 'Authentic Ajwa, Amber & Safawi dates tasting & purchase' }
      ],
      durationHours: 4,
      refreshmentsProvided: 'Fresh Madinah Mint Tea, Water & Ajwa Dates',
      status: 'Scheduled'
    }
  ],

  pilgrims: [
    {
      id: 'HRM-PLG-2026-0001',
      pilgrimCode: 'PLG-2026-0001',
      fullName: 'Haji Abdul Qayyum',
      arabicName: 'عبد القيوم',
      gender: 'Male',
      dateOfBirth: '1962-08-15',
      age: 64,
      bloodGroup: 'B+',
      cnicOrNationalId: '61101-1928401-3',
      passportNumber: 'BL4920194',
      passportIssueDate: '2021-04-10',
      passportExpiryDate: '2031-04-09',
      passportIssuingCountry: 'Pakistan',
      phone: '+92 300 1122334',
      whatsapp: '+92 300 1122334',
      email: 'abdulqayyum@gmail.com',
      city: 'Islamabad',
      country: 'Pakistan',
      address: 'House 42, Street 18, Sector F-8/2, Islamabad',
      emergencyContactName: 'Kamran Qayyum (Son)',
      emergencyContactPhone: '+92 321 5566778',
      relationshipWithMahram: 'Self (Head of Family)',
      mahramId: null,
      isMahram: true,
      currentBookingId: 'HRM-BK-2026-0001',
      packageId: 'PKG-UMR-01',
      packageName: 'Ramadan 2026 - Last 10 Days Itikaf Luxury',
      visaNumber: 'KSA-9941829401',
      visaStatus: 'Issued & Active',
      pnrCode: 'SV79KX',
      flightNumber: 'SV-739 (Departure) / SV-738 (Return)',
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      makkahRoomNo: '1204',
      madinahHotel: 'The Oberoi Madinah',
      madinahRoomNo: '305',
      assignedGroupId: 'HRM-GRP-2026-0001',
      assignedGroupName: 'Al-Khair Executive Umrah Caravan',
      medicalNotes: 'Mild Hypertension (Medication: Amlodipine 5mg). Needs elevator close room.',
      qrCodeToken: 'HRM-PLG-AUTH-2026-0001-SAUDI-VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      status: 'Confirmed',
      totalTripsWithAgency: 3
    },
    {
      id: 'HRM-PLG-2026-0002',
      pilgrimCode: 'PLG-2026-0002',
      fullName: 'Begum Parveen Akhtar',
      arabicName: 'پروين اختر',
      gender: 'Female',
      dateOfBirth: '1966-11-20',
      age: 60,
      bloodGroup: 'O+',
      cnicOrNationalId: '61101-8849102-4',
      passportNumber: 'BL8819203',
      passportIssueDate: '2021-04-10',
      passportExpiryDate: '2031-04-09',
      passportIssuingCountry: 'Pakistan',
      phone: '+92 300 1122334',
      whatsapp: '+92 300 1122334',
      email: 'parveen.akhtar@gmail.com',
      city: 'Islamabad',
      country: 'Pakistan',
      address: 'House 42, Street 18, Sector F-8/2, Islamabad',
      emergencyContactName: 'Kamran Qayyum (Son)',
      emergencyContactPhone: '+92 321 5566778',
      relationshipWithMahram: 'Wife of Haji Abdul Qayyum',
      mahramId: 'HRM-PLG-2026-0001',
      mahramName: 'Haji Abdul Qayyum',
      isMahram: false,
      currentBookingId: 'HRM-BK-2026-0001',
      packageId: 'PKG-UMR-01',
      packageName: 'Ramadan 2026 - Last 10 Days Itikaf Luxury',
      visaNumber: 'KSA-9941829402',
      visaStatus: 'Issued & Active',
      pnrCode: 'SV79KX',
      flightNumber: 'SV-739 / SV-738',
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      makkahRoomNo: '1204',
      madinahHotel: 'The Oberoi Madinah',
      madinahRoomNo: '305',
      assignedGroupId: 'HRM-GRP-2026-0001',
      assignedGroupName: 'Al-Khair Executive Umrah Caravan',
      medicalNotes: 'Arthritis, prefers wheelchair assistance during Tawaf & Saee.',
      qrCodeToken: 'HRM-PLG-AUTH-2026-0002-SAUDI-VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
      status: 'Confirmed',
      totalTripsWithAgency: 2
    },
    {
      id: 'HRM-PLG-2026-0003',
      pilgrimCode: 'PLG-2026-0003',
      fullName: 'Chaudhry Muhammad Aslam',
      arabicName: 'محمد أسلم',
      gender: 'Male',
      dateOfBirth: '1970-03-12',
      age: 56,
      bloodGroup: 'A+',
      cnicOrNationalId: '37405-2948192-1',
      passportNumber: 'CJ1092849',
      passportIssueDate: '2022-06-15',
      passportExpiryDate: '2032-06-14',
      passportIssuingCountry: 'Pakistan',
      phone: '+92 333 5152535',
      whatsapp: '+92 333 5152535',
      email: 'm.aslam@orienttraders.pk',
      city: 'Rawalpindi',
      country: 'Pakistan',
      address: 'Al-Madina House, Satellite Town, Rawalpindi',
      emergencyContactName: 'Shahbaz Aslam (Brother)',
      emergencyContactPhone: '+92 334 9988771',
      relationshipWithMahram: 'Self (Head of Family)',
      mahramId: null,
      isMahram: true,
      currentBookingId: 'HRM-BK-2026-0002',
      packageId: 'PKG-UMR-02',
      packageName: 'Premium Family Umrah 14-Day Package',
      visaNumber: 'KSA-8839201940',
      visaStatus: 'Issued & Active',
      pnrCode: 'PK882J',
      flightNumber: 'PK-741 / PK-742',
      makkahHotel: 'Swissôtel Al Maqam Makkah',
      makkahRoomNo: '1408',
      madinahHotel: 'Dar Al Taqwa Hotel Madinah',
      madinahRoomNo: '410',
      assignedGroupId: 'HRM-GRP-2026-0001',
      assignedGroupName: 'Al-Khair Executive Umrah Caravan',
      medicalNotes: 'None. Fit for travel.',
      qrCodeToken: 'HRM-PLG-AUTH-2026-0003-SAUDI-VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      status: 'Confirmed',
      totalTripsWithAgency: 1
    },
    {
      id: 'HRM-PLG-2026-0004',
      pilgrimCode: 'PLG-2026-0004',
      fullName: 'Mrs. Kaneez Fatima',
      arabicName: 'كنيز فاطمة',
      gender: 'Female',
      dateOfBirth: '1974-09-05',
      age: 52,
      bloodGroup: 'B+',
      cnicOrNationalId: '37405-7729104-2',
      passportNumber: 'CJ1092850',
      passportIssueDate: '2022-06-15',
      passportExpiryDate: '2032-06-14',
      passportIssuingCountry: 'Pakistan',
      phone: '+92 333 5152535',
      whatsapp: '+92 333 5152535',
      email: 'kaneez.aslam@gmail.com',
      city: 'Rawalpindi',
      country: 'Pakistan',
      address: 'Al-Madina House, Satellite Town, Rawalpindi',
      emergencyContactName: 'Shahbaz Aslam (Brother in Law)',
      emergencyContactPhone: '+92 334 9988771',
      relationshipWithMahram: 'Wife of Chaudhry Muhammad Aslam',
      mahramId: 'HRM-PLG-2026-0003',
      mahramName: 'Chaudhry Muhammad Aslam',
      isMahram: false,
      currentBookingId: 'HRM-BK-2026-0002',
      packageId: 'PKG-UMR-02',
      packageName: 'Premium Family Umrah 14-Day Package',
      visaNumber: 'KSA-8839201941',
      visaStatus: 'Issued & Active',
      pnrCode: 'PK882J',
      flightNumber: 'PK-741 / PK-742',
      makkahHotel: 'Swissôtel Al Maqam Makkah',
      makkahRoomNo: '1408',
      madinahHotel: 'Dar Al Taqwa Hotel Madinah',
      madinahRoomNo: '410',
      assignedGroupId: 'HRM-GRP-2026-0001',
      assignedGroupName: 'Al-Khair Executive Umrah Caravan',
      medicalNotes: 'No chronic diseases.',
      qrCodeToken: 'HRM-PLG-AUTH-2026-0004-SAUDI-VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
      status: 'Confirmed',
      totalTripsWithAgency: 1
    },
    {
      id: 'HRM-PLG-2026-0005',
      pilgrimCode: 'PLG-2026-0005',
      fullName: 'Hamza Aslam',
      arabicName: 'حمزة أسلم',
      gender: 'Male',
      dateOfBirth: '2004-12-18',
      age: 21,
      bloodGroup: 'O+',
      cnicOrNationalId: '37405-4491029-7',
      passportNumber: 'CJ1092851',
      passportIssueDate: '2023-01-20',
      passportExpiryDate: '2033-01-19',
      passportIssuingCountry: 'Pakistan',
      phone: '+92 332 7788990',
      whatsapp: '+92 332 7788990',
      email: 'hamza.aslam@gmail.com',
      city: 'Rawalpindi',
      country: 'Pakistan',
      address: 'Al-Madina House, Satellite Town, Rawalpindi',
      emergencyContactName: 'Chaudhry Muhammad Aslam (Father)',
      emergencyContactPhone: '+92 333 5152535',
      relationshipWithMahram: 'Son',
      mahramId: 'HRM-PLG-2026-0003',
      mahramName: 'Chaudhry Muhammad Aslam',
      isMahram: false,
      currentBookingId: 'HRM-BK-2026-0002',
      packageId: 'PKG-UMR-02',
      packageName: 'Premium Family Umrah 14-Day Package',
      visaNumber: 'KSA-8839201942',
      visaStatus: 'Issued & Active',
      pnrCode: 'PK882J',
      flightNumber: 'PK-741 / PK-742',
      makkahHotel: 'Swissôtel Al Maqam Makkah',
      makkahRoomNo: '1408',
      madinahHotel: 'Dar Al Taqwa Hotel Madinah',
      madinahRoomNo: '410',
      assignedGroupId: 'HRM-GRP-2026-0001',
      assignedGroupName: 'Al-Khair Executive Umrah Caravan',
      medicalNotes: 'None.',
      qrCodeToken: 'HRM-PLG-AUTH-2026-0005-SAUDI-VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      status: 'Confirmed',
      totalTripsWithAgency: 1
    },
    {
      id: 'HRM-PLG-2026-0006',
      pilgrimCode: 'PLG-2026-0006',
      fullName: 'Tariq Javed',
      arabicName: 'طارق جاويد',
      gender: 'Male',
      dateOfBirth: '1980-05-14',
      age: 46,
      bloodGroup: 'AB+',
      cnicOrNationalId: '35202-9988123-1',
      passportNumber: 'DF7719201',
      passportIssueDate: '2022-09-01',
      passportExpiryDate: '2032-08-31',
      passportIssuingCountry: 'Pakistan',
      phone: '+92 321 9876543',
      whatsapp: '+92 321 9876543',
      email: 'tariq.javed@lahorecorp.com',
      city: 'Lahore',
      country: 'Pakistan',
      address: 'House 88, Model Town C Block, Lahore',
      emergencyContactName: 'Adeel Javed (Brother)',
      emergencyContactPhone: '+92 322 1122334',
      relationshipWithMahram: 'Self',
      mahramId: null,
      isMahram: true,
      currentBookingId: 'HRM-BK-2026-0003',
      packageId: 'PKG-UMR-03',
      packageName: 'Economy Comfort 15-Day Umrah',
      visaNumber: 'Pending MOFA Approval',
      visaStatus: 'MOFA Processing',
      pnrCode: 'XY449T',
      flightNumber: 'XY-318 / XY-319',
      makkahHotel: 'Voco Makkah an IHG Hotel',
      makkahRoomNo: '1601',
      madinahHotel: 'Taiba Front Hotel',
      madinahRoomNo: '',
      assignedGroupId: 'HRM-GRP-2026-0001',
      assignedGroupName: 'Al-Khair Executive Umrah Caravan',
      medicalNotes: 'None',
      qrCodeToken: 'HRM-PLG-AUTH-2026-0006-SAUDI-VERIFIED',
      photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      status: 'Visa In-Progress',
      totalTripsWithAgency: 1
    }
  ],

  bookings: [
    {
      id: 'HRM-BK-2026-0001',
      bookingNumber: 'BK-2026-0001',
      invoiceNumber: 'HRM-INV-2026-0001',
      bookingDate: '2026-10-22',
      travelDate: '2026-11-12',
      returnDate: '2026-11-26',
      customerName: 'Haji Abdul Qayyum',
      customerPhone: '+92 300 1122334',
      customerEmail: 'abdulqayyum@gmail.com',
      branchId: 'BR-01',
      branchName: 'Islamabad Head Office',
      agentId: null,
      agentName: 'Direct Walk-in VIP',
      packageId: 'PKG-UMR-01',
      packageName: 'Ramadan 2026 - Last 10 Days Itikaf Luxury',
      packageType: 'Umrah',
      paxCount: 2,
      passengers: [
        { pilgrimId: 'HRM-PLG-2026-0001', name: 'Haji Abdul Qayyum', passport: 'BL4920194', type: 'Adult' },
        { pilgrimId: 'HRM-PLG-2026-0002', name: 'Begum Parveen Akhtar', passport: 'BL8819203', type: 'Adult' }
      ],
      roomType: 'Double Sharing (2 Beds)',
      makkahHotel: 'Fairmont Makkah Clock Royal Tower',
      madinahHotel: 'The Oberoi Madinah',
      pnrCode: 'SV79KX',
      flightDetails: 'Saudia SV-739 (ISB-JED) & SV-738 (JED-ISB)',
      assignedVehicle: 'GMC Yukon XL Denali 2025',
      // Real Financial Breakdown
      financials: {
        currency: 'PKR',
        packageSellingPricePerPax: 1150000,
        totalSellingPrice: 2300000, // 2 x 1,150,000
        costBreakdown: {
          airTicketsCost: 396000, // 2 x 198,000
          makkahHotelCost: 670500, // 9 nights x 1000 SAR x 74.50
          madinahHotelCost: 521500, // 5 nights x 1400 SAR x 74.50
          saudiTransportCost: 104300, // Private GMC 1400 SAR x 74.50
          visaAndInsuranceCost: 56620, // 2 x (380 SAR x 74.50)
          ziyaratAndBuffetCost: 40000,
          agentCommissionCost: 0
        },
        totalDirectCost: 1788920,
        grossProfitPKR: 511080,
        grossProfitMarginPercent: 22.22,
        netProfitPKR: 441080,
        discountGiven: 0,
        taxAmount: 0,
        totalPayable: 2300000,
        totalPaid: 2300000,
        outstandingBalance: 0
      },
      paymentStatus: 'Fully Paid',
      bookingStatus: 'Confirmed & Ready for Departure',
      voucherNumber: 'HRM-VCH-2026-0001',
      voucherIssued: true,
      auditNotes: 'Created by Travel Consultant Ayesha Siddiqua. Approved by Branch Manager.'
    },
    {
      id: 'HRM-BK-2026-0002',
      bookingNumber: 'BK-2026-0002',
      invoiceNumber: 'HRM-INV-2026-0002',
      bookingDate: '2026-10-28',
      travelDate: '2026-11-14',
      returnDate: '2026-11-28',
      customerName: 'Chaudhry Muhammad Aslam',
      customerPhone: '+92 333 5152535',
      customerEmail: 'm.aslam@orienttraders.pk',
      branchId: 'BR-01',
      branchName: 'Islamabad Head Office',
      agentId: 'AGT-01',
      agentName: 'Al-Huda Travel Rawalpindi',
      packageId: 'PKG-UMR-02',
      packageName: 'Premium Family Umrah 14-Day Package',
      packageType: 'Umrah',
      paxCount: 3,
      passengers: [
        { pilgrimId: 'HRM-PLG-2026-0003', name: 'Chaudhry Muhammad Aslam', passport: 'CJ1092849', type: 'Adult' },
        { pilgrimId: 'HRM-PLG-2026-0004', name: 'Mrs. Kaneez Fatima', passport: 'CJ1092850', type: 'Adult' },
        { pilgrimId: 'HRM-PLG-2026-0005', name: 'Hamza Aslam', passport: 'CJ1092851', type: 'Adult' }
      ],
      roomType: 'Triple Sharing Room',
      makkahHotel: 'Swissôtel Al Maqam Makkah',
      madinahHotel: 'Dar Al Taqwa Hotel Madinah',
      pnrCode: 'PK882J',
      flightDetails: 'PIA PK-741 (KHI-MED) & PK-742 (JED-KHI)',
      assignedVehicle: 'Mercedes-Benz VIP Sprinter 2024',
      // Real Financial Breakdown
      financials: {
        currency: 'PKR',
        packageSellingPricePerPax: 695000,
        totalSellingPrice: 2085000, // 3 x 695,000
        costBreakdown: {
          airTicketsCost: 555000, // 3 x 185,000
          makkahHotelCost: 566200, // 8 nights x 950 SAR x 74.50
          madinahHotelCost: 409750, // 6 nights x 920 SAR x 74.50
          saudiTransportCost: 89400, // 1200 SAR x 74.50
          visaAndInsuranceCost: 84930, // 3 x (380 SAR x 74.50)
          ziyaratAndBuffetCost: 35000,
          agentCommissionCost: 45000 // 15,000 per pax to Al-Huda
        },
        totalDirectCost: 1785280,
        grossProfitPKR: 299720,
        grossProfitMarginPercent: 14.37,
        netProfitPKR: 254720,
        discountGiven: 0,
        taxAmount: 0,
        totalPayable: 2085000,
        totalPaid: 1500000,
        outstandingBalance: 585000
      },
      paymentStatus: 'Partially Paid (Advance Received)',
      bookingStatus: 'Confirmed',
      voucherNumber: 'HRM-VCH-2026-0002',
      voucherIssued: true,
      auditNotes: 'Final balance of 585,000 PKR due before departure 2026-11-10.'
    },
    {
      id: 'HRM-BK-2026-0003',
      bookingNumber: 'BK-2026-0003',
      invoiceNumber: 'HRM-INV-2026-0003',
      bookingDate: '2026-11-02',
      travelDate: '2026-11-16',
      returnDate: '2026-11-30',
      customerName: 'Tariq Javed',
      customerPhone: '+92 321 9876543',
      customerEmail: 'tariq.javed@lahorecorp.com',
      branchId: 'BR-03',
      branchName: 'Lahore Mall Branch',
      agentId: null,
      agentName: 'Direct Online Portal',
      packageId: 'PKG-UMR-03',
      packageName: 'Economy Comfort 15-Day Umrah',
      packageType: 'Umrah',
      paxCount: 2,
      passengers: [
        { pilgrimId: 'HRM-PLG-2026-0006', name: 'Tariq Javed', passport: 'DF7719201', type: 'Adult' },
        { pilgrimId: 'HRM-PLG-2026-0007', name: 'Bilal Javed', passport: 'DF7719202', type: 'Adult' }
      ],
      roomType: 'Quad Room Sharing',
      makkahHotel: 'Voco Makkah an IHG Hotel',
      madinahHotel: 'Taiba Front Hotel',
      pnrCode: 'XY449T',
      flightDetails: 'Flynas XY-318 (LHE-JED) & XY-319 (JED-LHE)',
      assignedVehicle: 'SAPTCO VIP Coach',
      // Real Financial Breakdown
      financials: {
        currency: 'PKR',
        packageSellingPricePerPax: 445000,
        totalSellingPrice: 890000, // 2 x 445,000
        costBreakdown: {
          airTicketsCost: 344000, // 2 x 172,000
          makkahHotelCost: 250320, // 8 nights x 420 SAR x 74.50
          madinahHotelCost: 178800, // 7 nights x 340 SAR x 74.50
          saudiTransportCost: 40000,
          visaAndInsuranceCost: 56620,
          ziyaratAndBuffetCost: 20000,
          agentCommissionCost: 0
        },
        totalDirectCost: 889740,
        grossProfitPKR: 100260,
        grossProfitMarginPercent: 11.26,
        netProfitPKR: 75260,
        discountGiven: 0,
        taxAmount: 0,
        totalPayable: 890000,
        totalPaid: 450000,
        outstandingBalance: 440000
      },
      paymentStatus: 'Partially Paid',
      bookingStatus: 'Visa In-Progress',
      voucherNumber: '',
      voucherIssued: false,
      auditNotes: 'Pending visa issuance and final payment.'
    }
  ],

  payments: [
    {
      id: 'HRM-RCT-2026-0001',
      receiptNumber: 'RCT-2026-0001',
      bookingId: 'HRM-BK-2026-0001',
      customerName: 'Haji Abdul Qayyum',
      paymentDate: '2026-10-22',
      amountPKR: 1000000,
      amountSAR: 13422.81,
      currency: 'PKR',
      exchangeRate: 1,
      paymentMethod: 'Bank Transfer (Meezan Bank)',
      bankReferenceNo: 'MEZ-TRF-992104812',
      installmentStage: 'Advance Booking Deposit',
      notes: 'Initial booking token for Ramadan 2026 Itikaf Luxury',
      receivedBy: 'Rashid Mehmood (Accountant)',
      status: 'Verified & Cleared'
    },
    {
      id: 'HRM-RCT-2026-0002',
      receiptNumber: 'RCT-2026-0002',
      bookingId: 'HRM-BK-2026-0001',
      customerName: 'Haji Abdul Qayyum',
      paymentDate: '2026-11-01',
      amountPKR: 1300000,
      amountSAR: 17449.66,
      currency: 'PKR',
      exchangeRate: 1,
      paymentMethod: 'Pay Order / Demand Draft',
      bankReferenceNo: 'PO-MEZ-881920',
      installmentStage: 'Final Full Settlement',
      notes: 'Final settlement cleared. Official Voucher generated.',
      receivedBy: 'Rashid Mehmood (Accountant)',
      status: 'Verified & Cleared'
    },
    {
      id: 'HRM-RCT-2026-0003',
      receiptNumber: 'RCT-2026-0003',
      bookingId: 'HRM-BK-2026-0002',
      customerName: 'Chaudhry Muhammad Aslam',
      paymentDate: '2026-10-28',
      amountPKR: 1500000,
      amountSAR: 20134.22,
      currency: 'PKR',
      exchangeRate: 1,
      paymentMethod: 'Online Bank Transfer (HBL to Meezan)',
      bankReferenceNo: 'HBL-FT-49102948',
      installmentStage: 'Advance 70% Payment',
      notes: 'Advance for air tickets & Swissotel Makkah block. Remaining 585,000 due before travel.',
      receivedBy: 'Rashid Mehmood (Accountant)',
      status: 'Verified & Cleared'
    },
    {
      id: 'HRM-RCT-2026-0004',
      receiptNumber: 'RCT-2026-0004',
      bookingId: 'HRM-BK-2026-0003',
      customerName: 'Tariq Javed',
      paymentDate: '2026-11-02',
      amountPKR: 450000,
      amountSAR: 6040.26,
      currency: 'PKR',
      exchangeRate: 1,
      paymentMethod: 'Cash Receipt at Lahore Branch',
      bankReferenceNo: 'CASH-LHE-0041',
      installmentStage: 'Booking Deposit 50%',
      notes: 'Cash received at Lahore Mall branch counter.',
      receivedBy: 'Kamran Siddiqui (Branch Manager)',
      status: 'Verified & Cleared'
    }
  ],

  expenses: [
    {
      id: 'EXP-2026-0001',
      expenseNumber: 'EXP-001',
      category: 'Airline Seat Purchase',
      bookingId: 'HRM-BK-2026-0001',
      supplierName: 'Saudia Direct Consolidator',
      amountPKR: 396000,
      currency: 'PKR',
      paymentDate: '2026-11-01',
      paymentMethod: 'Bank Transfer (Meezan to Saudia KSA)',
      invoiceRef: 'SV-INV-991204',
      description: 'Air ticket purchase for Haji Abdul Qayyum & Spouse (SV-739/SV-738)',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-0002',
      expenseNumber: 'EXP-002',
      category: 'Hotel Accommodation Booking',
      bookingId: 'HRM-BK-2026-0001',
      supplierName: 'Fairmont Makkah Clock Royal Tower',
      amountPKR: 670500,
      currency: 'SAR',
      amountInCurrency: 9000,
      exchangeRate: 74.50,
      paymentDate: '2026-11-02',
      paymentMethod: 'Al-Rajhi Bank Wire Transfer',
      invoiceRef: 'FRM-MAK-2026-88',
      description: '9 Nights Double Kaaba View Room for Booking BK-2026-0001',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-0003',
      expenseNumber: 'EXP-003',
      category: 'Visa & Health Insurance Fees',
      bookingId: 'HRM-BK-2026-0001',
      supplierName: 'Al-Wafaa Visa Services KSA',
      amountPKR: 56620,
      currency: 'SAR',
      amountInCurrency: 760,
      exchangeRate: 74.50,
      paymentDate: '2026-10-26',
      paymentMethod: 'Mada Corporate Card',
      invoiceRef: 'VSA-WAF-491',
      description: '2 Umrah E-Visas with Tawuniya Health Insurance',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-0004',
      expenseNumber: 'EXP-004',
      category: 'Office Rent & Facilities',
      bookingId: null,
      supplierName: 'Blue Area Commercial Plaza Ltd',
      amountPKR: 280000,
      currency: 'PKR',
      paymentDate: '2026-11-01',
      paymentMethod: 'Bank Cheque',
      invoiceRef: 'RENT-NOV-2026',
      description: 'Monthly office rent for Islamabad Head Office Suite 401',
      status: 'Paid'
    },
    {
      id: 'EXP-2026-0005',
      expenseNumber: 'EXP-005',
      category: 'Marketing & Digital Ads',
      bookingId: null,
      supplierName: 'Meta Ads & Google Cloud',
      amountPKR: 125000,
      currency: 'PKR',
      paymentDate: '2026-11-03',
      paymentMethod: 'Credit Card',
      invoiceRef: 'META-OCT-88',
      description: 'Ramadan 2026 Hajj & Umrah package promotional campaigns',
      status: 'Paid'
    }
  ],

  accounts: [
    { code: '1010', name: 'Cash in Hand (HQ & Branches)', type: 'Asset', balancePKR: 850000 },
    { code: '1020', name: 'Meezan Bank Ltd (Operating PKR)', type: 'Asset', balancePKR: 14250000 },
    { code: '1030', name: 'Al-Rajhi Bank KSA (SAR Account)', type: 'Asset', balancePKR: 8940000, balanceSAR: 120000 },
    { code: '1200', name: 'Accounts Receivable (Pilgrim Pending Dues)', type: 'Asset', balancePKR: 1025000 },
    { code: '2010', name: 'Accounts Payable (Hotels, Airlines, Suppliers)', type: 'Liability', balancePKR: 1840000 },
    { code: '2050', name: 'Customer Advances Received', type: 'Liability', balancePKR: 3450000 },
    { code: '3010', name: 'Retained Earnings & Capital', type: 'Equity', balancePKR: 12000000 },
    { code: '4010', name: 'Umrah Package Sales Revenue', type: 'Revenue', balancePKR: 5275000 },
    { code: '4020', name: 'Hajj Package Sales Revenue', type: 'Revenue', balancePKR: 18450000 },
    { code: '4030', name: 'Air Ticket Markup & Margin', type: 'Revenue', balancePKR: 315000 },
    { code: '4040', name: 'Visa Processing Service Fees', type: 'Revenue', balancePKR: 15645 },
    { code: '5010', name: 'Cost of Sales - Hotel Accommodations', type: 'Expense', balancePKR: 8950000 },
    { code: '5020', name: 'Cost of Sales - Airline Tickets', type: 'Expense', balancePKR: 5420000 },
    { code: '5030', name: 'Cost of Sales - Ground Transport KSA', type: 'Expense', balancePKR: 1240000 },
    { code: '5040', name: 'Cost of Sales - Saudi Visas & Insurance', type: 'Expense', balancePKR: 420000 },
    { code: '5050', name: 'Sub-Agent Commissions Paid', type: 'Expense', balancePKR: 45000 },
    { code: '6010', name: 'Staff Salaries & Benefits', type: 'Expense', balancePKR: 820000 },
    { code: '6020', name: 'Office Rent & Utilities', type: 'Expense', balancePKR: 280000 },
    { code: '6030', name: 'Marketing & Advertising', type: 'Expense', balancePKR: 125000 }
  ],

  suppliers: [
    {
      id: 'SUP-01',
      name: 'Saudi Arabian Airlines (Saudia Consolidator)',
      category: 'Airlines',
      contactPerson: 'Mr. Khalid Mansour',
      phone: '+966 12 686 0000',
      email: 'corporate@saudia.com',
      country: 'Saudi Arabia',
      totalOrdersPKR: 8950000,
      totalPaidPKR: 8554000,
      balancePayablePKR: 396000,
      paymentTerms: 'Credit 14 Days',
      status: 'Active'
    },
    {
      id: 'SUP-02',
      name: 'Fairmont Makkah Clock Royal Tower',
      category: 'Hotels Makkah',
      contactPerson: 'Adel Al-Ghamdi',
      phone: '+966 12 571 7777',
      email: 'makkah.groups@fairmont.com',
      country: 'Saudi Arabia',
      totalOrdersPKR: 12400000,
      totalPaidPKR: 12400000,
      balancePayablePKR: 0,
      paymentTerms: 'Advance 100% Before Check-in',
      status: 'Active'
    },
    {
      id: 'SUP-03',
      name: 'The Oberoi Madinah Hotel',
      category: 'Hotels Madinah',
      contactPerson: 'Khurram Shehzad',
      phone: '+966 14 828 2222',
      email: 'reservations.med@oberoihotels.com',
      country: 'Saudi Arabia',
      totalOrdersPKR: 7800000,
      totalPaidPKR: 7278500,
      balancePayablePKR: 521500,
      paymentTerms: '50% Advance, 50% on Arrival',
      status: 'Active'
    },
    {
      id: 'SUP-04',
      name: 'Al-Jazeera & SAPTCO VIP Transport Fleet',
      category: 'Transportation',
      contactPerson: 'Faisal Al-Zahrani',
      phone: '+966 50 889 1234',
      email: 'fleet@aljazeeratransport.sa',
      country: 'Saudi Arabia',
      totalOrdersPKR: 2450000,
      totalPaidPKR: 2150000,
      balancePayablePKR: 300000,
      paymentTerms: 'Weekly Settlement',
      status: 'Active'
    },
    {
      id: 'SUP-05',
      name: 'Al-Wafaa Saudi Visa Services (Munazzam Registered)',
      category: 'Visa Agency',
      contactPerson: 'Sheikh Mohsin Al-Bishri',
      phone: '+966 55 120 4910',
      email: 'visas@alwafaa-ksa.com',
      country: 'Saudi Arabia',
      totalOrdersPKR: 1150000,
      totalPaidPKR: 1150000,
      balancePayablePKR: 0,
      paymentTerms: 'Instant Prepaid Balance',
      status: 'Active'
    }
  ],

  staff: [
    {
      id: 'STF-01',
      name: 'Dr. Tariq Al-Harmain',
      designation: 'Managing Director & CEO',
      department: 'Executive Management',
      branch: 'Islamabad Head Office',
      email: 'admin@harmain.com',
      phone: '+92 300 8501234',
      salaryPKR: 450000,
      joiningDate: '2020-01-01',
      status: 'Active'
    },
    {
      id: 'STF-02',
      name: 'Muhammad Usman Tariq',
      designation: 'General Manager - Operations',
      department: 'Operations',
      branch: 'Islamabad Head Office',
      email: 'manager@harmain.com',
      phone: '+92 300 8505678',
      salaryPKR: 220000,
      joiningDate: '2021-03-15',
      status: 'Active'
    },
    {
      id: 'STF-03',
      name: 'Ayesha Siddiqua',
      designation: 'Senior Travel Consultant',
      department: 'Sales & Client Relations',
      branch: 'Islamabad Head Office',
      email: 'consultant@harmain.com',
      phone: '+92 321 4455667',
      salaryPKR: 130000,
      joiningDate: '2022-06-01',
      status: 'Active'
    },
    {
      id: 'STF-04',
      name: 'Zubair Ahmed Qureshi',
      designation: 'Head of Visa & Embassy Affairs',
      department: 'Visa Department',
      branch: 'Islamabad Head Office',
      email: 'visa@harmain.com',
      phone: '+92 333 9988776',
      salaryPKR: 140000,
      joiningDate: '2021-09-01',
      status: 'Active'
    },
    {
      id: 'STF-05',
      name: 'Rashid Mehmood, ACMA',
      designation: 'Chief Financial Officer / Head of Accounts',
      department: 'Finance & Accounts',
      branch: 'Islamabad Head Office',
      email: 'finance@harmain.com',
      phone: '+92 345 5566778',
      salaryPKR: 190000,
      joiningDate: '2021-05-10',
      status: 'Active'
    },
    {
      id: 'STF-06',
      name: 'Syed Farhan Ali',
      designation: 'Karachi Regional Manager',
      department: 'Branch Operations',
      branch: 'Karachi Executive Branch',
      email: 'farhan.ali@harmain.com',
      phone: '+92 21 3584910',
      salaryPKR: 180000,
      joiningDate: '2022-01-15',
      status: 'Active'
    }
  ],

  agents: [
    {
      id: 'AGT-01',
      agencyName: 'Al-Huda Travel & Tours',
      contactPerson: 'Qaiser Bilal',
      phone: '+92 300 5511223',
      email: 'info@alhudatravel.pk',
      city: 'Rawalpindi',
      commissionStructure: 'Fixed 15,000 PKR per Adult Pilgrim',
      totalPilgrimsReferred: 18,
      totalCommissionEarnedPKR: 270000,
      totalCommissionPaidPKR: 225000,
      pendingCommissionPKR: 45000,
      status: 'Active'
    },
    {
      id: 'AGT-02',
      agencyName: 'Medina Wings Travel Lahore',
      contactPerson: 'Sohail Butt',
      phone: '+92 321 8844221',
      email: 'contact@medinawings.com',
      city: 'Lahore',
      commissionStructure: 'Fixed 12,000 PKR per Pilgrim',
      totalPilgrimsReferred: 24,
      totalCommissionEarnedPKR: 288000,
      totalCommissionPaidPKR: 288000,
      pendingCommissionPKR: 0,
      status: 'Active'
    },
    {
      id: 'AGT-03',
      agencyName: 'Barakah Hajj Services Peshawar',
      contactPerson: 'Haji Gulzar Khan',
      phone: '+92 345 9900112',
      email: 'gulzar@barakahpkr.com',
      city: 'Peshawar',
      commissionStructure: '5% of Net Package Profit',
      totalPilgrimsReferred: 12,
      totalCommissionEarnedPKR: 310000,
      totalCommissionPaidPKR: 250000,
      pendingCommissionPKR: 60000,
      status: 'Active'
    }
  ],

  notifications: [
    {
      id: 'NOTIF-01',
      title: 'Upcoming Flight Departure in 48 Hours',
      message: 'Group GRP-UMR-NOV-01 departing on Saudia SV-739 (ISB-JED) on 2026-11-12 at 04:30 AM. Total 32 passengers.',
      priority: 'Urgent',
      type: 'Flight Departure',
      link: '/groups',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: 'NOTIF-02',
      title: 'Outstanding Payment Balance Reminder',
      message: 'Booking BK-2026-0002 (Chaudhry Muhammad Aslam) has an outstanding balance of 585,000 PKR due before departure.',
      priority: 'Warning',
      type: 'Accounts',
      link: '/payments',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      read: false
    },
    {
      id: 'NOTIF-03',
      title: 'Saudi Umrah E-Visa Approved',
      message: 'MOFA has issued Umrah E-Visa for Haji Abdul Qayyum & Begum Parveen Akhtar (Visa # KSA-9941829401/02).',
      priority: 'Info',
      type: 'Visa Issuance',
      link: '/visas',
      timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
      read: true
    },
    {
      id: 'NOTIF-04',
      title: 'Makkah Hotel Room Block Utilization Alert',
      message: 'Fairmont Makkah Clock Royal Tower block utilization is at 84% (38 of 45 contracted rooms booked).',
      priority: 'Info',
      type: 'Inventory',
      link: '/rooms',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      read: true
    }
  ],

  auditLogs: [
    {
      id: 'LOG-001',
      action: 'LOGIN_SUCCESS',
      module: 'AUTH',
      performedBy: 'admin@harmain.com (Dr. Tariq Al-Harmain)',
      ipAddress: '192.168.1.10',
      details: 'Super Admin logged into HARMAIN ERP system dashboard',
      timestamp: new Date().toISOString()
    },
    {
      id: 'LOG-002',
      action: 'BOOKING_CREATED',
      module: 'BOOKINGS',
      performedBy: 'consultant@harmain.com (Ayesha Siddiqua)',
      ipAddress: '192.168.1.14',
      details: 'Created Booking BK-2026-0001 for Haji Abdul Qayyum (2 Pax, Package: PKG-UMR-01, Amount: 2,300,000 PKR)',
      timestamp: new Date(Date.now() - 3600000 * 24 * 15).toISOString()
    },
    {
      id: 'LOG-003',
      action: 'PAYMENT_RECORDED',
      module: 'ACCOUNTS',
      performedBy: 'finance@harmain.com (Rashid Mehmood)',
      ipAddress: '192.168.1.22',
      details: 'Recorded Payment Receipt RCT-2026-0002 for 1,300,000 PKR (Booking BK-2026-0001) - Full settlement',
      timestamp: new Date(Date.now() - 3600000 * 24 * 5).toISOString()
    },
    {
      id: 'LOG-004',
      action: 'VISA_STATUS_UPDATED',
      module: 'VISAS',
      performedBy: 'visa@harmain.com (Zubair Ahmed Qureshi)',
      ipAddress: '192.168.1.18',
      details: 'Updated Visa status to "Delivered" for Pilgrim Haji Abdul Qayyum (Visa # KSA-9941829401)',
      timestamp: new Date(Date.now() - 3600000 * 24 * 9).toISOString()
    }
  ]
};

module.exports = seedData;
