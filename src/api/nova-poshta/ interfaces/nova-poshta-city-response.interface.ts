import { NovaPoshtaBaseResponse } from './nova-poshta-api-response.interface';

export interface NovaPoshtaCityResponse extends NovaPoshtaBaseResponse {
  data: Array<{
    Ref: string;
    Description: string;
  }>;
}
