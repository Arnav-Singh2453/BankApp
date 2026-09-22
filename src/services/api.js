const STORAGE_KEY = 'bankapp_state_v6';
const API_CONFIG_KEY = 'bankapp_api_config_v6';

// Default initial state matching Spring Boot backend (User ID: 100000001, Initial Balance: ₹5,000.00)
const INITIAL_STATE = {
  isLoggedIn: true,
  user: {
    userID: 100000001,
    name: 'Mary Morgan',
    phone: '9876543210',
    age: 65,
    accountNumber: '4092-8840-5512',
    iban: 'IN89 EASY 4092 8840 5512',
  },
  balance: 5000.00,
  currency: '₹',
  card: {
    cardNumber: '4532 8810 9940 3312',
    cardholderName: 'MARY MORGAN',
    expiry: '12/28',
    cvv: '542',
    isFrozen: false,
  },
  transactions: [
    {
      id: 'tx_init_1',
      payid: 100000002,
      title: 'Welcome Bonus Deposit',
      type: 'income',
      amount: 5000.00,
      date: 'Today, 9:00 AM',
      note: 'Account Signup Bonus',
    }
  ]
};

const DEFAULT_API_CONFIG = {
  useMockData: true,
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      const state = getAppState();
      state.isLoggedIn = true;
      state.user.userID = parseInt(uname);
      saveAppState(state);
      return data;
    } catch (err) {
      console.warn('Backend login failed, using local demo login:', err.message);
    }
  }

  const state = getAppState();
  state.isLoggedIn = true;
  state.user.userID = parseInt(uname) || 100000001;
  saveAppState(state);
  return { success: true, message: 'Login successful' };
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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      });

      if (!res.ok) throw new Error('Registration failed');
    } catch (err) {
      console.warn('Backend signup error, fallback to local state:', err.message);
    }
  }

  const state = getAppState();
  state.isLoggedIn = true;
  state.user.name = name;
  state.user.phone = phone;
  state.user.age = age;
  state.balance = 5000.00;
  saveAppState(state);
  return { success: true, message: 'User registered successfully' };
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
    throw new Error('Please enter a valid numeric Recipient User ID (e.g. 100000002).');
  }

  // Live Backend Call to /send & /psend
  if (!config.useMockData && config.baseUrl) {
    try {
      const sendParams = new URLSearchParams();
      sendParams.append('payid', targetPayId);
      sendParams.append('amount', numAmount);

      const resSend = await fetch(`${config.baseUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: sendParams,
      });

      if (resSend.ok) {
        const resPsend = await fetch(`${config.baseUrl}/psend`, { method: 'POST' });
        if (!resPsend.ok) throw new Error('Payment execution failed on server');
      }
    } catch (err) {
      console.warn('Live backend payment failed, executing local state update:', err.message);
    }
  }

  const state = getAppState();
  if (state.balance < numAmount) {
    throw new Error(`Insufficient balance. Current balance: ₹${state.balance.toLocaleString('en-IN')}.`);
  }

  state.balance -= numAmount;
  const newTx = {
    id: 'tx_' + Date.now(),
    payid: targetPayId,
    title: `Sent to User ID ${targetPayId}`,
    type: 'expense',
    amount: numAmount,
    date: 'Just Now',
    note: note || 'Transfer',
  };

  state.transactions.unshift(newTx);
  saveAppState(state);

  return { success: true, newBalance: state.balance, transaction: newTx };
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
  } catch (err) {
    return { connected: false, message: `Could not reach ${targetUrl}` };
  }
};
