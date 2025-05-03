export interface Photo {
  id: number;
  group_id: number;
  user_id: number | null;
  file_name: string;
  uploaded_at: string;
  face_processed: boolean;
}

export interface Face {
  face_id: number;
  photo_id: number;
  location: [number, number, number, number];
  image_url: string;
}

export interface Person {
  person_id: number;
  name: string;
  thumbnail_url: string;
}

