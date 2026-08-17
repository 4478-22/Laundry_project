import type { Laundry, Review, Service } from "../models";

// Realistic Ghana-context dummy laundry businesses around UPSA.
// Currency is Ghana Cedis (₵). Images are Pexels stock photo URLs.

const reviewsCleanPro: Review[] = [
  {
    id: "r1",
    authorName: "Ama Serwaa",
    authorAvatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 5,
    comment: "Picked up my clothes right on time and folded everything neatly. Best laundry around UPSA!",
    date: "2 days ago",
  },
  {
    id: "r2",
    authorName: "Kwame Mensah",
    authorAvatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 5,
    comment: "Express service saved me before an exam. Clothes smelled fresh and were ready in 6 hours.",
    date: "1 week ago",
  },
  {
    id: "r3",
    authorName: "Abena Owusu",
    authorAvatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 4,
    comment: "Good service and fair prices. Pickup was a bit late but the quality made up for it.",
    date: "2 weeks ago",
  },
];

const reviewsFreshWash: Review[] = [
  {
    id: "r4",
    authorName: "Yaw Boateng",
    authorAvatar: "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 5,
    comment: "Affordable and reliable. My go-to laundry in Madina now.",
    date: "3 days ago",
  },
  {
    id: "r5",
    authorName: "Akosua Frimpong",
    authorAvatar: "https://images.pexels.com/photos/762020/pexels-photo-762020.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
    rating: 4,
    comment: "Ironing was crisp. Wish they had pickup though — had to drop off myself.",
    date: "5 days ago",
  },
];

const washFold: Service = {
  id: "s-wash-fold",
  name: "Wash & Fold",
  price: 20,
  unit: "kg",
  duration: "24 hours",
  description: "Washed, dried and neatly folded. Perfect for everyday wear.",
};

const express: Service = {
  id: "s-express",
  name: "Express Laundry",
  price: 35,
  unit: "kg",
  duration: "6 hours",
  description: "Same-day priority wash. Great for urgent needs.",
};

const ironing: Service = {
  id: "s-iron",
  name: "Ironing",
  price: 5,
  unit: "item",
  duration: "12 hours",
  description: "Professional pressing for shirts, trousers and more.",
};

const dryClean: Service = {
  id: "s-dry",
  name: "Dry Cleaning",
  price: 30,
  unit: "item",
  duration: "48 hours",
  description: "Gentle dry cleaning for delicate and formal wear.",
};

const baseLaundries: Laundry[] = [
  {
    id: "l-cleanpro",
    name: "CleanPro Laundry",
    imageUrl: "https://images.pexels.com/photos/6193248/pexels-photo-6193248.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    rating: 4.8,
    reviewsCount: 124,
    distanceMinutes: 2,
    location: "UPSA",
    address: "Near UPSA Main Gate, Accra",
    verified: true,
    openHours: "Mon–Sat: 7AM – 8PM",
    services: [washFold, express, ironing],
    reviews: reviewsCleanPro,
    pickupAvailable: true,
    expressService: true,
    estimatedCompletion: "24 hrs",
  },
  {
    id: "l-freshwash",
    name: "FreshWash Laundry",
    imageUrl: "https://images.pexels.com/photos/6193340/pexels-photo-6193340.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    rating: 4.5,
    reviewsCount: 87,
    distanceMinutes: 8,
    location: "Madina",
    address: "Madina Market Road, Accra",
    verified: true,
    openHours: "Mon–Sat: 6:30AM – 7:30PM",
    services: [washFold, ironing, dryClean],
    reviews: reviewsFreshWash,
    pickupAvailable: true,
    expressService: false,
    estimatedCompletion: "24 hrs",
  },
  {
    id: "l-legonwash",
    name: "Legon Wash Hub",
    imageUrl: "https://images.pexels.com/photos/4239094/pexels-photo-4239094.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    rating: 4.7,
    reviewsCount: 95,
    distanceMinutes: 12,
    location: "Legon",
    address: "University of Ghana, Legon Campus",
    verified: true,
    openHours: "Mon–Sun: 8AM – 9PM",
    services: [washFold, express, ironing, dryClean],
    reviews: reviewsFreshWash,
    pickupAvailable: true,
    expressService: true,
    estimatedCompletion: "12 hrs",
  },
  {
    id: "l-adentafresh",
    name: "Adenta Fresh Laundry",
    imageUrl: "https://images.pexels.com/photos/6193274/pexels-photo-6193274.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    rating: 4.3,
    reviewsCount: 56,
    distanceMinutes: 18,
    location: "Adenta",
    address: "Adenta Municipality, Accra",
    verified: false,
    openHours: "Mon–Sat: 7AM – 7PM",
    services: [washFold, ironing],
    reviews: reviewsFreshWash,
    pickupAvailable: false,
    expressService: false,
    estimatedCompletion: "24 hrs",
  },
];

const generatedLaundries: Laundry[] = Array.from({ length: 16 }, (_, index) => {
  const names = [
    "Spin & Shine",
    "Apex Laundry Co.",
    "Kumasi Fresh Clean",
    "City Fold Laundry",
    "Noble Wash Hub",
    "Twin Fold Laundry",
    "The Spin Room",
    "Happy Clothes",
    "Express Wardrobe",
    "Gold Fold Laundry",
    "Lagos Lane Laundry",
    "Eco Spin",
    "Campus Press",
    "Momo Laundry",
    "Quick Fresh Laundry",
    "Smart Wash Studio",
  ];
  const locations: Laundry["location"][] = ["UPSA", "Madina", "Legon", "Adenta"];
  const addresses = [
    "East Legon Hills, Accra",
    "Alajo Market Road, Accra",
    "Kaneshie, Accra",
    "Madina Estate, Accra",
    "Tesano, Accra",
    "Tema Community 8",
    "Osu, Accra",
    "Dome Pillar 2",
  ];
  const servicesSet = index % 2 === 0 ? [washFold, express, ironing] : [washFold, ironing, dryClean];
  return {
    id: `l-${index + 5}`,
    name: names[index],
    imageUrl: `https://images.pexels.com/photos/${6193248 + index}/pexels-photo-${6193248 + index}.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop`,
    rating: Number((4.1 + (index % 7) * 0.1).toFixed(1)),
    reviewsCount: 40 + index * 7,
    distanceMinutes: 3 + (index % 6) * 3,
    location: locations[index % locations.length],
    address: addresses[index % addresses.length],
    verified: index % 3 !== 0,
    openHours: index % 2 === 0 ? "Mon–Sat: 7AM – 8PM" : "Mon–Sun: 8AM – 9PM",
    services: servicesSet,
    reviews: index % 2 === 0 ? reviewsCleanPro : reviewsFreshWash,
    pickupAvailable: index % 3 !== 0,
    expressService: servicesSet.some((service) => service.name.includes("Express")),
    estimatedCompletion: index % 2 === 0 ? "12 hrs" : "24 hrs",
  };
});

export const dummyLaundries: Laundry[] = [...baseLaundries, ...generatedLaundries];
