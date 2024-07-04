import React from 'react';
import TopNav from '../pages/AdmTopNav';

const AboutUs = () => {
  return (
    <div>
      <TopNav />
      <div style={styles.container}>
        <h1 style={styles.heading}>About Usha Martin</h1>
        <p style={styles.paragraph}>
          Usha Martin is a global leader in the wire rope industry, known for its dedication to quality, innovation, and customer satisfaction. Established in 1960, Usha Martin has grown from a small wire rope manufacturing company in Ranchi, India, to a multinational corporation with a significant global footprint.
        </p>

        <h2 style={styles.subHeading}>Our Vision & Mission</h2>
        <p style={styles.paragraph}>
          Our vision is to be the most trusted and preferred partner for wire rope solutions across diverse industries worldwide. We aim to achieve this through continuous innovation, customer-centric approach, and a commitment to excellence.
        </p>
        <p style={styles.paragraph}>
          Our mission is to deliver high-quality wire rope solutions that meet the highest standards of safety and performance, while fostering a culture of sustainability and corporate responsibility.
        </p>

        <h2 style={styles.subHeading}>Our History</h2>
        <p style={styles.paragraph}>
          Usha Martin was founded in 1960 in Ranchi, India, and began its journey as a wire rope manufacturing company. Over the years, it expanded its product range and established itself as a key player in the global wire rope industry. The company's growth has been fueled by strategic acquisitions and the development of state-of-the-art manufacturing facilities.
        </p>

        <h2 style={styles.subHeading}>Global Presence</h2>
        <p style={styles.paragraph}>
          Usha Martin operates several manufacturing facilities in India, the UK, Dubai, Thailand, and Malaysia. Our extensive distribution network enables us to serve clients across numerous countries, ensuring timely delivery and superior customer service.
        </p>
        <p style={styles.paragraph}>
          Our global footprint allows us to cater to diverse market needs and stay close to our customers, providing them with localized support and solutions.
        </p>

        <h2 style={styles.subHeading}>Our Products</h2>
        <p style={styles.paragraph}>
          Usha Martin offers a comprehensive range of products, including:
        </p>
        <ul style={styles.list}>
          <li>Wire Ropes: Used in various applications such as mining, oil & gas, construction, and engineering.</li>
          <li>Specialty Ropes: Designed for specific industrial requirements, including elevator ropes, crane ropes, and offshore ropes.</li>
          <li>Steel Wires: Utilized in diverse sectors for their strength and durability.</li>
          <li>Wire Strands: Employed in construction, bridges, and other infrastructure projects.</li>
          <li>Cables: Developed for high-performance applications requiring reliability and precision.</li>
        </ul>

        <h2 style={styles.subHeading}>Commitment to Innovation</h2>
        <p style={styles.paragraph}>
          Innovation is at the core of Usha Martin’s strategy. We invest heavily in research and development to drive product innovation and process improvement. Our R&D centers are equipped with advanced testing facilities and staffed by experienced engineers and scientists dedicated to pushing the boundaries of technology in the wire rope industry.
        </p>

        <h2 style={styles.subHeading}>Leadership</h2>
        <p style={styles.paragraph}>
          Usha Martin’s leadership team comprises industry veterans and experts who bring a wealth of experience and strategic vision to the company. Our leaders are committed to fostering a culture of excellence, innovation, and integrity.
        </p>

        <h2 style={styles.subHeading}>Awards & Recognitions</h2>
        <p style={styles.paragraph}>
          Over the years, Usha Martin has received numerous awards and recognitions for its contributions to the industry, excellence in manufacturing, and commitment to quality. These accolades underscore our dedication to setting industry benchmarks.
        </p>

        <h2 style={styles.subHeading}>Corporate Social Responsibility</h2>
        <p style={styles.paragraph}>
          Usha Martin believes in giving back to the community and making a positive impact on society. Our CSR initiatives focus on:
        </p>
        <ul style={styles.list}>
          <li>Education: Supporting educational programs and infrastructure development in underserved communities.</li>
          <li>Healthcare: Providing access to medical facilities and health services to improve community health and well-being.</li>
          <li>Community Development: Engaging in various projects that enhance the quality of life in the areas where we operate.</li>
          <li>Environmental Sustainability: Implementing eco-friendly practices and promoting environmental conservation.</li>
        </ul>

        <h2 style={styles.subHeading}>Contact Us</h2>
        <p style={styles.paragraph}>
          For more information, please visit our official website or reach out to us at our corporate office:
        </p>
        <address style={styles.paragraph}>
          Usha Martin Limited<br />
          Address: 2A Shakespeare Sarani, Kolkata, 700071, India<br />
          Phone: +91-33-3984-6000<br />
          Email: info@ushamartin.com
        </address>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
    marginTop: '50px', // Add top margin to shift content down
  },
  heading: {
    fontSize: '2.5em',
    marginBottom: '0.5em',
    color: '#333',
  },
  subHeading: {
    fontSize: '1.8em',
    marginTop: '1.2em',
    marginBottom: '0.5em',
    color: '#555',
  },
  paragraph: {
    fontSize: '1.1em',
    lineHeight: '1.6em',
    marginBottom: '1em',
    color: '#666',
  },
  list: {
    marginLeft: '20px',
    marginBottom: '1em',
  }
};

export default AboutUs;
