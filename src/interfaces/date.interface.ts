export interface DateData {
    day: number;
    month: number;
    year: number
}

export interface HistoricalEvent {
    isBeforeJesus: boolean;
    year: number;
    content: string;
  }
  
  export interface ApiResponse {
    message: string;
    date: string;
    dateData: {
      day: number;
      month: number;
      year: number;
    };
    scrapedData: {
      births: HistoricalEvent[];
      events: HistoricalEvent[];
      deaths: HistoricalEvent[];
    };
  }