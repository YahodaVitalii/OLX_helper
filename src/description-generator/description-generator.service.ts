import { BadRequestException, Injectable } from '@nestjs/common';
import { Laptop, ProductDetails, ProductType } from '@prisma/client';
import { DESCRIPTION_TEXTS } from './constants/description-texts';
import { ReadProductDto } from '../api/products/product-dto/read-product.dto';

@Injectable()
export class DescriptionGeneratorService {
  constructor() {}

  generateDescription(product: ReadProductDto): string {
    const details = product.ProductDetails as ProductDetails;
    if (!details) {
      throw new Error('Product details not found');
    }
    return this.ReadProductDto(details, product);
  }

  private ReadProductDto(
    details: ProductDetails,
    product: ReadProductDto,
  ): string {
    const lines: string[] = [];
    lines.push(DESCRIPTION_TEXTS.greeting);
    lines.push(this.generateCharacteristics(product));

    if (details.includedAccessories) {
      lines.push(DESCRIPTION_TEXTS.accessories(details.includedAccessories));
    }

    if (details.features) {
      lines.push(DESCRIPTION_TEXTS.featuresHeader);
      lines.push(details.features);
    }

    if (details.disadvantages) {
      lines.push(DESCRIPTION_TEXTS.disadvantagesHeader);
      lines.push(details.disadvantages);
    }

    return lines.join('\n');
  }

  private generateCharacteristics(product: ReadProductDto): string {
    const type: ProductType = product.type;

    if (type === ProductType.OTHER) {
      if (!product.ProductDetails || !product.ProductDetails.characteristics) {
        throw new BadRequestException('Characteristics is empty');
      }
      if (!product.ProductAdvert) {
        throw new BadRequestException('ProductAdvert is empty');
      }
      return product.ProductAdvert.description;
    } else if (type === ProductType.LAPTOP) {
      return this.generateLaptopDescription(product.Laptop as Laptop);
    } else {
      throw new BadRequestException(`Type: ${String(type)} is not supported`);
    }
  }

  private generateLaptopDescription(laptop: Laptop): string {
    const lines: string[] = [];

    lines.push(
      DESCRIPTION_TEXTS.sellIntro(laptop.brand, laptop.subBrand, laptop.model),
    );
    lines.push(DESCRIPTION_TEXTS.characteristicsHeader);

    const processorLine = laptop.processorModel
      ? `${laptop.processor} ${laptop.processorModel}`
      : (laptop.processor ?? null);
    if (processorLine) lines.push(DESCRIPTION_TEXTS.processor(processorLine));
    if (laptop.ramSize) lines.push(DESCRIPTION_TEXTS.ram(laptop.ramSize));
    if (laptop.hardDrive)
      lines.push(DESCRIPTION_TEXTS.storage(laptop.hardDrive));
    if (laptop.graphicCard)
      lines.push(DESCRIPTION_TEXTS.gpu(laptop.graphicCard));

    const screenParts: string[] = [];
    if (laptop.screenSize) screenParts.push(`${laptop.screenSize}`);
    if (laptop.screenRefreshRate)
      screenParts.push(`(${laptop.screenRefreshRate} Гц)`);
    if (screenParts.length)
      lines.push(DESCRIPTION_TEXTS.screen(screenParts.join(' ')));

    if (laptop.batteryStatus === 'Absent') {
      lines.push(DESCRIPTION_TEXTS.battery.absent);
    } else if (laptop.batteryStatus === 'Not_Working') {
      lines.push(DESCRIPTION_TEXTS.battery.notWorking);
    } else if (laptop.batteryStatus === 'Working') {
      lines.push(DESCRIPTION_TEXTS.battery.working(laptop.batteryWear));
    }

    return lines.join('\n');
  }
}
