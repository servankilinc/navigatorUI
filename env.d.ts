// BUR DOSYA ENV DEĞİKENLERİNİN TİP GÜVENLİĞİ İÇİN EKLENDİ
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_CENTER_LNG: number;
  readonly VITE_CENTER_LAT: number;
  readonly VITE_MIN_ZOOM: number;
  readonly VITE_MAX_ZOOM: number;
  readonly VITE_ZOOM: number;
  readonly VITE_CURRENT_LNG: number;
  readonly VITE_CURRENT_LAT: number;
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}
