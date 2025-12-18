import React from 'react';
import PropTypes from 'prop-types';
import '@/styles/MovieCard.css';

/**
 * SkeletonCard component for loading state
 * Shows a placeholder card while movie data is loading
 * @param {Object} props - Component props
 * @param {'default' | 'compact' | 'grid'} [props.variant='default'] - Card variant
 * @returns {JSX.Element}
 */
const SkeletonCard = React.memo(({ variant = 'default' }) => {
  return (
    <div className={`movie-card movie-card--${variant} movie-card--skeleton`}>
      {/* Poster Skeleton */}
      <div className="movie-card__poster skeleton-pulse">
        <div className="skeleton-poster-content">
          <div className="skeleton-badge skeleton-element" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="movie-card__content">
        {/* Title Skeleton */}
        <div className="skeleton-title skeleton-element" />
        <div className="skeleton-title-short skeleton-element" />

        {/* Meta Skeleton */}
        <div className="movie-card__meta skeleton-meta">
          <div className="skeleton-meta-line skeleton-element" />
          <div className="skeleton-meta-line skeleton-element" />
          <div className="skeleton-meta-line skeleton-element" />
        </div>

        {/* CTA Skeleton */}
        <div className="skeleton-cta skeleton-element" />
      </div>
    </div>
  );
});

SkeletonCard.displayName = 'SkeletonCard';

SkeletonCard.propTypes = {
  variant: PropTypes.oneOf(['default', 'compact', 'grid'])
};

export default SkeletonCard;
