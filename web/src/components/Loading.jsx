/**
 * 加载状态组件
 */

import React from 'react';

export default function Loading({ text = '加载中...' }) {
  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p style={styles.text}>{text}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    minHeight: '300px',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e8e8e8',
    borderTopColor: 'var(--primary-color)',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  text: {
    marginTop: '16px',
    color: '#999',
    fontSize: '14px',
  },
};
