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

        // Create message bubble
        const messageElement = document.createElement('div');
        messageElement.className = 'message user-message';
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

        // Simulate agent response (for demo purposes)
        setTimeout(() => {
            const agentMessage = document.createElement('div');
            agentMessage.className = 'message agent-message';
            agentMessage.innerHTML = `
                <div style="background: #f0f0f0; 
                            color: #333; 
                            padding: 12px 18px; 
                            border-radius: 18px 18px 18px 4px; 
                            max-width: 70%; 
                            margin-right: auto; 
                            margin-bottom: 10px;
                            word-wrap: break-word;">
                    Thank you for your message! Our support team will respond shortly.
                </div>
            `;
            chatMessages.appendChild(agentMessage);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Handle View buttons in order cards
    const viewButtons = document.querySelectorAll('.action-btn.primary');
    viewButtons.forEach(button => {
        if (button.textContent.trim() === 'View') {
            button.addEventListener('click', function() {
                const orderCard = this.closest('.order-card');
                const orderId = orderCard.querySelector('.order-id strong').textContent;
                const game = orderCard.querySelector('.detail-row:first-child span:last-child').textContent;
                const service = orderCard.querySelector('.detail-row:last-child span:last-child').textContent;
                
                // TODO: Navigate to order detail page or show modal
                alert(`Order Details:\n\nOrder ID: ${orderId}\nGame: ${game}\nService: ${service}`);
            });
        }
    });

    // Handle Chat with Agent buttons
    const chatAgentButtons = document.querySelectorAll('.action-btn.secondary');
    chatAgentButtons.forEach(button => {
        if (button.textContent.trim() === 'Chat with Agent') {
            button.addEventListener('click', function() {
                // Switch to chat section
                menuButtons.forEach(btn => btn.classList.remove('active'));
                contentSections.forEach(section => section.classList.remove('active'));
                
                const chatMenuBtn = document.querySelector('[data-section="chat"]');
                const chatSection = document.getElementById('chat-section');
                
                if (chatMenuBtn) chatMenuBtn.classList.add('active');
                if (chatSection) chatSection.classList.add('active');
                
                // Focus on chat input
                setTimeout(() => {
                    chatInput.focus();
                }, 300);
            });
        }
    });

    // Handle Manage buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cardHeader = this.closest('.card-header');
            const cardTitle = cardHeader.querySelector('h3').textContent;
            
            // TODO: Open edit modal or navigate to edit page
            alert(`Edit ${cardTitle}\n\nThis would open an edit form or modal.`);
        });
    });

});