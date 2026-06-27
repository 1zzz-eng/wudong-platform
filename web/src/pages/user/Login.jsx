/**
 * 登录页 - 手机号 + 密码登录
 * 登录成功存储 token 到 localStorage，跳转到首页
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/index';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 前端校验
    if (!phone.trim()) {
      setErrorMsg('请输入手机号');
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
      setErrorMsg('请输入正确的手机号');
      return;
    }
    if (!password) {
      setErrorMsg('请输入密码');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ phone: phone.trim(), password });
      if (res && res.data && res.data.token) {
        // 存储登录凭证
        localStorage.setItem('token', res.data.token);
        if (res.data.userInfo || res.data.user) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo || res.data.user));
        }
        navigate('/');
      } else if (res && res.token) {
        localStorage.setItem('token', res.token);
        if (res.userInfo || res.user) {
          localStorage.setItem('userInfo', JSON.stringify(res.userInfo || res.user));
        }
        navigate('/');
      } else {
        setErrorMsg('登录失败，请检查账号密码');
      }
    } catch (err) {
      setErrorMsg(err.message || '登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>乌</span>
          <h2 style={styles.title}>欢迎登录乌东文旅</h2>
          <p style={styles.subtitle}>发现非遗之美，体验文化之旅</p>
        </div>

        {/* 错误提示 */}
        {errorMsg && (
          <div style={styles.errorBox}>
            <span style={styles.errorIcon}>!</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>手机号</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="请输入手机号"
              style={styles.input}
              maxLength={11}
              autoComplete="tel"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              ...(loading ? styles.submitBtnDisabled : {}),
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>

        {/* 底部链接 */}
        <div style={styles.footerLinks}>
          <p style={styles.registerHint}>
            还没有账号？
            <Link to="/login" style={styles.registerLink}>立即注册</Link>
          </p>
          <p style={styles.testHint}>
            测试账号：13800138001 / 123456
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 200px)',
    padding: '40px 20px',
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '40px 36px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  logoArea: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoIcon: {
    display: 'inline-flex',
    width: '56px',
    height: '56px',
    borderRadius: '14px',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    fontSize: '28px',
    fontWeight: 700,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: 600,
    color: '#333',
    margin: '0 0 8px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#999',
    margin: 0,
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FFF1F0',
    border: '1px solid #FFCCC7',
    borderRadius: '8px',
    padding: '10px 14px',
    marginBottom: '20px',
    color: '#E74C3C',
    fontSize: '13px',
  },
  errorIcon: {
    display: 'inline-flex',
    width: '18px',
    height: '18px',
    borderRadius: '50%',
    backgroundColor: '#E74C3C',
    color: '#fff',
    fontSize: '11px',
    fontWeight: 700,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  form: {},
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    color: '#595959',
    marginBottom: '8px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    height: '44px',
    padding: '0 14px',
    border: '1px solid #d9d9d9',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#333',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    height: '46px',
    backgroundColor: 'var(--primary-color)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  footerLinks: {
    textAlign: 'center',
    marginTop: '24px',
  },
  registerHint: {
    fontSize: '14px',
    color: '#8C8C8C',
    margin: '0 0 8px',
  },
  registerLink: {
    color: 'var(--primary-color)',
    marginLeft: '4px',
    fontWeight: 500,
  },
  testHint: {
    fontSize: '12px',
    color: '#bbb',
    margin: 0,
  },
};
