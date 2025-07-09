import PocketBase from 'pocketbase';

// The default URL for a local PocketBase instance.
// Ensure your PocketBase server is running and accessible at this address.
const POCKETBASE_URL = 'http://127.0.0.1:8090';

const pb = new PocketBase(POCKETBASE_URL);

// It's recommended to disable auto-cancellation for React-based apps
// to prevent issues with state updates and effects.
pb.autoCancellation(false);

export default pb;
