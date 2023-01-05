import React from 'react';
import { test } from '../constants';
import styles from '../style';
import Test from './Test';

const Testing = () => (
  <section
    id="testing"
    className={`${styles.paddingY} ${styles.flexCenter} flex-col relative`}
    style={{ paddingTop: '160px', paddingBottom: '160px' }}
  >
    <div
      className="absolute z-0 w-60% h-60% right-50% rounded-full blue__gradient bottom-40"
    />
    <div className="w-full flex justify-between items-center md:flex-row flex-col sm:mb-16 mb-6 relative z-1">
      <h2
        className={styles.heading2}
        style={{ textAlign: 'center' }}
      >
        Measure your abilities with our{' '}
        <br className="sm:block hidden" />
        <span className="text-gradient">cognitive tests</span>
      </h2>
    </div>
    <div
      className="absolute z-0 w-60% h-60% right-50% rounded-full blue__gradient bottom-40"
    />
    <div
      className="w-full h-full clearfix test-container relative z-1 flexCenter"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {test.map((card) => (
        <Test key={card.id} path={card.id} {...card} style={{ width: '100%', height: '100%' }} />
      ))}
    </div>
  </section>
);
export default Testing;
