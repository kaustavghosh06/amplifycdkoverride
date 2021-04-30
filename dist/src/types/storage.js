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
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3ServiceResourceStack = void 0;
const iam = __importStar(require("@aws-cdk/aws-iam"));
const s3 = __importStar(require("@aws-cdk/aws-s3"));
const cdk = __importStar(require("@aws-cdk/core"));
class S3ServiceResourceStack extends cdk.Stack {
    constructor(scope, id, serviceResourceProps, props) {
        super(scope, id);
        const s = new s3.CfnBucket(this, "S3Bucket", serviceResourceProps === null || serviceResourceProps === void 0 ? void 0 : serviceResourceProps.S3Bucket);
        new iam.CfnPolicy(this, "S3AuthPublicPolicy", serviceResourceProps === null || serviceResourceProps === void 0 ? void 0 : serviceResourceProps.S3AuthPublicPolicy);
        this.cfnstring = this._toCloudFormation();
    }
}
exports.S3ServiceResourceStack = S3ServiceResourceStack;
