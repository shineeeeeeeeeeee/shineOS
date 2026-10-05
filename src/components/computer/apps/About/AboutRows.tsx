import React from 'react'
import type { AboutRow } from '../../../../data/about'

interface AboutRowsProps {
  rows: AboutRow[]
}

/**
 * Compact label/value rows used for the "Currently" list.
 *
 * A description list keeps the pairing of label and value semantic for screen
 * readers; the two-column look is pure presentation.
 */
const AboutRows: React.FC<AboutRowsProps> = ({ rows }) => {
  return (
    <dl className="about-rows" data-motion="rows">
      {rows.map((row) => (
        <div className="about-rows__row" key={row.label} data-motion="row">
          <dt className="about-rows__label">
            <span className="about-rows__dot" aria-hidden="true" />
            {row.label}
          </dt>
          <dd className="about-rows__value">{row.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default AboutRows