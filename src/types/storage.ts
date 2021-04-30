import { CfnStackProps, StackProps } from '@aws-cdk/core';
import { CfnBucket, CfnBucketProps } from '@aws-cdk/aws-s3';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import { CfnPolicyProps } from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

export interface AmplifyStorageResourceProps {
    S3Service?: S3ServiceResourceProps
    DynamoDBService?: {}
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type writeableCfnBucketProps = Writeable<CfnBucketProps>;
type writeableCfnPolicyProps = Writeable<CfnPolicyProps>;

interface S3ServiceResourceProps {
    S3Bucket?: writeableCfnBucketProps
    S3AuthPublicPolicy?: writeableCfnPolicyProps 
    S3AuthProtectedPolicy?: writeableCfnPolicyProps 
    S3AuthPrivatePolicy?:  writeableCfnPolicyProps 
    S3AuthUploadPolicy?: writeableCfnPolicyProps 
    S3AuthReadPolicy?: writeableCfnPolicyProps 
    S3GuestPublicPolicy?: writeableCfnPolicyProps 
    S3GuestUploadPolicy?: writeableCfnPolicyProps 
    S3GuestReadPolicy?: writeableCfnPolicyProps
}

export class S3ServiceResourceStack extends cdk.Stack {

    cfnstring: string;
    constructor(scope: cdk.Construct, id: string,serviceResourceProps?: S3ServiceResourceProps, props?: cdk.StackProps) {
        super(scope, id);
        const s = new s3.CfnBucket(this, "S3Bucket", serviceResourceProps?.S3Bucket);
        new iam.CfnPolicy(this, "S3AuthPublicPolicy", serviceResourceProps?.S3AuthPublicPolicy)
        this.cfnstring = this._toCloudFormation();
    }

}

