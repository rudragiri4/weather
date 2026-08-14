import React, { useEffect } from 'react';
import { SITE_METADATA } from '../../utils/seoConfig';

export const SEOHead = ({ 
  title, 
  description, 
  canonicalPath = '', 
  ogType = 'website',
  schemaData = null 
}) => {
  const fullTitle = title ? `${title} | WeatherSphere` : SITE_METADATA.title;
  const fullDesc = description || SITE_METADATA.description;
  const fullUrl = `${SITE_METADATA.url}${canonicalPath}`;

  useEffect(() => {
    document.title = fullTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = fullDesc;

    // OpenGraph
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.content = fullTitle;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.content = fullDesc;

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement('meta');
      ogUrl.setAttribute('property', 'og:url');
      document.head.appendChild(ogUrl);
    }
    ogUrl.content = fullUrl;

    // Inject JSON-LD Schema
    const scriptId = 'json-ld-schema';
    let scriptTag = document.getElementById(scriptId);
    if (schemaData) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schemaData);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [fullTitle, fullDesc, fullUrl, schemaData]);

  return null;
};
