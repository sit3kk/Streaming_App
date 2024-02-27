export interface Room {
    room_id: string;
    room_name: string;
    room_topic: string;
    room_description: string;
    room_owner: string;
    created_at: string;
    viewers: number;
    private: boolean;
  }
