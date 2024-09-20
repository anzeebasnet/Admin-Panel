
export interface LoginResponse {
    data: {
    success: boolean;
    message: string;
    data: {
      username: string;
      token: string;
      refresh: string;
    };
    }
  };


  export interface UserListType {
      id: string,
      password: string,
      last_login: null,
      is_superuser: boolean,
      username: string,
      email: string,
      is_staff: boolean,
      is_active: boolean,
      date_joined: string, //
      created: string,
      modified: string,
      first_name: string,
      last_name: string,
      phone_number: string,
      status: string,
      remarks: string,
      user_opinion: string,
      otp: string,
      is_otp_verified: boolean, //
      is_otp_phone_verified: boolean,
      is_verified_user: boolean,
      otp_generated_at: string,
      otp_expiry: string,
      user_type: string, //
      is_deleted: boolean, //
      groups: [],
      user_permissions: []
  
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
      otp_generated_at: string;
      otp_expiry: string;
      user_type: string;
      is_deleted: boolean;
      groups: [],
      user_permissions: []
  }