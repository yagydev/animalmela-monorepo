import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  ServiceUnavailableException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';

const EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

@Injectable()
export class StorageService {
  private client: S3Client | null = null;

  constructor(private config: ConfigService) {}

  private getS3(): S3Client {
    if (!this.client) {
      const region = this.config.get<string>('AWS_REGION');
      if (!region) {
        throw new ServiceUnavailableException('AWS_REGION is not set');
      }
      this.client = new S3Client({ region });
    }
    return this.client;
  }

  private assertBucket(): string {
    const bucket = this.config.get<string>('AWS_S3_BUCKET')?.trim();
    if (!bucket) {
      throw new ServiceUnavailableException(
        'AWS S3 is not configured (set AWS_S3_BUCKET and credentials)',
      );
    }
    return bucket;
  }

  /** Presigned PUT URL for direct browser upload; returns public URL to store on Product.imageUrls. */
  async presignProductImageUpload(
    sellerUserId: string,
    contentType: string,
  ): Promise<{
    key: string;
    uploadUrl: string;
    publicUrl: string;
    expiresInSeconds: number;
  }> {
    const ext = EXT[contentType];
    if (!ext) {
      throw new BadRequestException('Unsupported content type for product image');
    }
    const bucket = this.assertBucket();
    const region = this.config.get<string>('AWS_REGION');
    if (!region) {
      throw new ServiceUnavailableException('AWS_REGION is not set');
    }

    const key = `product-images/${sellerUserId}/${randomUUID()}.${ext}`;
    const expiresInSeconds = 900;
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    });
    const uploadUrl = await getSignedUrl(this.getS3(), command, {
      expiresIn: expiresInSeconds,
    });

    const cdn = this.config.get<string>('PUBLIC_CDN_BASE')?.replace(/\/$/, '');
    const publicUrl = cdn
      ? `${cdn}/${key}`
      : `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { key, uploadUrl, publicUrl, expiresInSeconds };
  }
}
