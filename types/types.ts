
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
