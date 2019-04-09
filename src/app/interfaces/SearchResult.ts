export class SearchResult {
  "1. symbol": "G";
  "2. name": "Genpact Limited";
  "3. type": "Equity";
  "4. region": "United States";
  "5. marketOpen": "09:30";
  "6. marketClose": "16:00";
  "7. timezone": "UTC-04";
  "8. currency": "USD";
  "9. matchScore": "1.0000";
}

export interface ISearchResult {
  symbol: string;
  name: string;
  region: string;
  currency: string;
}

