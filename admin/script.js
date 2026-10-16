let menuData = null;
let originalMenuData = null;

// Fetch menu from server on load
async function loadMenu() {
  try {
    const response = await fetch('/api/menu');
    if (!response.ok) throw new Error('Failed to load menu');
    menuData = await response.json();
    originalMenuData = JSON.parse(JSON.stringify(menuData)); // Deep copy for reset
    renderMenu();
  } catch (error) {
    showStatus('Không thể tải menu: ' + error.message, 'error');
  }
}

// Render menu to DOM
function renderMenu() {
  const container = document.getElementById('menuContainer');
  container.innerHTML = '';

  menuData.categories.forEach((category, catIndex) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category-card';
    categoryDiv.innerHTML = `
      <h3>
        ${category.name}
        <button class="btn-del-category" data-index="${catIndex}">Xóa danh mục</button>
      </h3>
      <div class="items-container"></div>
      <button class="btn-add-item" data-index="${catIndex}">+ Thêm món vào danh mục này</button>
    `;

    const itemsContainer = categoryDiv.querySelector('.items-container');
    category.items.forEach((item, itemIndex) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'item-row';
      itemDiv.innerHTML = `
        <div class="item-name">
          <input type="text" value="${item.name}" data-cat="${catIndex}" data-item="${itemIndex}" placeholder="Tên món">
        </div>
        <div class="item-price">
          <input type="number" value="${item.price}" min="0" step="1000" data-cat="${catIndex}" data-item="${itemIndex}" placeholder="Giá">
        </div>
        <div class="item-actions">
          <button class="btn-edit" data-cat="${catIndex}" data-item="${itemIndex}">Lưu</button>
          <button class="btn-del" data-cat="${catIndex}" data-item="${itemIndex}">Xóa</button>
        </div>
      `;
      itemsContainer.appendChild(itemDiv);
    });

    container.appendChild(categoryDiv);
  });

  // Attach event listeners after render
  attachEventListeners();
}

// Attach event listeners to dynamically created elements
function attachEventListeners() {
  // Add category
  document.getElementById('addCategoryBtn').addEventListener('click', () => {
    menuData.categories.push({ name: 'Danh mục mới', items: [] });
    renderMenu();
  });

  // Delete category
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-del-category')) {
      const catIndex = parseInt(e.target.dataset.index);
      if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${menuData.categories[catIndex].name}" và tất cả món trong đó?`)) {
        menuData.categories.splice(catIndex, 1);
        renderMenu();
      }
    }
  });

  // Add item to category
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-add-item')) {
      const catIndex = parseInt(e.target.dataset.index);
      menuData.categories[catIndex].items.push({ name: 'Món mới', price: 0 });
      renderMenu();
    }
  });

  // Edit item (save changes)
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-edit')) {
      const catIndex = parseInt(e.target.dataset.cat);
      const itemIndex = parseInt(e.target.dataset.item);
      const nameInput = document.querySelector(`input[data-cat="${catIndex}"][data-item="${itemIndex}"].item-name`);
      const priceInput = document.querySelector(`input[data-cat="${catIndex}"][data-item="${itemIndex}"].item-price`);
      
      const name = nameInput.value.trim();
      const price = parseInt(priceInput.value) || 0;

      if (!name) {
        showStatus('Tên món không được để trống', 'error');
        return;
      }
      if (price <= 0) {
        showStatus('Giá phải lớn hơn 0', 'error');
        return;
      }

      menuData.categories[catIndex].items[itemIndex] = { name, price };
      showStatus('Đã cập nhật món thành công', 'success');
    }
  });

  // Delete item
  document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-del')) {
      const catIndex = parseInt(e.target.dataset.cat);
      const itemIndex = parseInt(e.target.dataset.item);
      if (confirm(`Bạn có chắc chắn muốn xóa món "${menuData.categories[catIndex].items[itemIndex].name}"?`)) {
        menuData.categories[catIndex].items.splice(itemIndex, 1);
        renderMenu();
      }
    }
  });

  // Save button
  document.getElementById('saveBtn').addEventListener('click', async () => {
    try {
      const response = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });
      if (!response.ok) throw new Error('Server error');
      const result = await response.json();
      originalMenuData = JSON.parse(JSON.stringify(menuData)); // Update original after save
      showStatus(result.message || 'Lưu thành công!', 'success');
    } catch (error) {
      showStatus('Lỗi lưu menu: ' + error.message, 'error');
    }
  });

  // Reset button
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn khôi phục menu về trạng thái cuối cùng đã lưu?')) {
      menuData = JSON.parse(JSON.stringify(originalMenuData));
      renderMenu();
      showStatus('Đã khôi phục menu về trạng thái ban đầu', 'success');
    }
  });
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('statusMsg');
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.style.display = 'block';
  setTimeout(() => { statusEl.style.display = 'none'; }, 3000);
}

// Initialize
loadMenu();