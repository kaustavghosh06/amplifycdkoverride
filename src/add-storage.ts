import * as fs from 'fs-extra';
import path from 'path';
import * as cdk from '@aws-cdk/core';
import { AmplifyStorageResourceProps, S3ServiceResourceStack } from './types/storage';


const resourceDir = path.join(process.cwd(), `amplify/storage/s3resource`);

const cliInputs = addStorage();
compileStorage(cliInputs);

export function addStorage() {
  // Create amplify directory
  fs.ensureDirSync(resourceDir);

  // create cli-inputs.json - mock it for now but inputs from CLI I/O

  const bucketName = process.argv[2] || "myawesomebucket";

  const inputs = { bucketName };

  fs.writeFileSync(path.join(resourceDir, 'cli-inputs.json'), JSON.stringify(inputs, null, 4));

  return inputs;
}

export function compileStorage(cliInputs: any) {


  // Validate cli-inputs.json

  // Form AmplifyStorageResource object from cli-inputs.json

  const amplifyResource: AmplifyStorageResourceProps = {
    S3Service: {
      S3Bucket: {
        bucketName: cliInputs.bucketName
      },
      S3AuthPublicPolicy: {
        policyName: "s3_auth_public_policy",
        policyDocument: {
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Sid": "1234567890",
                  "Effect": "Allow",
                  "Action": "*",
                  "Resource": "*"
              }
          ]
        }
      },
    }
  };

  // Pass object to overrides which modifies AmplifyStorageResource

  const overridePropsPath = path.join('/Users/kaustavg/tssample/dist/amplify/storage/s3resource', 'override.js');
  const {overrideProps} = require(overridePropsPath);
  

  overrideProps(amplifyResource);

  fs.ensureDirSync(path.join(resourceDir, 'build'));

  
  // generate parameters.json from AmplifyStorageResource object

  fs.writeFileSync(path.join(resourceDir, 'build/parameters.json'), JSON.stringify({}, null, 4));


  // generate cloudformaion-template.json &  from AmplifyStorageResource object
  const app = new cdk.App();
  const resourceStack = new S3ServiceResourceStack(app, "StorageResource", amplifyResource.S3Service);

  const {overrideStack, S3ServiceResourceStackOverride} = require(overridePropsPath);


  const overriddenResourceStack = new S3ServiceResourceStackOverride(app, "StorageResource2", amplifyResource.S3Service);

  //console.log(JSON.stringify(resourceStack.cfnstring));
  //console.log(JSON.stringify(overriddenResourceStack.cfnstring));


  fs.writeFileSync(path.join(resourceDir, 'build/cloudformation.json'), JSON.stringify(resourceStack.cfnstring, null, 4));


}
