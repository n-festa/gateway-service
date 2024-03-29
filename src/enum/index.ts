export enum Role {
  Customer = 'customer',
  Admin = 'admin',
  RestaurantOwner = 'Restaurant_owner',
  RestaurantStaff = 'Restaurant_staff',
}

export enum PhysicalActivityLevel {
  Light = 'Light',
  Moderate = 'Moderate',
  Vigorous = 'Vigorous',
}

export enum FetchMode {
  Some = 'some',
  Full = 'full',
}

export enum SEX {
  FEMALE = 'F',
  MALE = 'M',
  OTHER = 'O',
}

export enum FILE_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum OrderStatus {
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  DELIVERING = 'DELIVERING',
  FAILED = 'FAILED',
  IDLE = 'IDLE',
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
  STUCK = 'STUCK',
}
