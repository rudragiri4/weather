export const SITE_METADATA = {
  name: 'WeatherSphere',
  title: 'WeatherSphere - Live Weather Radar, Forecasts & Air Quality',
  description: 'Real-time global weather radar, Windy-style wind maps, 7-day weather forecast, air quality index, and localized weather alerts.',
  url: 'https://weathersphere.app',
  ogImage: 'https://weathersphere.app/og-image.png',
  twitterHandle: '@WeatherSphereApp',
  author: 'WeatherSphere Team'
};

export const generateWeatherSchema = (locationName, currentTemp, conditionText, minTemp, maxTemp) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Place',
    'name': locationName,
    'geo': {
      '@type': 'GeoCoordinates',
    },
    'event': {
      '@type': 'Event',
      'name': `Weather Forecast for ${locationName}`,
      'description': `Current weather condition in ${locationName} is ${conditionText} with a temperature of ${currentTemp}°C.`
    }
  };
};

export const generateFAQSchema = (faqs) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
};

export const generateBreadcrumbSchema = (items) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, idx) => ({
      '@type': 'ListItem',
      'position': idx + 1,
      'name': item.name,
      'item': `${SITE_METADATA.url}${item.path}`
    }))
  };
};
