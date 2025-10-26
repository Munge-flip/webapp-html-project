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

    // Modal functionality
    const modal = document.getElementById('addAgentModal');
    const addAgentBtn = document.getElementById('addAgentBtn');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancelBtn');
    const addAgentForm = document.getElementById('addAgentForm');

    // Open modal
    if (addAgentBtn) {
        addAgentBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }

    // Close modal
    function closeModalFunc() {
        modal.classList.remove('active');
        addAgentForm.reset();
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeModalFunc);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModalFunc);
    }

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Handle add agent form submission
    if (addAgentForm) {
        addAgentForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const agentName = document.getElementById('agentName').value;
            const agentId = document.getElementById('agentId').value;
            const agentEmail = document.getElementById('agentEmail').value;

            // Create new agent card
            const agentsGrid = document.querySelector('.agents-grid');
            const newAgentCard = document.createElement('div');
            newAgentCard.className = 'agent-card';
            
            // Get initials from name
            const initials = agentName.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
            
            newAgentCard.innerHTML = `
                <div class="agent-header">
                    <div class="agent-avatar">${initials}</div>
                    <div class="agent-info">
                        <h3>${agentName}</h3>
                        <p class="agent-id">ID: ${agentId}</p>
                    </div>
                    <div class="agent-stats">
                        <span class="stat-badge">0 active</span>
                    </div>
                </div>
                <div class="agent-details">
                    <div class="detail-item">
                        <span>Orders Handling:</span>
                        <strong>0</strong>
                    </div>
                    <div class="detail-item">
                        <span>Completion Rate:</span>
                        <strong>0/0</strong>
                    </div>
                    <div class="detail-item">
                        <span>Status:</span>
                        <span class="badge in-progress">Active</span>
                    </div>
                </div>
                <div class="agent-actions">
                    <button class="btn-secondary">View Orders</button>
                    <button class="btn-danger">Remove</button>
                </div>
            `;

            agentsGrid.appendChild(newAgentCard);

            // Add event listeners to new buttons
            const removeBtn = newAgentCard.querySelector('.btn-danger');
            removeBtn.addEventListener('click', function() {
                if (confirm('Are you sure you want to remove this agent?')) {
                    newAgentCard.remove();
                }
            });

            // Close modal and show success
            closeModalFunc();
            alert(`Agent ${agentName} has been added successfully!`);

            // Update stats (optional)
            updateStats();
        });
    }

    // Handle delete buttons for orders
    const deleteButtons = document.querySelectorAll('.action-link.delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this item?')) {
                const row = this.closest('tr');
                if (row) {
                    row.remove();
                    alert('Item deleted successfully!');
                }
            }
        });
    });

    // Handle view buttons
    const viewButtons = document.querySelectorAll('.action-link');
    viewButtons.forEach(button => {
        if (button.textContent.trim() === 'View') {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                if (row) {
                    const orderId = row.querySelector('td:first-child').textContent;
                    alert(`View details for order ${orderId}\n\nThis would open a detail page or modal.`);
                }
            });
        }
        
        if (button.textContent.trim() === 'Edit') {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                if (row) {
                    const userId = row.querySelector('td:first-child').textContent;
                    alert(`Edit user ${userId}\n\nThis would open an edit form.`);
                }
            });
        }

        if (button.textContent.trim() === 'Assign') {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                if (row) {
                    const orderId = row.querySelector('td:first-child').textContent;
                    // Simple prompt for demo - you'd want a proper modal
                    const agentName = prompt('Enter agent name to assign:');
                    if (agentName) {
                        row.querySelector('td:nth-child(5)').textContent = agentName;
                        const badge = row.querySelector('.badge');
                        badge.className = 'badge in-progress';
                        badge.textContent = 'In Progress';
                        alert(`Order ${orderId} assigned to ${agentName}`);
                    }
                }
            });
        }
    });

    // Handle agent action buttons
    const agentViewButtons = document.querySelectorAll('.agent-card .btn-secondary');
    agentViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const agentCard = this.closest('.agent-card');
            const agentName = agentCard.querySelector('.agent-info h3').textContent;
            alert(`View orders for ${agentName}\n\nThis would show all orders assigned to this agent.`);
        });
    });

    const agentRemoveButtons = document.querySelectorAll('.agent-card .btn-danger');
    agentRemoveButtons.forEach(button => {
        button.addEventListener('click', function() {
            const agentCard = this.closest('.agent-card');
            const agentName = agentCard.querySelector('.agent-info h3').textContent;
            if (confirm(`Are you sure you want to remove ${agentName}?`)) {
                agentCard.remove();
                alert(`${agentName} has been removed.`);
                updateStats();
            }
        });
    });

    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const table = this.closest('.content-section').querySelector('.data-table');
            
            if (table) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            }
        });
    });

    // Update stats function (optional - for dynamic updates)
    function updateStats() {
        const agentCards = document.querySelectorAll('.agent-card');
        const agentCountElement = document.querySelector('.agents-icon').closest('.stat-card').querySelector('.stat-number');
        if (agentCountElement) {
            agentCountElement.textContent = agentCards.length;
        }
    }

});