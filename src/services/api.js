const STORAGE_KEY = 'bankapp_state_v7';
const API_CONFIG_KEY = 'bankapp_api_config_v7';

const INITIAL_STATE = {
  isLoggedIn: false,
  user: {
    userID: null,
    name: '',
    phone: '',
    age: null,
  },
  balance: 0,
  currency: '₹',
  card: {
    cardNumber: '',
    cardholderName: '',
    expiry: '',
    cvv: '',
    isFrozen: false,
  },
  transactions: []
};

const DEFAULT_API_CONFIG = {
  useMockData: false,
  baseUrl: 'http://localhost:8080',
};

// Text-to-Speech Helper (Manual click only)
export const speakText = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

export const getApiConfig = () => {
  try {
    const raw = localStorage.getItem(API_CONFIG_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_API_CONFIG;
  } catch {
    return DEFAULT_API_CONFIG;
  }
};

export const saveApiConfig = (config) => {
  try {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save API config:', e);
  }
};

export const getAppState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.balance === 'number') {
        return {
          ...INITIAL_STATE,
          ...parsed,
          user: { ...INITIAL_STATE.user, ...(parsed.user || {}) },
          card: { ...INITIAL_STATE.card, ...(parsed.card || {}) },
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : INITIAL_STATE.transactions,
        };
      }
    }
  } catch (e) {
    console.warn('Could not read state:', e);
  }
  saveAppState(INITIAL_STATE);
  return INITIAL_STATE;
};

export const saveAppState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
};

export const resetDemoState = () => {
  localStorage.removeItem(STORAGE_KEY);
  return getAppState();
};

/**
 * Backend Login integration for /hello-servlet
 */
export const loginUser = async ({ uname, pass }) => {
  const config = getApiConfig();

  if (!config.useMockData && config.baseUrl) {
    try {
      const params = new URLSearchParams();
      params.append('uname', uname);
      params.append('pass', pass);

      const res = await fetch(`${config.baseUrl}/hello-servlet`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const data = await readApiResponse(res);
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const account = await fetchAccount(config);
      const state = getAppState();
      state.isLoggedIn = true;
      state.user = { ...state.user, ...account.user };
      state.balance = account.balance;
      saveAppState(state);
      return data;
    } catch (err) {
      throw new Error(formatApiError(err, 'Login failed'));
    }
  }
  throw new Error('Live backend is not configured. Open backend settings and enable the API.');
};

/**
 * Backend Signup integration for /signup
 */
export const signupUser = async ({ name, age, phone, pass }) => {
  const config = getApiConfig();

  if (!config.useMockData && config.baseUrl) {
    try {
      const params = new URLSearchParams();
      params.append('uname', name);
      params.append('age', age);
      params.append('phone', phone);
      params.append('pass', pass);

      const res = await fetch(`${config.baseUrl}/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const data = await readApiResponse(res);
      if (!res.ok || !data.success) throw new Error(data.message || 'Registration failed');
      const account = await fetchAccount(config);
      const state = getAppState();
      state.isLoggedIn = true;
      state.user = { ...state.user, ...account.user };
      state.balance = account.balance;
      saveAppState(state);
      return data;
    } catch (err) {
      throw new Error(formatApiError(err, 'Registration failed'));
    }
  }
  throw new Error('Live backend is not configured. Open backend settings and enable the API.');
};

/**
 * Perform Transfer matching /send & /psend endpoints in BankApp (pay.java)
 */
export const performSendMoney = async ({ payid, amount, note }) => {
  const config = getApiConfig();
  const numAmount = parseFloat(amount);
  const targetPayId = parseInt(payid);

  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Please enter a valid amount.');
  }

  if (isNaN(targetPayId)) {
    throw new Error('Please enter a valid numeric recipient User ID.');
  }

  // Live Backend Call to /send & /psend
  if (!config.useMockData && config.baseUrl) {
    try {
      const sendParams = new URLSearchParams();
      sendParams.append('payid', targetPayId);
      sendParams.append('amount', numAmount);

      const resSend = await fetch(`${config.baseUrl}/send`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: sendParams,
      });

      const sendData = await readApiResponse(resSend);
      if (!resSend.ok || !sendData.success) throw new Error(sendData.message || 'Recipient account not found');
      const resPsend = await fetch(`${config.baseUrl}/psend`, { method: 'POST', credentials: 'include' });
      const paymentData = await readApiResponse(resPsend);
      if (!resPsend.ok || !paymentData.success) throw new Error(paymentData.message || 'Payment execution failed on server');
      const account = await fetchAccount(config);
      const state = getAppState();
      state.balance = account.balance;
      const newTx = {
        id: 'tx_' + Date.now(), payid: targetPayId,
        title: `Sent to User ID ${targetPayId}`, type: 'expense', amount: numAmount,
        date: 'Just Now', note: note || 'Transfer',
      };
      state.transactions.unshift(newTx);
      saveAppState(state);
      return { success: true, newBalance: state.balance, transaction: newTx };
    } catch (err) {
      throw new Error(formatApiError(err, 'Payment failed'));
    }
  }
  throw new Error('Live backend is not configured. Open backend settings and enable the API.');
};

const fetchAccount = async (config) => {
  const response = await fetch(`${config.baseUrl}/account`, { credentials: 'include' });
  const data = await readApiResponse(response);
  if (!response.ok || !data.success) throw new Error(data.message || 'Could not load account');
  return data;
};

const readApiResponse = async (response) => {
  const body = await response.text();
  try {
    return body ? JSON.parse(body) : { success: response.ok };
  } catch {
    throw new Error(response.ok ? 'Backend returned an invalid response.' : `Backend error (${response.status}).`);
  }
};

const formatApiError = (error, fallback) => {
  if (error instanceof TypeError) {
    return 'Cannot reach the backend. Start Spring Boot and check the Backend API URL.';
  }
  return error.message || fallback;
};

/**
 * Perform Deposit / Add Money
 */
export const performAddMoney = async ({ amount, source = 'Linked Account' }) => {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Please enter a valid deposit amount.');
  }

  const state = getAppState();
  state.balance += numAmount;

  const newTx = {
    id: 'tx_' + Date.now(),
    title: `Added Funds (${source})`,
    type: 'income',
    amount: numAmount,
    date: 'Just Now',
    note: 'Account Deposit',
  };

  state.transactions.unshift(newTx);
  saveAppState(state);

  return { success: true, newBalance: state.balance, transaction: newTx };
};

/**
 * Toggle Debit Card Freeze
 */
export const toggleSeniorCardFreeze = () => {
  const state = getAppState();
  state.card.isFrozen = !state.card.isFrozen;
  saveAppState(state);
  return state.card;
};

/**
 * Logout
 */
export const logoutUser = () => {
  const state = getAppState();
  state.isLoggedIn = false;
  saveAppState(state);
  return state;
};

/**
 * Test API Connectivity
 */
export const testBackendPing = async (baseUrl) => {
  const config = getApiConfig();
  const targetUrl = baseUrl || config.baseUrl;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${targetUrl}/`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (res.ok) return { connected: true, message: 'Spring Boot Backend Connected!' };
    return { connected: false, message: `Server returned status ${res.status}` };
  } catch {
    return { connected: false, message: `Could not reach ${targetUrl}` };
  }
};
