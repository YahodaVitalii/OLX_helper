import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ProductRepository } from './products.repository';
import { RequestWithUser } from '../../types/req-with-user.interface';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly productRepository: ProductRepository) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userId = request.user.userId;
    const productId = parseInt(request.params.id, 10);

    if (!userId || !productId) {
      throw new ForbiddenException(
        'Access denied: missing user or product ID.',
      );
    }

    const isOwned = await this.productRepository.isProductOwnedByUser(
      productId,
      userId,
    );

    if (!isOwned) {
      throw new ForbiddenException('You do not own this product.');
    }

    return true;
  }
}
