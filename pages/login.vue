/**
 * 로그인 페이지
 */
<script setup lang="ts">
import { ref } from 'vue';
import { AuthService } from '~/services/api/auth.service';

const authService = new AuthService();
const router = useRouter();

const identifier = ref('');
const password = ref('');
const isLoading = ref(false);
const error = ref('');

const handleLogin = async () => {
  if (!identifier.value || !password.value) {
    error.value = 'Please enter both username and password';
    return;
  }

  isLoading.value = true;
  error.value = '';

  try {
    const response = await authService.authenticate({
      identifier: identifier.value,
      credentialType: 'PASSWORD',
      password: password.value
    });

    if (response.authenticated && response.token) {
      // 로그인 성공 - 메인 페이지로 이동
      router.push('/');
    } else if (response.requiresMfa) {
      // MFA 필요
      error.value = 'MFA is required (not implemented yet)';
    } else {
      error.value = 'Authentication failed';
    }
  } catch (err: any) {
    console.error('Login error:', err);
    error.value = err.message || 'Login failed. Please check your credentials.';
  } finally {
    isLoading.value = false;
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin();
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-box">
        <div class="login-header">
          <h1>Welcome Back!</h1>
          <p>Login to your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="identifier">Email or Username</label>
            <input
              id="identifier"
              v-model="identifier"
              type="text"
              placeholder="Enter your email or username"
              @keydown="handleKeydown"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              @keydown="handleKeydown"
              :disabled="isLoading"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <button type="submit" class="login-btn" :disabled="isLoading">
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </button>

          <div class="help-text">
            <p>Need an account? <a href="#">Register</a></p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 480px;
}

.login-box {
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  color: var(--c-text-header);
  font-size: 24px;
  margin-bottom: 8px;
}

.login-header p {
  color: var(--c-text-muted);
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: var(--c-text-muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  background: var(--bg-tertiary);
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 12px;
  color: var(--c-text-normal);
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: var(--c-brand);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-message {
  background: rgba(240, 71, 71, 0.1);
  border: 1px solid #f04747;
  border-radius: 4px;
  padding: 12px;
  color: #f04747;
  font-size: 14px;
}

.login-btn {
  background: var(--c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: var(--c-brand-hover);
}

.login-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.help-text {
  text-align: center;
  margin-top: 8px;
}

.help-text p {
  color: var(--c-text-muted);
  font-size: 14px;
}

.help-text a {
  color: var(--c-brand);
  text-decoration: none;
}

.help-text a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-box {
    padding: 24px;
  }
}
</style>
