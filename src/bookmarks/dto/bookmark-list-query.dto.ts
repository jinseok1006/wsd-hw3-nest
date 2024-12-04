export class BookmarkListQueryDto {
    page?: number; // Default to 1
    limit?: number; // Default to 20
    sort?: 'latest' | 'oldest'; // Default to 'latest'
  }
  