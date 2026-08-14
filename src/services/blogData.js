export const BLOG_POSTS = [
  {
    id: 'understanding-wind-vector-maps',
    slug: 'understanding-wind-vector-maps',
    title: 'How to Read Wind Vector Maps Like a Professional Meteorologist',
    category: 'Meteorology 101',
    author: 'Dr. Evelyn Vance',
    role: 'Lead Atmospheric Scientist',
    date: 'July 28, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    summary: 'Wind maps are the heartbeat of modern atmospheric forecasting. Learn how pressure gradients, jet streams, and particle vector fields dictate global storm tracks.',
    content: `
      <h2>The Physics Behind Wind Vector Visualization</h2>
      <p>Modern weather platforms like <strong>WeatherSphere</strong> utilize particle animation streamlines to visualize wind vector fields. Every particle movement represents the speed, direction, and momentum of air parcels moving across atmospheric layers.</p>
      
      <h3>1. Isobars and Pressure Gradients</h3>
      <p>Wind is driven by atmospheric pressure differences. Air naturally flows from areas of high barometric pressure to low barometric pressure. The closer the isobaric contour lines are together, the tighter the pressure gradient—and the stronger the resulting wind speeds.</p>

      <h3>2. The Coriolis Effect</h3>
      <p>Because the Earth rotates on its axis, air parcels do not travel in a straight line from high to low pressure. In the Northern Hemisphere, winds curve to the right, creating counter-clockwise circulation around low-pressure cyclonic systems. In the Southern Hemisphere, winds curve to the left.</p>

      <h3>3. Reading Beaufort Scale Colors</h3>
      <p>Our wind overlay uses standard meteorological color scales:</p>
      <ul>
        <li><strong>Cyan to Blue (0 - 20 km/h):</strong> Gentle breezes, calm surface conditions.</li>
        <li><strong>Yellow to Orange (25 - 50 km/h):</strong> Moderate to strong breezes, small tree branches in motion.</li>
        <li><strong>Red to Magenta (60+ km/h):</strong> Gale force winds to tropical storm velocity. Severe precaution required.</li>
      </ul>
    `
  },
  {
    id: 'air-quality-index-guide-2026',
    slug: 'air-quality-index-guide-2026',
    title: 'The Ultimate Guide to Understanding AQI & Particulate Matter (PM2.5 vs PM10)',
    category: 'Air Quality & Health',
    author: 'Marcus Brody',
    role: 'Environmental Health Specialist',
    date: 'July 15, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
    summary: 'Air Quality Index numbers dictate outdoor safety. Discover how micro particulate matter impacts respiratory health and how to protect your family during high pollution days.',
    content: `
      <h2>Decoding the Air Quality Index (AQI)</h2>
      <p>The Air Quality Index is a standardized scale running from 0 to 500. It measures five major air pollutants regulated by atmospheric protection agencies worldwide: ground-level ozone, particulate pollution (PM2.5 & PM10), carbon monoxide, sulfur dioxide, and nitrogen dioxide.</p>

      <h3>PM2.5 vs. PM10: What is the Difference?</h3>
      <p><strong>PM2.5</strong> refers to fine inhalable particles with diameters 2.5 micrometers or smaller. They stem from vehicle emissions, forest fires, and industrial combustion. Because of their tiny size, PM2.5 can penetrate deep into lung tissue and enter the bloodstream.</p>
      <p><strong>PM10</strong> consists of coarse dust, pollen, and mold particles with diameters up to 10 micrometers. While less invasive than PM2.5, high PM10 levels irritate the upper respiratory tract and eyes.</p>

      <h3>Actionable Steps During High AQI Alerts</h3>
      <ul>
        <li><strong>AQI 100 - 150:</strong> Sensitive individuals should reduce prolonged outdoor exertion.</li>
        <li><strong>AQI 150 - 200:</strong> Wear HEPA-rated N95 respirators outdoors and run indoor air purifiers.</li>
        <li><strong>AQI 200+:</strong> Keep windows sealed and limit outdoor physical activities to early morning hours.</li>
      </ul>
    `
  },
  {
    id: 'how-do-doppler-radars-work',
    slug: 'how-do-doppler-radars-work',
    title: 'Inside Precipitation Radar: How Radar Echoes Predict Rain & Hail',
    category: 'Technology',
    author: 'Sarah Lin',
    role: 'Radar Systems Engineer',
    date: 'June 30, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=1200&q=80',
    summary: 'Doppler weather radars emit high-frequency microwave pulses that bounce off raindrops, snowflakes, and hailstones. Learn how echo reflectivity translates into precipitation intensity maps.',
    content: `
      <h2>From Microwave Pulses to Rainfall Rates</h2>
      <p>Doppler radar antennas send out brief pulses of radio waves. As these electromagnetic waves travel through the atmosphere, they strike precipitation droplets. A small fraction of that energy bounces back to the radar receiver—a measurement known as <strong>Radar Reflectivity (dBZ)</strong>.</p>

      <h3>Understanding dBZ Reflectivity Colors</h3>
      <ul>
        <li><strong>15 - 30 dBZ (Light Green):</strong> Light rain or drizzle. Often evaporates before hitting the ground (virga).</li>
        <li><strong>35 - 50 dBZ (Dark Green to Yellow):</strong> Moderate to heavy steady rainfall.</li>
        <li><strong>55+ dBZ (Red to Violet):</strong> Intense torrential rain, severe thunderstorms, and probable hail.</li>
      </ul>
    `
  }
];

export const BLOG_CATEGORIES = ['All', 'Meteorology 101', 'Air Quality & Health', 'Technology', 'Climate & Science'];
