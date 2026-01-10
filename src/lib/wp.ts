// src/lib/wp.ts

const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    // @ts-ignore
    return process.env[key];
  }
  if (import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  return '';
};

const WP_API_URL = getEnv('INTERNAL_WP_API_URL') || getEnv('PUBLIC_WP_API_URL');

async function fetchAPI(query: string, { variables }: { variables?: any } = { variables: {} }) {
  const headers = { 'Content-Type': 'application/json' };
  
  if (!WP_API_URL) return null;

  try {
    const res = await fetch(WP_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors) {
      console.error('[WP GraphQL Error]', json.errors[0].message);
      return null;
    }
    return json.data;
  } catch (error) {
    console.error(`[WP Fetch Error] Failed to connect to WP`);
    return null;
  }
}

function processServiceNode(node: any) {
  if (!node) return null;
  return {
    title: node.title,
    slug: node.slug,
    content: node.content, 
    image: node.featuredImage?.node?.sourceUrl || '/images/hero-poster.jpg',
    icon: node.acfService?.iconUrl || '',
    description: node.acfService?.shortDescription || '',
    link: `/services/${node.slug}`
  };
}

export async function getServices() {
  const data = await fetchAPI(`
    query GetServices {
      services(first: 100) {
        nodes {
          title
          slug
          content(format: RENDERED)
          featuredImage {
            node { sourceUrl }
          }
          acfService {
            iconUrl
            shortDescription
          }
        }
      }
    }
  `);
  return data?.services?.nodes.map(processServiceNode) || [];
}

export async function getServiceBySlug(slug: string) {
  const data = await fetchAPI(`
    query GetServiceBySlug($id: ID!) {
      service(id: $id, idType: SLUG) {
        title
        slug
        content(format: RENDERED)
        featuredImage {
          node { sourceUrl }
        }
        acfService {
          iconUrl
          shortDescription
        }
      }
    }
  `, { variables: { id: slug } });

  if (!data?.service) return null;
  return processServiceNode(data.service);
}

export async function getPortfolioItems() {
  // ВАЖНО: Тут мы добавили .node перед sourceUrl, чтобы убрать ошибку
  const data = await fetchAPI(`
    query GetPortfolio {
      projects(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          acfProject {
            location
            area
            duration
            beforeImage {
              node { sourceUrl }
            }
            afterImage {
              node { sourceUrl }
            }
          }
        }
      }
    }
  `);
  
  if (!data) return [];

  return data.projects?.nodes.map((node: any) => ({
    title: node.title,
    location: node.acfProject?.location || '',
    area: node.acfProject?.area || '',
    duration: node.acfProject?.duration || '',
    // ВАЖНО: Тут тоже добавили .node
    before: node.acfProject?.beforeImage?.node?.sourceUrl || '',
    after: node.acfProject?.afterImage?.node?.sourceUrl || '',
    alt: `Project: ${node.title}`
  })) || [];
}

export async function getPricingPlans() {
  const data = await fetchAPI(`
    query GetPricing {
      pricingPlans(first: 10) {
        nodes {
          title
          acfPricing {
            price
            type
            description
            isPopular
            featuresRaw
          }
        }
      }
    }
  `);
  
  if (!data) return [];

  return data.pricingPlans?.nodes.map((node: any) => ({
    name: node.title,
    price: node.acfPricing?.price || '',
    type: node.acfPricing?.type || '',
    description: node.acfPricing?.description || '',
    isPopular: node.acfPricing?.isPopular || false,
    features: node.acfPricing?.featuresRaw
      ? node.acfPricing.featuresRaw.split('\n').map((line: string) => {
          const text = line.trim();
          const isExcluded = text.startsWith('-');
          return {
            name: isExcluded ? text.substring(1).trim() : text,
            included: !isExcluded
          };
        }).filter((f: any) => f.name.length > 0)
      : []
  })) || [];
}
