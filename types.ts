export interface AudioState {
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TTSRequest {
  text: string;
}
