
import { CarListing } from "@/components/cars/CarCard";

export const sampleCars: CarListing[] = [
  {
    id: "1",
    title: "2019 Mercedes-Benz S-Class S 450",
    price: 259000,
    year: 2019,
    mileage: 45000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u1",
      name: "Dubai Luxury Motors"
    },
    description: "Luxury sedan in excellent condition. One owner, full service history, accident-free.",
    make: "Mercedes-Benz",
    model: "S-Class S 450",
    createdAt: "2023-05-15T08:30:00Z"
  },
  {
    id: "2",
    title: "2021 BMW X5 xDrive40i",
    price: 310000,
    year: 2021,
    mileage: 32000,
    location: "Abu Dhabi",
    imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u2",
      name: "Premium Auto UAE"
    },
    description: "Pristine condition BMW X5 with all premium features. Panoramic roof, head-up display, and premium sound system.",
    make: "BMW",
    model: "X5 xDrive40i",
    createdAt: "2023-06-20T10:15:00Z"
  },
  {
    id: "3",
    title: "2020 Audi A6 45 TFSI",
    price: 175000,
    year: 2020,
    mileage: 58000,
    location: "Sharjah",
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&q=80&w=900", 
    seller: {
      id: "u3",
      name: "Elite Cars"
    },
    description: "Well-maintained Audi A6 with full service history. Leather interior, navigation system, and advanced driver assistance features.",
    make: "Audi",
    model: "A6 45 TFSI",
    createdAt: "2023-04-10T14:20:00Z"
  },
  {
    id: "4",
    title: "2022 Range Rover Sport HSE",
    price: 425000,
    year: 2022,
    mileage: 18000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u4",
      name: "Emirates Auto"
    },
    description: "Nearly new Range Rover Sport with extended warranty. Premium package with all options and off-road capability.",
    make: "Land Rover",
    model: "Range Rover Sport HSE",
    createdAt: "2023-08-05T09:45:00Z"
  },
  {
    id: "5",
    title: "2018 Lexus ES 350",
    price: 120000,
    year: 2018,
    mileage: 65000,
    location: "Al Ain",
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u5",
      name: "Al Ain Motors"
    },
    description: "Comfortable and reliable Lexus ES with clean history. Well-maintained with regular service at the dealership.",
    make: "Lexus",
    model: "ES 350",
    createdAt: "2023-03-25T11:30:00Z"
  },
  {
    id: "6",
    title: "2021 Toyota Land Cruiser VXR",
    price: 375000,
    year: 2021,
    mileage: 42000,
    location: "Ras Al Khaimah",
    imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u6",
      name: "RAK Auto Traders"
    },
    description: "Powerful Land Cruiser with full options. Perfect for both city driving and desert adventures.",
    make: "Toyota",
    model: "Land Cruiser VXR",
    createdAt: "2023-07-12T15:40:00Z"
  },
  {
    id: "7",
    title: "2020 Nissan Patrol Titanium",
    price: 235000,
    year: 2020,
    mileage: 56000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u7",
      name: "Dubai Auto Souk"
    },
    description: "Popular UAE SUV with strong performance and reliability. Spacious interior with third-row seating.",
    make: "Nissan",
    model: "Patrol Titanium",
    createdAt: "2023-05-30T13:10:00Z"
  },
  {
    id: "8",
    title: "2019 Porsche Cayenne",
    price: 285000,
    year: 2019,
    mileage: 38000,
    location: "Abu Dhabi",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u8",
      name: "Capital Motors"
    },
    description: "Elegant and sporty Porsche Cayenne with premium features. Sport package with enhanced performance.",
    make: "Porsche",
    model: "Cayenne",
    createdAt: "2023-06-08T16:25:00Z"
  },
  {
    id: "9",
    title: "2022 Tesla Model Y Long Range",
    price: 265000,
    year: 2022,
    mileage: 15000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u9",
      name: "Future Motors"
    },
    description: "All-electric Tesla with impressive range and performance. Autopilot features and regular software updates.",
    make: "Tesla",
    model: "Model Y Long Range",
    createdAt: "2023-09-01T12:00:00Z"
  },
  {
    id: "10",
    title: "2018 Bentley Continental GT",
    price: 495000,
    year: 2018,
    mileage: 28000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u10",
      name: "Prestige Auto Gallery"
    },
    description: "Luxury Bentley Continental GT with exceptional craftsmanship. Powerful engine with smooth performance.",
    make: "Bentley",
    model: "Continental GT",
    createdAt: "2023-04-18T09:20:00Z"
  },
  {
    id: "11",
    title: "2021 Jeep Wrangler Rubicon",
    price: 210000,
    year: 2021,
    mileage: 25000,
    location: "Fujairah",
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u11",
      name: "Adventure Motors"
    },
    description: "Off-road ready Jeep Wrangler with upgraded suspension and tires. Perfect for weekend adventures.",
    make: "Jeep",
    model: "Wrangler Rubicon",
    createdAt: "2023-07-22T11:15:00Z"
  },
  {
    id: "12",
    title: "2020 Mercedes-Benz G-Class G 63 AMG",
    price: 650000,
    year: 2020,
    mileage: 32000,
    location: "Dubai",
    imageUrl: "https://images.unsplash.com/photo-1520019817969-33764d47f3d7?auto=format&fit=crop&q=80&w=900",
    seller: {
      id: "u12",
      name: "Kings Auto Luxury"
    },
    description: "Iconic G-Wagon with AMG performance. Luxurious interior with advanced technology and commanding presence.",
    make: "Mercedes-Benz",
    model: "G-Class G 63 AMG",
    createdAt: "2023-08-15T14:50:00Z"
  }
];
