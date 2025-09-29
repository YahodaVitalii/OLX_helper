import { NovaPoshtaBaseResponse } from './nova-poshta-api-response.interface';

export interface NovaPoshtaContactPersonResponse
  extends NovaPoshtaBaseResponse {
  data: Array<{
    Ref: string;
    Description: string;
    Phones: string;
  }>;
}
