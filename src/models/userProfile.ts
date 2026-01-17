export interface UserProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface ModifierCompteFormProps {
  initialData: UserProfileData;
}
