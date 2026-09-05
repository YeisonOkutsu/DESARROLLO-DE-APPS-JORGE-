export interface Usuario {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  company?: { name: string };
  address?: { city: string };
}
