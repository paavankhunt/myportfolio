import { ClientConfig, createClient } from '@sanity/client';

const clientConfig: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  dataset: 'production',
  useCdn: false,
};

const client = createClient(clientConfig);

export default client;
