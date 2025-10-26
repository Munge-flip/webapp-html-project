document.addEventListener('DOMContentLoaded', function() {
    
    // Store selected services
    const selectedServices = {
        maintenance: null,
        quests: null,
        events: null,
        endgame: null,
        'hollow-zero': null,
        'hollow-modes': [], // Store selected modes
        completion: null
    };

    // Get all elements
    const serviceButtons = document.querySelectorAll('.service-btn');
    const modeCards = document.querySelectorAll('.mode-card');
    const form = document.getElementById('serviceForm');
    const totalPriceElement = document.getElementById('totalPrice');
    const selectedServicesElement = document.getElementById('selectedServices');

    // Handle service button clicks
    serviceButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            const service = this.dataset.service;
            const price = parseInt(this.dataset.price);

            // Get all buttons in the same category
            const categoryButtons = document.querySelectorAll(`[data-category="${category}"]`);
            
            // Check if this button is already selected
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedServices[category] = null;
            } else {
                // Deselect all other buttons in this category
                categoryButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Select this button
                this.classList.add('selected');
                selectedServices[category] = {
                    name: this.querySelector('span').textContent,
                    price: price
                };
            }

            updateOrderSummary();
        });
    });

    // Handle mode card clicks (Hollow Zero modes)
    modeCards.forEach(card => {
        card.addEventListener('click', function() {
            const mode = this.dataset.mode;
            const modeName = this.querySelector('.mode-label').textContent;

            // Toggle selection
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedServices['hollow-modes'] = selectedServices['hollow-modes'].filter(
                    item => item !== modeName
                );
            } else {
                // Select
                this.classList.add('selected');
                selectedServices['hollow-modes'].push(modeName);
            }

            updateOrderSummary();
        });
    });

    // Update order summary
    function updateOrderSummary() {
        let total = 0;
        let summaryHTML = '';

        // Add regular services
        Object.keys(selectedServices).forEach(category => {
            if (category !== 'hollow-modes' && selectedServices[category]) {
                const service = selectedServices[category];
                total += service.price;
                summaryHTML += `
                    <div class="selected-item">
                        <span>${service.name}</span>
                        <span>₱${service.price}</span>
                    </div>
                `;
            }
        });

        // Display selected Hollow Zero modes (NO PRICE - just info)
        if (selectedServices['hollow-modes'].length > 0) {
            summaryHTML += `
                <div class="selected-item" style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <span style="font-weight: 600;">Hollow Zero Modes:</span>
                    <span>${selectedServices['hollow-modes'].join(', ')}</span>
                </div>
            `;
        }

        // Update display
        if (summaryHTML === '') {
            selectedServicesElement.innerHTML = '<p style="color: #888; font-style: italic;">No services selected yet</p>';
        } else {
            selectedServicesElement.innerHTML = summaryHTML;
        }

        totalPriceElement.textContent = total.toLocaleString();
    }

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Check if at least one service is selected
        let hasSelection = false;
        Object.keys(selectedServices).forEach(category => {
            if (category !== 'hollow-modes' && selectedServices[category]) {
                hasSelection = true;
            }
        });

        if (!hasSelection) {
            alert('Please select at least one service!');
            return;
        }

        // Check if payment method is selected
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked');
        if (!paymentMethod) {
            alert('Please select a payment method!');
            return;
        }

        // Get payment details
        const paymentInput = paymentMethod.parentElement.querySelector('.payment-input');
        if (!paymentInput.value.trim()) {
            alert('Please fill in your payment details!');
            return;
        }

        // Collect order data
        const orderData = {
            game: 'Zenless Zone Zero',
            services: selectedServices,
            paymentMethod: paymentMethod.value,
            paymentDetails: paymentInput.value,
            total: totalPriceElement.textContent
        };

        // Log order data (for debugging)
        console.log('Order Data:', orderData);

        // Create detailed summary
        const servicesList = Object.keys(selectedServices)
            .filter(k => k !== 'hollow-modes' && selectedServices[k])
            .map(k => selectedServices[k].name)
            .join(', ');

        let additionalInfo = '';
        if (selectedServices['hollow-modes'].length > 0) {
            additionalInfo += `\n\nHollow Zero Modes: ${selectedServices['hollow-modes'].join(', ')}`;
        }

        // TODO: Send order data to backend
        // For now, show success message
        alert(`Order placed successfully!\n\nGame: Zenless Zone Zero\n\nServices: ${servicesList}${additionalInfo}\n\nTotal: ₱${totalPriceElement.textContent}\n\nRedirecting to your profile...`);
        
        // Redirect to profile page (uncomment when ready)
        // window.location.href = 'profile.html';
    });

    // Enable payment input when radio is selected
    const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Disable all payment inputs
            document.querySelectorAll('.payment-input').forEach(input => {
                input.disabled = true;
                input.style.opacity = '0.5';
            });

            // Enable the selected payment input
            const selectedInput = this.parentElement.querySelector('.payment-input');
            selectedInput.disabled = false;
            selectedInput.style.opacity = '1';
            selectedInput.focus();
        });
    });

    // Initialize - disable all payment inputs
    document.querySelectorAll('.payment-input').forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.5';
    });

    // Initialize order summary
    updateOrderSummary();
});