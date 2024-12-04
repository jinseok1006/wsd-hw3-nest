export class ToggleBookmarkDto {
    jobId: number;
    action: 'added' | 'removed';
    timestamp: string; // ISO format
  }
  