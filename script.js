// Tải menu từ menu.json (đã được include như script trong HTML)
let menuData = window.menuData || { categories: [] };

// Render menu
const menuContainer = document.getElementById('menu');
menuData.categories.forEach(category => {
  const categoryDiv = document.createElement('div');
  categoryDiv.className = 'category';
  categoryDiv.innerHTML = `<h3>${category.name}</h3>`;
  
  category.items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'item';
    itemDiv.innerHTML = `
      <div>
        <div class="item-name">${item.name}</div>
        <div class="item-price">${item.price.toLocaleString('vi-VN')} ₫</div>
      </div>
      <div class="qty-control">
        <button class="minus" data-id="${item.id}">-</button>
        <span class="qty" data-id="${item.id}">0</span>
        <button class="plus" data-id="${item.id}">+</button>
      </div>
    `;
    categoryDiv.appendChild(itemDiv);
  });
  menuContainer.appendChild(categoryDiv);
});

// Quản lý số lượng
const updateQtyDisplay = (id, qty) => {
  const elem = document.querySelector(`.qty[data-id="${id}"]`);
  if (elem) elem.textContent = qty;
};

document.addEventListener('click', e => {
  if (e.target.classList.contains('plus')) {
    const id = e.target.dataset.id;
    const qtyElem = document.querySelector(`.qty[data-id="${id}"]`);
    let qty = parseInt(qtyElem.textContent) || 0;
    qtyElem.textContent = qty + 1;
  }
  if (e.target.classList.contains('minus')) {
    const id = e.target.dataset.id;
    const qtyElem = document.querySelector(`.qty[data-id="${id}"]`);
    let qty = parseInt(qtyElem.textContent) || 0;
    if (qty > 0) qtyElem.textContent = qty - 1;
  }
});

// Xử lý nút order
document.getElementById('orderBtn').addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  
  if (!name || !phone || !address) {
    alert('Vui lòng điền đầy đủ thông tin giao hàng!');
    return;
  }

  // Tính tổng order
  let orderText = `ĐƠN HÀNG TỪ WEBSITE\n`;
  orderText += `Tên: ${name}\n`;
  orderText += `SĐT: ${phone}\n`;
  orderText += `Địa chỉ: ${address}\n\n`;
  orderText += `--- MÓN ĂN ---\n`;
  
  let total = 0;
  let hasItems = false;
  
  menuData.categories.forEach(cat => {
    cat.items.forEach(item => {
      const qtyElem = document.querySelector(`.qty[data-id="${item.id}"]`);
      const qty = parseInt(qtyElem.textContent) || 0;
      if (qty > 0) {
        hasItems = true;
        const itemTotal = item.price * qty;
        total += itemTotal;
        orderText += `${item.name} x${qty} = ${itemTotal.toLocaleString('vi-VN')} ₫\n`;
      }
    });
  });

  if (!hasItems) {
    alert('Vui lòng chọn ít nhất một món!');
    return;
  }

  orderText += `\nTỔNG CỘNG: ${total.toLocaleString('vi-VN')} ₫`;
  orderText += `\n\nGhi chú: Vui lòng xác nhận qua Zalo khi nhận được tin này.`;

  // Mã hóa URL cho Zalo
  const encodedText = encodeURIComponent(orderText);
  // THAY SỐ ĐIỆN THOẠI ZALO CỦA BẠN VÀO ĐÂY (có dạng +84xxxxxxxxxx)
  const zaloNumber = "+849****4567"; // <-- THAY SỐ THẬT CỦA BẠN
  const zaloUrl = `zalo://message?phone=${zaloNumber}&text=${encodedText}`;

  // Mở link Zalo (trên điện thoại sẽ mở app Zalo; trên desktop sẽ yêu cầu cài Zalo hoặc mở trang web Zalo)
  window.location.href = zaloUrl;
});