export interface NovaPoshtaInternetDocumentPayload {
  apiKey: string;
  modelName: 'InternetDocument';
  calledMethod: 'save';
  methodProperties: {
    NewAddress: '1';
    PayerType: 'Sender' | 'Recipient';
    PaymentMethod: 'Cash' | 'NonCash';
    CargoType: 'Parcel' | 'Cargo';
    Weight: string;
    ServiceType: 'WarehouseWarehouse' | 'DoorsWarehouse';
    SeatsAmount: string;
    Description: string;
    Cost: number;
    CitySender: string;
    Sender: string;
    SenderAddress: string;
    ContactSender: string;
    SendersPhone: string;
    RecipientCity: string;
    RecipientAddress: string;
    RecipientName: string;
    RecipientType: 'PrivatePerson';
    RecipientsPhone: string;
  };
}
