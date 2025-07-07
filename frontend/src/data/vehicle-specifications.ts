// Vehicle specifications database based on make, model, and year
export interface VehicleSpecification {
  make: string;
  model: string;
  year: number;
  specifications: {
    engine: string;
    horsepower: string;
    torque: string;
    transmission: string;
    driveType: string;
    fuelType: string;
    fuelCapacity: string;
    fuelConsumption: string;
    topSpeed: string;
    acceleration: string;
    dimensions: {
      length: string;
      width: string;
      height: string;
      wheelbase: string;
    };
    weight: string;
    seatingCapacity: string;
    trunkCapacity: string;
    safetyFeatures: string[];
    techFeatures: string[];
    exteriorFeatures: string[];
    interiorFeatures: string[];
  };
}

export const vehicleSpecifications: VehicleSpecification[] = [
  // Toyota Camry
  {
    make: "تويوتا",
    model: "كامري",
    year: 2024,
    specifications: {
      engine: "2.5L 4-Cylinder",
      horsepower: "203 حصان",
      torque: "247 نيوتن متر",
      transmission: "ناقل حركة أوتوماتيكي 8 سرعات",
      driveType: "دفع أمامي",
      fuelType: "بنزين",
      fuelCapacity: "60 لتر",
      fuelConsumption: "7.8 لتر/100 كم",
      topSpeed: "210 كم/ساعة",
      acceleration: "0-100 كم/ساعة في 8.4 ثانية",
      dimensions: {
        length: "4885 مم",
        width: "1840 مم",
        height: "1455 مم",
        wheelbase: "2825 مم"
      },
      weight: "1590 كج",
      seatingCapacity: "5 أشخاص",
      trunkCapacity: "524 لتر",
      safetyFeatures: [
        "نظام الفرامل المانعة للانغلاق (ABS)",
        "نظام التحكم الإلكتروني بالثبات (ESC)",
        "نظام مساعدة الفرامل (BA)",
        "نظام مراقبة ضغط الإطارات (TPMS)",
        "8 وسائد هوائية",
        "نظام التحذير من الاصطدام الأمامي",
        "نظام الحفاظ على المسار"
      ],
      techFeatures: [
        "شاشة تعمل باللمس 9 بوصة",
        "نظام الملاحة GPS",
        "Apple CarPlay و Android Auto",
        "نظام الصوت JBL",
        "نظام التحكم التلقائي في المناخ",
        "نظام الدخول الذكي",
        "نظام تشغيل المحرك بالضغط على الزر"
      ],
      exteriorFeatures: [
        "مصابيح LED أمامية وخلفية",
        "مرايا جانبية قابلة للطي كهربائياً",
        "جنوط معدنية 18 بوصة",
        "فتحة سقف بانورامية",
        "مقابض الأبواب اللونية"
      ],
      interiorFeatures: [
        "مقاعد جلدية",
        "مقعد السائق قابل للتعديل كهربائياً",
        "نظام التدفئة والتهوية للمقاعد",
        "عجلة القيادة الجلدية",
        "نظام الإضاءة الداخلية LED"
      ]
    }
  },
  // Honda Accord
  {
    make: "هوندا",
    model: "أكورد",
    year: 2024,
    specifications: {
      engine: "1.5L Turbo 4-Cylinder",
      horsepower: "192 حصان",
      torque: "260 نيوتن متر",
      transmission: "ناقل حركة أوتوماتيكي متغير السرعة (CVT)",
      driveType: "دفع أمامي",
      fuelType: "بنزين",
      fuelCapacity: "56.8 لتر",
      fuelConsumption: "7.1 لتر/100 كم",
      topSpeed: "200 كم/ساعة",
      acceleration: "0-100 كم/ساعة في 7.8 ثانية",
      dimensions: {
        length: "4906 مم",
        width: "1862 مم",
        height: "1449 مم",
        wheelbase: "2830 مم"
      },
      weight: "1441 كج",
      seatingCapacity: "5 أشخاص",
      trunkCapacity: "473 لتر",
      safetyFeatures: [
        "نظام Honda SENSING",
        "نظام الفرامل المانعة للانغلاق (ABS)",
        "نظام التحكم الإلكتروني بالثبات (VSA)",
        "نظام مساعدة الفرامل",
        "6 وسائد هوائية",
        "نظام التحذير من الاصطدام",
        "نظام الحفاظ على المسار"
      ],
      techFeatures: [
        "شاشة تعمل باللمس 8 بوصة",
        "نظام الملاحة",
        "Apple CarPlay و Android Auto",
        "نظام الصوت المتطور",
        "نظام التحكم التلقائي في المناخ",
        "نظام الدخول الذكي",
        "نظام تشغيل المحرك بالزر"
      ],
      exteriorFeatures: [
        "مصابيح LED الأمامية",
        "مرايا جانبية كهربائية",
        "جنوط معدنية 17 بوصة",
        "مقابض الأبواب اللونية"
      ],
      interiorFeatures: [
        "مقاعد مريحة",
        "مقعد السائق قابل للتعديل",
        "عجلة القيادة قابلة للتعديل",
        "نظام الإضاءة الداخلية"
      ]
    }
  },
  // Nissan Altima
  {
    make: "نيسان",
    model: "التيما",
    year: 2024,
    specifications: {
      engine: "2.5L 4-Cylinder",
      horsepower: "188 حصان",
      torque: "244 نيوتن متر",
      transmission: "ناقل حركة أوتوماتيكي متغير السرعة (CVT)",
      driveType: "دفع أمامي",
      fuelType: "بنزين",
      fuelCapacity: "61.9 لتر",
      fuelConsumption: "8.1 لتر/100 كم",
      topSpeed: "195 كم/ساعة",
      acceleration: "0-100 كم/ساعة في 8.9 ثانية",
      dimensions: {
        length: "4901 مم",
        width: "1850 مم",
        height: "1444 مم",
        wheelbase: "2825 مم"
      },
      weight: "1492 كج",
      seatingCapacity: "5 أشخاص",
      trunkCapacity: "444 لتر",
      safetyFeatures: [
        "نظام Nissan Safety Shield 360",
        "نظام الفرامل المانعة للانغلاق",
        "نظام التحكم الإلكتروني بالثبات",
        "نظام مساعدة الفرامل",
        "6 وسائد هوائية",
        "نظام التحذير من النقطة العمياء",
        "نظام التحذير من الاصطدام الخلفي"
      ],
      techFeatures: [
        "شاشة تعمل باللمس 8 بوصة",
        "نظام NissanConnect",
        "Apple CarPlay و Android Auto",
        "نظام الصوت Bose",
        "نظام التحكم التلقائي في المناخ",
        "نظام الدخول الذكي",
        "نظام تشغيل المحرك بالزر"
      ],
      exteriorFeatures: [
        "مصابيح LED",
        "مرايا جانبية كهربائية",
        "جنوط معدنية 16 بوصة",
        "أضواء النهار LED"
      ],
      interiorFeatures: [
        "مقاعد مريحة",
        "مقعد السائق قابل للتعديل",
        "عجلة القيادة مغطاة بالجلد",
        "نظام الإضاءة الداخلية"
      ]
    }
  },
  // Hyundai Sonata
  {
    make: "هيونداي",
    model: "سوناتا",
    year: 2024,
    specifications: {
      engine: "2.5L 4-Cylinder",
      horsepower: "191 حصان",
      torque: "245 نيوتن متر",
      transmission: "ناقل حركة أوتوماتيكي 8 سرعات",
      driveType: "دفع أمامي",
      fuelType: "بنزين",
      fuelCapacity: "65 لتر",
      fuelConsumption: "8.4 لتر/100 كم",
      topSpeed: "205 كم/ساعة",
      acceleration: "0-100 كم/ساعة في 8.6 ثانية",
      dimensions: {
        length: "4900 مم",
        width: "1860 مم",
        height: "1445 مم",
        wheelbase: "2840 مم"
      },
      weight: "1524 كج",
      seatingCapacity: "5 أشخاص",
      trunkCapacity: "454 لتر",
      safetyFeatures: [
        "نظام Hyundai SmartSense",
        "نظام الفرامل المانعة للانغلاق",
        "نظام التحكم الإلكتروني بالثبات",
        "نظام مساعدة الفرامل",
        "7 وسائد هوائية",
        "نظام التحذير من الاصطدام الأمامي",
        "نظام الحفاظ على المسار"
      ],
      techFeatures: [
        "شاشة تعمل باللمس 10.25 بوصة",
        "نظام الملاحة",
        "Apple CarPlay و Android Auto",
        "نظام الصوت Infinity",
        "نظام التحكم التلقائي في المناخ",
        "نظام الدخول الذكي",
        "شاحن لاسلكي للهاتف"
      ],
      exteriorFeatures: [
        "مصابيح LED الأمامية والخلفية",
        "مرايا جانبية كهربائية",
        "جنوط معدنية 17 بوصة",
        "أضواء النهار LED",
        "شبكة أمامية مميزة"
      ],
      interiorFeatures: [
        "مقاعد مريحة",
        "مقعد السائق قابل للتعديل كهربائياً",
        "عجلة القيادة مغطاة بالجلد",
        "نظام الإضاءة الداخلية LED",
        "منافذ USB متعددة"
      ]
    }
  }
];

// Function to get specifications for a specific vehicle
export const getVehicleSpecifications = (make: string, model: string, year: number): VehicleSpecification | null => {
  return vehicleSpecifications.find(spec => 
    spec.make === make && 
    spec.model === model && 
    spec.year === year
  ) || null;
};

// Function to get all available makes
export const getAvailableMakes = (): string[] => {
  const makes = vehicleSpecifications.map(spec => spec.make);
  return Array.from(new Set(makes));
};

// Function to get models for a specific make
export const getModelsForMake = (make: string): string[] => {
  const models = vehicleSpecifications
    .filter(spec => spec.make === make)
    .map(spec => spec.model);
  return Array.from(new Set(models));
};

// Function to get years for a specific make and model
export const getYearsForMakeAndModel = (make: string, model: string): number[] => {
  const years = vehicleSpecifications
    .filter(spec => spec.make === make && spec.model === model)
    .map(spec => spec.year);
  return Array.from(new Set(years)).sort((a, b) => b - a);
};