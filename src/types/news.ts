export const TTypeNews = {
  "1": "Press Release",
  "2": "FAQ",
  "3": "Berita",
  "4": "Artikel",
  "5": "Video",
};

export interface INews {
  id: string;
  type_id: ITypeNews["id"]; // 1 => press_release, 2 => FAQ, 3 => Berita, 4 => Artikel
  status_id: IStatusNews["id"];
  lembaga_id: any;
  title: string;
  body: string;
  short_description: string;
  thumbnail_url: string;
  campaign_id: string;
  campaign_title: string;
  slug: string;
  attachments: string[];
  autor_id: string;
  author_name: string;
  author_lembaga: string;
  gads_script: string;
  pixel_script: string;
  published_at: string;
}

export interface IStatusNews {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ITypeNews {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
