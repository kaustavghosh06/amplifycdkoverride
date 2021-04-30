"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileStorage = exports.addStorage = void 0;
const fs = __importStar(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const cdk = __importStar(require("@aws-cdk/core"));
const storage_1 = require("./types/storage");
const resourceDir = path_1.default.join(process.cwd(), `amplify/storage/s3resource`);
const cliInputs = addStorage();
compileStorage(cliInputs);
function addStorage() {
    // Create amplify directory
    fs.ensureDirSync(resourceDir);
    // create cli-inputs.json - mock it for now but inputs from CLI I/O
    const bucketName = process.argv[2] || "myawesomebucket";
    const inputs = { bucketName };
    fs.writeFileSync(path_1.default.join(resourceDir, 'cli-inputs.json'), JSON.stringify(inputs, null, 4));
    return inputs;
}
exports.addStorage = addStorage;
function compileStorage(cliInputs) {
    // Validate cli-inputs.json
    // Form AmplifyStorageResource object from cli-inputs.json
    const amplifyResource = {
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
    const overridePropsPath = path_1.default.join('/Users/kaustavg/tssample/dist/amplify/storage/s3resource', 'override.js');
    const { overrideProps } = require(overridePropsPath);
    overrideProps(amplifyResource);
    fs.ensureDirSync(path_1.default.join(resourceDir, 'build'));
    // generate parameters.json from AmplifyStorageResource object
    fs.writeFileSync(path_1.default.join(resourceDir, 'build/parameters.json'), JSON.stringify({}, null, 4));
    // generate cloudformaion-template.json &  from AmplifyStorageResource object
    const app = new cdk.App();
    const resourceStack = new storage_1.S3ServiceResourceStack(app, "StorageResource", amplifyResource.S3Service);
    const { overrideStack, S3ServiceResourceStackOverride } = require(overridePropsPath);
    const overriddenResourceStack = new S3ServiceResourceStackOverride(app, "StorageResource2", amplifyResource.S3Service);
    //console.log(JSON.stringify(resourceStack.cfnstring));
    //console.log(JSON.stringify(overriddenResourceStack.cfnstring));
    fs.writeFileSync(path_1.default.join(resourceDir, 'build/cloudformation.json'), JSON.stringify(resourceStack.cfnstring, null, 4));
}
exports.compileStorage = compileStorage;
