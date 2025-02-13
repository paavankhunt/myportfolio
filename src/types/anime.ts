export interface Anime {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  alternative_titles: {
    synonyms: string[];
    en?: string;
    ja?: string;
  };
  start_date: string;
  end_date?: string;
  synopsis: string;
  mean: number;
  rank: number;
  popularity: number;
  num_list_users: number;
  num_scoring_users: number;
  nsfw: string;
  created_at: string;
  updated_at: string;
  media_type: string;
  status: string;
  genres: {
    id: number;
    name: string;
  }[];
  num_episodes: number;
  start_season?: {
    year: number;
    season: string;
  };
  broadcast?: {
    day_of_the_week: string;
    start_time: string;
  };
  source: string;
  average_episode_duration: number;
  rating: string;
  pictures: {
    medium: string;
    large: string;
  }[];
  background?: string;
  related_anime: {
    node: {
      id: number;
      title: string;
      main_picture?: {
        medium: string;
        large: string;
      };
    };
    relation_type: string;
    relation_type_formatted: string;
  }[];
  related_manga: {
    node: {
      id: number;
      title: string;
      main_picture?: {
        medium: string;
        large: string;
      };
    };
  }[];
  recommendations: {
    node: {
      id: number;
      title: string;
      main_picture?: {
        medium: string;
        large: string;
      };
    };
    num_recommendations: number;
  }[];
  studios: {
    id: number;
    name: string;
  }[];
  statistics: {
    status: {
      watching: string;
      completed: string;
      on_hold: string;
      dropped: string;
      plan_to_watch: string;
    };
    num_list_users: number;
  };
  my_list_status?: {
    status: string;
    score: number;
    num_episodes_watched: number;
    is_rewatching: boolean;
    updated_at: string;
  };
}

export interface AnimeListResponse {
  data: { node: Anime; my_list_status?: Anime['my_list_status'] }[];
}

export interface Manga {
  id: number;
  title: string;
  main_picture: {
    medium: string;
    large: string;
  };
  alternative_titles: {
    synonyms: string[];
    en?: string;
    ja?: string;
  };
  start_date: string;
  end_date?: string;
  synopsis: string;
  mean: number;
  rank: number;
  popularity: number;
  num_list_users: number;
  num_scoring_users: number;
  nsfw: string;
  created_at: string;
  updated_at: string;
  media_type: string;
  status: string;
  genres: {
    id: number;
    name: string;
  }[];
  num_volumes: number;
  num_chapters: number;
  source: string;
  pictures: {
    medium: string;
    large: string;
  }[];
  background?: string;
  related_manga: {
    node: {
      id: number;
      title: string;
      main_picture?: {
        medium: string;
        large: string;
      };
    };
  }[];
  recommendations: {
    node: {
      id: number;
      title: string;
      main_picture?: {
        medium: string;
        large: string;
      };
    };
    num_recommendations: number;
  }[];
  authors: {
    id: number;
    name: string;
  }[];
  serialization: {
    id: number;
    name: string;
  }[];
  statistics: {
    status: {
      reading: string;
      completed: string;
      on_hold: string;
      dropped: string;
      plan_to_read: string;
    };
    num_list_users: number;
  };
  my_list_status?: {
    status: string;
    score: number;
    num_chapters_read: number;
    is_rereading: boolean;
    updated_at: string;
    num_volumes_read: number;
  };
}

export interface MangaListResponse {
  data: { node: Manga; my_list_status?: Manga['my_list_status'] }[];
}
