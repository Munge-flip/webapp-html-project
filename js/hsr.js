document.addEventListener('DOMContentLoaded', function() {
    
    // Store selected services
    const selectedServices = {
        maintenance: null,
        quests: null,
        events: null,
        endgame: null,
        'simulated-clear': null,
        'simulated-worlds': [], // Store selected worlds
        divergent: null,
        completion: null,
        explorations: [] // Just region names, no prices
    };

    // Get all elements
    const serviceButtons = document.querySelectorAll('.service-btn');
    const explorationCards = document.querySelectorAll('.exploration-card');
    const worldCards = document.querySelectorAll('.world-card');
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

    // Handle world card clicks (Simulated Universe worlds)
    worldCards.forEach(card => {
        card.addEventListener('click', function() {
            const world = this.dataset.world;
            const worldName = this.querySelector('.world-label').textContent;

            // Toggle selection
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedServices['simulated-worlds'] = selectedServices['simulated-worlds'].filter(
                    item => item !== worldName
                );
            } else {
                // Select
                this.classList.add('selected');
                selectedServices['simulated-worlds'].push(worldName);
            }

            updateOrderSummary();
        });
    });

    // Handle exploration card clicks (NO PRICING - just selection)
    explorationCards.forEach(card => {
        card.addEventListener('click', function() {
            const region = this.dataset.region;
            const regionName = this.querySelector('h4').textContent;

            // Toggle selection
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedServices.explorations = selectedServices.explorations.filter(
                    item => item !== regionName
                );
            } else {
                // Select
                this.classList.add('selected');
                selectedServices.explorations.push(regionName);
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
            if (category !== 'explorations' && category !== 'simulated-worlds' && selectedServices[category]) {
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

        // Display selected Simulated Universe worlds (NO PRICE - just info)
        if (selectedServices['simulated-worlds'].length > 0) {
            summaryHTML += `
                <div class="selected-item" style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <span style="font-weight: 600;">Simulated Universe Worlds:</span>
                    <span>${selectedServices['simulated-worlds'].join(', ')}</span>
                </div>
            `;
        }

        // Display selected exploration regions (NO PRICE - just info)
        if (selectedServices.explorations.length > 0) {
            summaryHTML += `
                <div class="selected-item" style="background: #f0f0f0; padding: 10px; border-radius: 8px; margin-top: 10px;">
                    <span style="font-weight: 600;">Exploration Regions:</span>
                    <span>${selectedServices.explorations.join(', ')}</span>
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
            if (category !== 'explorations' && category !== 'simulated-worlds' && selectedServices[category]) {
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
            game: 'Honkai Star Rail',
            services: selectedServices,
            paymentMethod: paymentMethod.value,
            paymentDetails: paymentInput.value,
            total: totalPriceElement.textContent
        };

        // Log order data (for debugging)
        console.log('Order Data:', orderData);

        // Create detailed summary
        const servicesList = Object.keys(selectedServices)
            .filter(k => k !== 'explorations' && k !== 'simulated-worlds' && selectedServices[k])
            .map(k => selectedServices[k].name)
            .join(', ');

        let additionalInfo = '';
        if (selectedServices['simulated-worlds'].length > 0) {
            additionalInfo += `\n\nSimulated Universe Worlds: ${selectedServices['simulated-worlds'].join(', ')}`;
        }
        if (selectedServices.explorations.length > 0) {
            additionalInfo += `\n\nExploration Regions: ${selectedServices.explorations.join(', ')}`;
        }

        // TODO: Send order data to backend
        // For now, show success message
        alert(`Order placed successfully!\n\nGame: Honkai Star Rail\n\nServices: ${servicesList}${additionalInfo}\n\nTotal: ₱${totalPriceElement.textContent}\n\nRedirecting to your profile...`);
        
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