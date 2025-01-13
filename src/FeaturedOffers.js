import React from 'react';
import { Link } from 'react-router-dom';
import './FeaturedOffers.css';

const FeaturedOffers = () => (
  <section className="featured-offers">
    <h1>Featured Offers for Business</h1>
    <p>Select a category to explore:</p>
    <div className="offer-links">
      <Link to="/featured-offers/long-term" className="offer-button">Long-Term Features</Link>
      <Link to="/featured-offers/short-term" className="offer-button">Short-Term Features</Link>
    </div>
  </section>
);

export default FeaturedOffers;
