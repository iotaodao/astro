// src/lib/wp.ts
const WP_API_URL = import.meta.env.PUBLIC_WP_API_URL;

async function fetchAPI(query: string, { variables }: { variables?: any } = { variables: {} }) {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const res = await fetch(WP_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error('WP GraphQL Errors:', json.errors);
      throw new Error('Failed to fetch WP API');
    }
    return json.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function getServices() {
  const data = await fetchAPI(`
    query GetServices {
      services(first: 100) {
        nodes {
          title
          slug
          seasons {
            nodes {
              slug
              name
            }
          }
          acfService {
            iconUrl
            shortDescription
          }
        }
      }
    }
  `);
  
  return data?.services?.nodes.map((node: any) => ({
    title: node.title,
    icon: node.acfService.iconUrl, // Expecting a URL string or icon name in Free version
    description: node.acfService.shortDescription,
    seasons: node.seasons?.nodes ? node.seasons.nodes.map((s: any) => s.slug) : [],
    link: `/services/${node.slug}`
  })) || [];
}

export async function getPortfolioItems() {
  const data = await fetchAPI(`
    query GetPortfolio {
      projects(first: 5, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          title
          acfProject {
            location
            area
            duration
            beforeImage { sourceUrl }
            afterImage { sourceUrl }
          }
        }
      }
    }
  `);
  
  return data?.projects?.nodes.map((node: any) => ({
    title: node.title,
    location: node.acfProject.location,
    area: node.acfProject.area,
    duration: node.acfProject.duration,
    before: node.acfProject.beforeImage?.sourceUrl,
    after: node.acfProject.afterImage?.sourceUrl,
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
  
  return data?.pricingPlans?.nodes.map((node: any) => ({
    name: node.title,
    price: node.acfPricing.price,
    type: node.acfPricing.type,
    description: node.acfPricing.description,
    isPopular: node.acfPricing.isPopular,
    // Parsing logic for ACF Free (Text Area split by newline)
    features: node.acfPricing.featuresRaw
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
