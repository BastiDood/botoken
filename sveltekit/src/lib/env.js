import { PUBLIC_DEPLOYMENT_ADDRESS } from '$env/static/public';
import { assert } from './assert';

assert(PUBLIC_DEPLOYMENT_ADDRESS, 'empty deployment address');

export default { DEPLOYMENT_ADDRESS: PUBLIC_DEPLOYMENT_ADDRESS };
