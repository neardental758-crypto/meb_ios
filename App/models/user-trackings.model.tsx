export interface UserTracking {
  id: boolean,
  traffic: boolean,
  dangerousDescent: boolean,
  roadCondition: boolean,
  bikeway: boolean,
  accessibility: boolean,
  funFactor: boolean,
  speed: string,
  name: string,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  userId: string,
  challengeId: string,
  deviceId: string
}