import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/admin-login/', '/api/'],
    },
    sitemap: 'https://gypshopila.vercel.app/sitemap.xml',
  }
}
