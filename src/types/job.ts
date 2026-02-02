export interface Job {
  _id: string;
  id: string;
  companyName: string;
  companyLogoUrl: string;
  address: string;
  category: string;
  role: string;
  location: string;
  workMode: "Zdalna" | "Stacjonarna" | "Hybrydowa";
  position: "Junior" | "Mid" | "Senior";
  responsibilities: string[];
  benefits: string[];
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
}
