import { boolean } from "zod";

export interface LoginResponse {
  data: {
    success: boolean;
    message: string;
    data: {
      username: string;
      token: string;
      refresh: string;
    };
  };
}

export interface Country {
  id: number;
  name: string;
  code: string;
  icon: string;
  kyc_amount: number;
  sms_fee: number;
  min_balance_withdraw: number;
  max_balance_withdraw: number;
  max_balance_load: number;
  min_balance_load: number;
  prefix_number: string;
  main_currency: number;
  continent: number;
  other_currency: [number];
}

export interface CountryType {
  id: number;
  name: string;
  code: string;
  currency: {
    id: number;
    name: string;
    currency_code: string;
    symbol: string;
  };
}

export interface UserListType {
  id: string;
  password: string;
  last_login: null;
  is_superuser: boolean;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  created: string;
  modified: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string;
  remarks: string;
  user_opinion: string;
  otp: string;
  is_otp_verified: boolean;
  is_otp_phone_verified: boolean;
  is_verified_user: boolean;
  otp_generated_at: string;
  otp_expiry: string;
  user_type: string;
  is_deleted: boolean;
  groups: [];
  user_permissions: [];
}

export interface UserProfileType {
  id: string;
  phone_prefix: string;
  secondary_phone_number: string;
  secondary_email: string;
  date_of_birth: string;
  country_code: string;
  country: string;
  address: string;
  city: string;
  street: string;
  zip_code: string;
  house_no: string;
  gender: string;
  display_picture: string;
  expertise: string;
  interest: string;
  qr_code: string;
  user: string;
}

export interface UserBasicInfoType {
  id: string;
  user_profile: {
    id: string;
    phone_prefix: string;
    secondary_phone_number: string;
    secondary_email: string;
    date_of_birth: string;
    country_code: string;
    country: string;
    address: string;
    city: string;
    street: string;
    zip_code: string;
    house_no: string;
    gender: string;
    display_picture: string;
    expertise: null;
    interest: null;
    qr_code: string;
    user: string;
  };
  password: string;
  last_login: string;
  is_superuser: boolean;
  username: string;
  email: string;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  created: string;
  modified: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  status: string;
  remarks: string;
  user_opinion: string;
  otp: string;
  is_otp_verified: boolean;
  is_otp_phone_verified: boolean;
  is_verified_user: boolean;
  otp_generated_at: null;
  otp_expiry: null;
  user_type: string;
  is_deleted: boolean;
  groups: [];
  user_permissions: [];
}

export interface UserKYCType {
  id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    username: string;
  };
  marital_status: string;
  occupation: string;
  state_province: string;
  city: string;
  street: string;
  postal_code: string;
  alt_contact: string;
  alt_email: string;
  agreed_to_terms: boolean;
  document: [
    {
      id: number;
      document_type: string;
      document_id: string;
      issue_date: string;
      document_file: string;
      kyc_verification: number;
    }
  ];
  is_verified: boolean;
  is_not_verified: boolean;
}

export interface StationData {
  id: string;
  lat: number;
  user: string | null;
  restaurant: string | null;
  lng: number;
  address: string;
  name: string;
  banner: string;
  logo: string | null;
  email: string;
  contact_no: string;
  country: number;
  currency: number;
  short_description: string | null;
  long_description: string | null;
}

export interface RestroListData {
  id: string;
  name: string;
  open_hrs: string;
  banner: string;
  address: string;
}

export interface RestroDetail {
  id: string;
  country_code: string;
  currency_code: string;
  country: number;
  currency: number;
  name: string;
  address: string;
  short_description: string;
  long_description: string;
  lat: number;
  lng: number;
  logo: string;
  banner: string;
  email: string;
  contact_no: string;
  is_delivery: boolean;
  is_pickup: boolean;
  is_dine: boolean;
  min_order: number;
  station_no_of_packed_item: number;
  delivery_per_km: number;
  delivery_time: string;
  website_link: string;
  facebook_link: string;
  instagram_link: string;
}

export interface MenuItem {
  id: string;
  name: string | null;
  no_of_items: number;
  icon: string | null;
}

export interface RestroMenuItem {
  id: string;
  no_of_items: number;
  name: string;
  icon: string;
}

export interface FoodItem {
  actual_price: number;
  currency_symbol: string;
  discount_percentage: number;
  id: string;
  image: string;
  ingredient: string;
  is_active: boolean;
  item_price: number;
  menu: string;
  name: string;
  retailer_price: string;
  short_description: string;
}

export interface RestroFoodItem {
  id: string;
  name: string;
  image: string;
  short_description: string;
  actual_price: number;
  discount_percentage: number;
  currency_symbol: string;
  item_price: string;
  cuisine: [
    {
      id: number;
      name: string;
      image: string;
    }
  ];
  ingredient: string;
}

export interface Cuisine {
  id: number;
  name: string;
  image: string;
}

export interface OrderData {
  id: string;
  order_id: string;
  full_name: string;
  email: string;
  phone_no: string;
  restaurant: {
    id: string;
    logo: string;
    name: string;
    address: string;
    short_description: string;
    long_description: string;
    lat: number;
    lng: number;
    banner: string;
    email: string;
    contact_no: string;
    is_delivery: boolean;
    is_pickup: boolean;
    is_dine: boolean;
    is_open: boolean;
    timezone: string;
    min_order: number;
    delivery_per_km: number;
    station_no_of_packed_item: number;
    delivery_time: string;
    website_link: string;
    facebook_link: string;
    instagram_link: string;
    user: string;
    country: number;
    currency: number;
  };
  order_status: string;
  order_type: string;
  lat: number;
  lng: number;
  address: string;
  ordered_date: string;
  arrival_time: string;
  note: string;
  order_items: string[];
  currency_symbol: string;
}

export interface WorkingHours {
  day_name: string;
  end_time: string;
  id: string;
  is_open: boolean;
  start_time: string;
}
