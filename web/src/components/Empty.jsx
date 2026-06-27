/**
 * 空状态组件
 */

import React from 'react';

export default function Empty({ title = '暂无数据', description = '', image = null }) {
  return (
    <div style={styles.container}>
      {image ? (
        <img src={image} alt="empty" style={styles.image} />
      ) : (
        <div style={styles.iconBox}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="16" width="48" height="36" rx="4" stroke="#d9d9d9" strokeWidth="2" />
            <path d="M8 24h48" stroke="#d9d9d9" strokeWidth="2" />
            <path d="M32 40v4M29 43h6" stroke="#d9d9d9" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
      <h3 style={styles.title}>{title}</h3>
      {description && <p style={styles.desc}>{description}</p>}
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
  iconBox: {
    marginBottom: '16px',
  },
  image: {
    width: '180px',
    height: '180px',
    objectFit: 'contain',
    marginBottom: '16px',
  },
  title: {
    fontSize: '16px',
    color: '#999',
    fontWeight: 400,
    margin: 0,
  },
  desc: {
    fontSize: '13px',
    color: '#bbb',
    marginTop: '8px',
    margin: '8px 0 0',
  },
};
