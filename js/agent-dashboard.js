document.addEventListener('DOMContentLoaded', function() {
    
    // Get all menu buttons and content sections
    const menuButtons = document.querySelectorAll('.menu-btn');
    const contentSections = document.querySelectorAll('.content-section');

    // Handle menu navigation
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.dataset.section;

            // Remove active class from all buttons
            menuButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Hide all content sections
            contentSections.forEach(section => section.classList.remove('active'));

            // Show target section
            const sectionToShow = document.getElementById(`${targetSection}-section`);
            if (sectionToShow) {
                sectionToShow.classList.add('active');
            }
        });
    });

    // Handle status dropdown changes
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.querySelector('.order-id strong').textContent;
            const newStatus = this.value;

            // Remove all status classes
            this.classList.remove('pending', 'in-progress', 'completed');
            
            // Add new status class
            this.classList.add(newStatus);

            // Show confirmation
            alert(`Order ${orderId} status updated to: ${this.options[this.selectedIndex].text}`);

            // If completed, disable the select
            if (newStatus === 'completed') {
                this.disabled = true;
            }
        });
    });

    // Handle View Details buttons
    const viewDetailsButtons = document.querySelectorAll('.action-btn.primary');
    viewDetailsButtons.forEach(button => {
        if (button.textContent.includes('View Details')) {
            button.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                orderCard.classList.toggle('expanded');
                
                // Toggle button text
                if (orderCard.classList.contains('expanded')) {
                    this.textContent = 'Hide Details';
                } else {
                    this.textContent = 'View Details';
                }
            });
        }
    });

    // Handle Chat with User buttons
    const chatButtons = document.querySelectorAll('.action-btn.secondary');
    chatButtons.forEach(button => {
        if (button.textContent.includes('Chat with User')) {
            button.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.querySelector('.order-id strong').textContent;
                const customer = orderCard.querySelector('.detail-row:last-child span:last-child').textContent;
                
                // Switch to chat section
                menuButtons.forEach(btn => btn.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                const chatMenuBtn = document.querySelector('[data-section="chat"]');
                const chatSection = document.getElementById('chat-section');
                
                if (chatMenuBtn) chatMenuBtn.classList.add('active');
                if (chatSection) chatSection.classList.add('active');
                
                // Add notification in chat
                const chatMessages = document.getElementById('chatMessages');
                const emptyState = chatMessages.querySelector('.chat-empty');
                if (emptyState) {
                    emptyState.remove();
                }
                
                const notificationMsg = document.createElement('div');
                notificationMsg.style.cssText = 'text-align: center; padding: 15px; background: #f0f0f0; border-radius: 8px; margin-bottom: 15px; color: #666;';
                notificationMsg.textContent = `Chat started with ${customer} for ${orderId}`;
                chatMessages.appendChild(notificationMsg);
                
                // Focus on chat input
                setTimeout(() => {
                    const chatInput = document.getElementById('chatInput');
                    if (chatInput) chatInput.focus();
                }, 300);
            });
        }
    });

    // Handle Mark Complete button
    const completeButtons = document.querySelectorAll('.action-btn.success');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.querySelector('.order-id strong').textContent;
            
            if (confirm(`Mark ${orderId} as completed?`)) {
                const statusSelect = orderCard.querySelector('.status-select');
                statusSelect.value = 'completed';
                statusSelect.classList.remove('pending', 'in-progress');
                statusSelect.classList.add('completed');
                statusSelect.disabled = true;
                
                // Remove the button
                this.remove();
                
                alert(`${orderId} marked as completed!`);
            }
        });
    });

    // Handle Manage buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardHeader = this.closest('.card-header');
            const cardTitle = cardHeader.querySelector('h3').textContent;
            
            alert(`Edit ${cardTitle}\n\nThis would open an edit form or modal.`);
        });
    });

    // Chat functionality
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatMessages = document.getElementById('chatMessages');

    function sendMessage() {
        const message = chatInput.value.trim();
        
        if (message === '') return;

        // Remove empty state if it exists
        const emptyState = chatMessages.querySelector('.chat-empty');
        if (emptyState) {
            emptyState.remove();
        }

        // Create message bubble (agent message)
        const messageElement = document.createElement('div');
        messageElement.className = 'message agent-message';
        messageElement.innerHTML = `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 18px; 
                        border-radius: 18px 18px 4px 18px; 
                        max-width: 70%; 
                        margin-left: auto; 
                        margin-bottom: 10px;
                        word-wrap: break-word;">
                ${message}
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        
        // Clear input
        chatInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Simulate customer response (for demo purposes)
        setTimeout(() => {
            const customerMessage = document.createElement('div');
            customerMessage.className = 'message customer-message';
            customerMessage.innerHTML = `
                <div style="background: #f0f0f0; 
                            color: #333; 
                            padding: 12px 18px; 
                            border-radius: 18px 18px 18px 4px; 
                            max-width: 70%; 
                            margin-right: auto; 
                            margin-bottom: 10px;
                            word-wrap: break-word;">
                    Thank you! I'll wait for updates.
                </div>
            `;
            chatMessages.appendChild(customerMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    // Send message on button click
    if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

});