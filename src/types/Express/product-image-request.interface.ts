import { Request } from 'express';

export interface ProductImageRequest extends Request {
  params: {
    productId: string;
    imageId?: string;
  };
  body: {
    targetImageIds?: string;
  };
}
