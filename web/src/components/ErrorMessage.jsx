/**
 * 错误提示组件 - 支持重试
 */

import React from 'react';

export default function ErrorMessage({ message = '加载失败，请稍后重试', onRetry = null }) {
  return (
    <div style={styles.container}>
      <div style={styles.icon}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="20" stroke="#ff4d4f" strokeWidth="2" />
          <path d="M24 14v12M24 30h0" stroke="#ff4d4f" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <p style={styles.message}>{message}</p>
      {onRetry && (
        <button style={styles.retryBtn} onClick={onRetry}>
          重新加载
        </button>
      )}
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
  icon: {
    marginBottom: '16px',
  },
  message: {
    fontSize: '15px',
    color: '#666',
    margin: '0 0 20px',
  },
  retryBtn: {
    padding: '8px 24px',
    fontSize: '14px',
    color: '#fff',
    backgroundColor: 'var(--primary-color)',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
