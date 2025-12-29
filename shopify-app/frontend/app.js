// API Base URL
const API_BASE = '/api';

// State
let currentEditingDiscountId = null;
let currentEditingCartRuleId = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initDiscounts();
  initCartRules();
  loadDiscounts();
  loadCartRules();
});

// Tab Management
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;
      switchTab(tabName);
    });
  });
}

function switchTab(tabName) {
  // Update buttons
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update content
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetTab = tabName === 'discounts' ? 'discounts-tab' : 'cart-rules-tab';
  document.getElementById(targetTab).classList.add('active');
}

// Discount Management
function initDiscounts() {
  const addBtn = document.getElementById('add-discount-btn');
  const modal = document.getElementById('discount-modal');
  const closeBtn = modal.querySelector('.close');
  const cancelBtn = document.getElementById('cancel-discount-btn');
  const form = document.getElementById('discount-form');

  addBtn.addEventListener('click', () => {
    currentEditingDiscountId = null;
    document.getElementById('discount-modal-title').textContent = 'Add Discount Rule';
    form.reset();
    modal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  form.addEventListener('submit', handleDiscountSubmit);
}

async function loadDiscounts() {
  const container = document.getElementById('discounts-list');
  container.innerHTML = '<div class="loading">Loading discounts...</div>';

  try {
    const response = await fetch(`${API_BASE}/discounts`);
    const data = await response.json();

    if (data.discounts && data.discounts.length > 0) {
      container.innerHTML = data.discounts.map(discount => createDiscountCard(discount)).join('');
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No discount rules yet</h3>
          <p>Create your first discount rule to get started</p>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="error-message">
        Failed to load discounts: ${error.message}
      </div>
    `;
  }
}

function createDiscountCard(discount) {
  const statusBadge = discount.isActive
    ? '<span class="rule-badge active">Active</span>'
    : '<span class="rule-badge inactive">Inactive</span>';

  return `
    <div class="rule-card">
      <div class="rule-card-header">
        <div>
          <div class="rule-card-title">${escapeHtml(discount.name)}</div>
          ${statusBadge}
          <span class="rule-badge">${discount.type}</span>
        </div>
        <div class="rule-card-actions">
          <button class="btn btn-secondary" onclick="editDiscount('${discount.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteDiscount('${discount.id}')">Delete</button>
        </div>
      </div>
      <div class="rule-card-body">
        ${discount.description || 'No description'}
        <br><strong>Value:</strong> ${discount.value}
        ${discount.minCartValue ? `<br><strong>Min Cart:</strong> $${discount.minCartValue}` : ''}
        ${discount.priority ? `<br><strong>Priority:</strong> ${discount.priority}` : ''}
      </div>
    </div>
  `;
}

async function handleDiscountSubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('discount-name').value,
    description: document.getElementById('discount-description').value,
    type: document.getElementById('discount-type').value,
    value: parseFloat(document.getElementById('discount-value').value),
    minCartValue: parseFloat(document.getElementById('discount-min-cart').value) || null,
    maxCartValue: parseFloat(document.getElementById('discount-max-cart').value) || null,
    minQuantity: parseInt(document.getElementById('discount-min-qty').value) || null,
    productIds: parseArrayInput(document.getElementById('discount-product-ids').value),
    customerTags: parseArrayInput(document.getElementById('discount-customer-tags').value),
    stackable: document.getElementById('discount-stackable').checked,
    priority: parseInt(document.getElementById('discount-priority').value) || 0,
    startDate: document.getElementById('discount-start-date').value || null,
    endDate: document.getElementById('discount-end-date').value || null,
    isActive: document.getElementById('discount-active').checked,
  };

  try {
    const url = currentEditingDiscountId
      ? `${API_BASE}/discounts/${currentEditingDiscountId}`
      : `${API_BASE}/discounts`;

    const method = currentEditingDiscountId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to save discount');
    }

    document.getElementById('discount-modal').classList.remove('show');
    loadDiscounts();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function editDiscount(id) {
  try {
    const response = await fetch(`${API_BASE}/discounts/${id}`);
    const data = await response.json();
    const discount = data.discount;

    currentEditingDiscountId = id;
    document.getElementById('discount-modal-title').textContent = 'Edit Discount Rule';

    document.getElementById('discount-name').value = discount.name;
    document.getElementById('discount-description').value = discount.description || '';
    document.getElementById('discount-type').value = discount.type;
    document.getElementById('discount-value').value = discount.value;
    document.getElementById('discount-min-cart').value = discount.minCartValue || '';
    document.getElementById('discount-max-cart').value = discount.maxCartValue || '';
    document.getElementById('discount-min-qty').value = discount.minQuantity || '';
    document.getElementById('discount-product-ids').value = discount.productIds?.join(', ') || '';
    document.getElementById('discount-customer-tags').value = discount.customerTags?.join(', ') || '';
    document.getElementById('discount-stackable').checked = discount.stackable;
    document.getElementById('discount-priority').value = discount.priority;
    document.getElementById('discount-start-date').value = discount.startDate ? formatDateTimeLocal(discount.startDate) : '';
    document.getElementById('discount-end-date').value = discount.endDate ? formatDateTimeLocal(discount.endDate) : '';
    document.getElementById('discount-active').checked = discount.isActive;

    document.getElementById('discount-modal').classList.add('show');
  } catch (error) {
    alert(`Error loading discount: ${error.message}`);
  }
}

async function deleteDiscount(id) {
  if (!confirm('Are you sure you want to delete this discount?')) return;

  try {
    const response = await fetch(`${API_BASE}/discounts/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete discount');
    }

    loadDiscounts();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Cart Rules Management
function initCartRules() {
  const addBtn = document.getElementById('add-cart-rule-btn');
  const modal = document.getElementById('cart-rule-modal');
  const closeBtn = modal.querySelector('.close');
  const cancelBtn = document.getElementById('cancel-cart-rule-btn');
  const form = document.getElementById('cart-rule-form');

  addBtn.addEventListener('click', () => {
    currentEditingCartRuleId = null;
    document.getElementById('cart-rule-modal-title').textContent = 'Add Cart Rule';
    form.reset();
    modal.classList.add('show');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  cancelBtn.addEventListener('click', () => {
    modal.classList.remove('show');
  });

  form.addEventListener('submit', handleCartRuleSubmit);
}

async function loadCartRules() {
  const container = document.getElementById('cart-rules-list');
  container.innerHTML = '<div class="loading">Loading cart rules...</div>';

  try {
    const response = await fetch(`${API_BASE}/cart-rules`);
    const data = await response.json();

    if (data.cartRules && data.cartRules.length > 0) {
      container.innerHTML = data.cartRules.map(rule => createCartRuleCard(rule)).join('');
    } else {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No cart rules yet</h3>
          <p>Create your first cart transformation rule to get started</p>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="error-message">
        Failed to load cart rules: ${error.message}
      </div>
    `;
  }
}

function createCartRuleCard(rule) {
  const statusBadge = rule.isActive
    ? '<span class="rule-badge active">Active</span>'
    : '<span class="rule-badge inactive">Inactive</span>';

  return `
    <div class="rule-card">
      <div class="rule-card-header">
        <div>
          <div class="rule-card-title">${escapeHtml(rule.name)}</div>
          ${statusBadge}
          <span class="rule-badge">${rule.type}</span>
        </div>
        <div class="rule-card-actions">
          <button class="btn btn-secondary" onclick="editCartRule('${rule.id}')">Edit</button>
          <button class="btn btn-danger" onclick="deleteCartRule('${rule.id}')">Delete</button>
        </div>
      </div>
      <div class="rule-card-body">
        ${rule.description || 'No description'}
        <br><strong>Trigger:</strong> ${rule.triggerType}
        <br><strong>Action:</strong> ${rule.actionType}
        ${rule.priority ? `<br><strong>Priority:</strong> ${rule.priority}` : ''}
      </div>
    </div>
  `;
}

async function handleCartRuleSubmit(e) {
  e.preventDefault();

  const formData = {
    name: document.getElementById('cart-rule-name').value,
    description: document.getElementById('cart-rule-description').value,
    type: document.getElementById('cart-rule-type').value,
    triggerType: document.getElementById('cart-rule-trigger-type').value,
    triggerValue: document.getElementById('cart-rule-trigger-value').value,
    actionType: document.getElementById('cart-rule-action-type').value,
    actionValue: document.getElementById('cart-rule-action-value').value,
    minCartValue: parseFloat(document.getElementById('cart-rule-min-cart').value) || null,
    priority: parseInt(document.getElementById('cart-rule-priority').value) || 0,
    isActive: document.getElementById('cart-rule-active').checked,
  };

  try {
    const url = currentEditingCartRuleId
      ? `${API_BASE}/cart-rules/${currentEditingCartRuleId}`
      : `${API_BASE}/cart-rules`;

    const method = currentEditingCartRuleId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Failed to save cart rule');
    }

    document.getElementById('cart-rule-modal').classList.remove('show');
    loadCartRules();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function editCartRule(id) {
  try {
    const response = await fetch(`${API_BASE}/cart-rules/${id}`);
    const data = await response.json();
    const rule = data.cartRule;

    currentEditingCartRuleId = id;
    document.getElementById('cart-rule-modal-title').textContent = 'Edit Cart Rule';

    document.getElementById('cart-rule-name').value = rule.name;
    document.getElementById('cart-rule-description').value = rule.description || '';
    document.getElementById('cart-rule-type').value = rule.type;
    document.getElementById('cart-rule-trigger-type').value = rule.triggerType;
    document.getElementById('cart-rule-trigger-value').value = rule.triggerValue || '';
    document.getElementById('cart-rule-action-type').value = rule.actionType;
    document.getElementById('cart-rule-action-value').value = rule.actionValue || '';
    document.getElementById('cart-rule-min-cart').value = rule.minCartValue || '';
    document.getElementById('cart-rule-priority').value = rule.priority;
    document.getElementById('cart-rule-active').checked = rule.isActive;

    document.getElementById('cart-rule-modal').classList.add('show');
  } catch (error) {
    alert(`Error loading cart rule: ${error.message}`);
  }
}

async function deleteCartRule(id) {
  if (!confirm('Are you sure you want to delete this cart rule?')) return;

  try {
    const response = await fetch(`${API_BASE}/cart-rules/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete cart rule');
    }

    loadCartRules();
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

// Utility Functions
function parseArrayInput(value) {
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(item => item);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDateTimeLocal(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
