import { NovaPoshtaBaseResponse } from './nova-poshta-api-response.interface';

export interface NovaPoshtaWarehouseResponse extends NovaPoshtaBaseResponse {
  data: Array<{
    Ref: string;
    Description: string;
    Number: string;
  }>;
}
