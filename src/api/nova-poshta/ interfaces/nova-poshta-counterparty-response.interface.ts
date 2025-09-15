import { NovaPoshtaBaseResponse } from './nova-poshta-api-response.interface';

export interface NovaPoshtaCounterpartyResponse extends NovaPoshtaBaseResponse {
  data: Array<{
    Ref: string;
  }>;
}
