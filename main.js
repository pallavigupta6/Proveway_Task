document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // Function to format price
    const formatPrice = (price) => {
        return `$${price.toFixed(2)} USD`;
    };

    // Function to calculate savings
    const calculateSavings = (original, discounted) => {
        return original - discounted;
    };

    // Function to generate options content
    const generateOptionsContent = (unitNumber) => {
        let content = '<div class="options">';
        for (let i = 1; i <= unitNumber; i++) {
            content += `
                <div class="option-group">
                    <label>#${i}</label>
                    <select class="size-select" onchange="updateTotalPrice()">
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                    </select>
                    <select class="color-select" onchange="updateTotalPrice()">
                        <option>Black</option>
                        <option>White</option>
                        <option>Blue</option>
                        <option>Red</option>
                    </select>
                    <div class="quantity-control">
                        <button class="quantity-btn minus" onclick="decrementQuantity(this)">-</button>
                        <span class="quantity-value">1</span>
                        <button class="quantity-btn plus" onclick="incrementQuantity(this)">+</button>
                    </div>
                </div>
            `;
        }
        content += '</div>';
        return content;
    };

    // Initialize box content
    boxes.forEach((box, index) => {
        const unitNumber = index + 1;
        const content = box.querySelector('.box-content');
        content.innerHTML = generateOptionsContent(unitNumber);

        // Add savings amount
        const price = parseFloat(box.querySelector('.price').textContent.replace('$', ''));
        const originalPrice = parseFloat(box.querySelector('.original-price').textContent.replace('$', ''));
        const savings = calculateSavings(originalPrice, price);
        const header = box.querySelector('.box-header');
        const savingsSpan = document.createElement('span');
        savingsSpan.className = 'save-amount';
        savingsSpan.textContent = `Save ${formatPrice(savings)}`;
        header.appendChild(savingsSpan);
    });

    // Handle box selection
    radioButtons.forEach((radio, index) => {
        radio.addEventListener('change', () => {
            // Remove active class from all boxes
            boxes.forEach(box => box.classList.remove('active'));
            
            // Add active class to selected box
            boxes[index].classList.add('active');

            // Update total price
            updateTotalPrice();
        });
    });

    // Handle box header clicks
    boxes.forEach((box, index) => {
        const header = box.querySelector('.box-header');
        header.addEventListener('click', (e) => {
            // Prevent triggering when clicking radio button
            if (e.target.type !== 'radio') {
                const radio = box.querySelector('input[type="radio"]');
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        });
    });

    // Function to show success message
    const showSuccessMessage = (message) => {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = message;
        document.body.appendChild(successMessage);
        
        // Show the message
        successMessage.style.display = 'block';
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.remove();
        }, 3000);
    };

    // Handle Add to Cart button
    const addToCartButton = document.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', () => {
        const selectedBox = document.querySelector('.box.active');
        const unitNumber = selectedBox.querySelector('label').textContent;
        const options = Array.from(selectedBox.querySelectorAll('.option-group')).map(group => ({
            size: group.querySelector('.size-select').value,
            color: group.querySelector('.color-select').value,
            quantity: parseInt(group.querySelector('.quantity-value').textContent)
        }));
        
        const orderDetails = {
            units: unitNumber,
            options: options,
            total: document.querySelector('.total').textContent
        };
        
        console.log('Order:', orderDetails);
        showSuccessMessage('Added to cart successfully! 🎉');
        
        // Simulate cart animation
        addToCartButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            addToCartButton.style.transform = 'scale(1)';
        }, 150);
    });

    // Global functions for quantity controls
    window.incrementQuantity = (button) => {
        const quantityValue = button.parentElement.querySelector('.quantity-value');
        const currentValue = parseInt(quantityValue.textContent);
        quantityValue.textContent = currentValue + 1;
        updateTotalPrice();
    };

    window.decrementQuantity = (button) => {
        const quantityValue = button.parentElement.querySelector('.quantity-value');
        const currentValue = parseInt(quantityValue.textContent);
        if (currentValue > 1) {
            quantityValue.textContent = currentValue - 1;
            updateTotalPrice();
        }
    };

    // Function to update total price
    window.updateTotalPrice = () => {
        const selectedBox = document.querySelector('.box.active');
        const basePrice = parseFloat(selectedBox.querySelector('.price').textContent.replace('$', ''));
        const quantities = Array.from(selectedBox.querySelectorAll('.quantity-value'))
            .map(el => parseInt(el.textContent));
        
        const totalQuantity = quantities.reduce((sum, qty) => sum + qty, 0);
        const totalPrice = basePrice * totalQuantity;
        
        document.querySelector('.total').textContent = `Total: ${formatPrice(totalPrice)}`;
    };

    // Initialize total price
    updateTotalPrice();
});