import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
const s3 = new S3Client({ region: process.env.AWS_REGION });

export const deleteBucketObject = async (id: string) => {
  try {
    const data = await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: id,
      }),
    );
    console.log('Success. Object deleted.', data);
    return data;
  } catch (err) {
    console.log('Error', err);
  }
};

export default s3;
