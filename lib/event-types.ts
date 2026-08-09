export type AdminEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  thumbnailUrl: string | null;
  photoUrls: string[];
  hosts: string[];
  folderSlug: string | null;
};