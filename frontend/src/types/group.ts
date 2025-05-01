// src/types/group.ts
export interface GroupType {
  id: number;
  name: string;
  description?: string;
  category?: string;
  image_url?: string;
  locked_amount?: number;
}
