// Check authentication before loading anything
const checkAuth = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/auth/status', {
            credentials: 'include'
        });
        
        if (!response.ok) {
            // Not logged in, redirect to login page
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Auth check error:', error);
        // API might be down or network error
        return false;
    }
};

// Current date display
document.getElementById('current-date').textContent = new Date().toLocaleString();

// Load user information
function loadUserInfo() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        // Set user avatar initial
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.textContent = user.firstName ? user.firstName[0] : user.username[0];
        }
        
        // Set user name
        const userName = document.querySelector('.user-name');
        if (userName) {
            userName.textContent = user.username;
        }
        
        // Set user role
        const userRole = document.querySelector('.user-role');
        if (userRole) {
            userRole.textContent = user.role || 'User';
        }
    }
}

// Handle logout
function setupLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                // Clear local storage
                localStorage.removeItem('user');
                
                // Redirect to login page
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('Failed to logout. Please try again.');
            }
        });
    }
}

// Navigation
const setupNavigation = () => {
    const menuItems = document.querySelectorAll('.sidebar-menu-item');
    const contentSections = document.querySelectorAll('.content-section');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const sectionId = item.getAttribute('data-section');
            
            // Update active menu item
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            // Show selected content section
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
            
            // Load data for the section if needed
            if (sectionId === 'animals') {
                loadAnimals();
            } else if (sectionId === 'health') {
                loadHealthRecords();
            }
        });
    });
};

// Modal handling
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'flex';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Close modals when clicking close button or outside
document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Open add animal modal
document.getElementById('add-animal-btn')?.addEventListener('click', () => {
    // Reset form
    document.getElementById('add-animal-form').reset();
    // Set default date to today
    document.querySelector('#add-animal-form [name="birth_date"]').value = new Date().toISOString().split('T')[0];
    // Open modal
    openModal('add-animal-modal');
});

// Open add health record modal
document.getElementById('add-health-record-btn')?.addEventListener('click', () => {
    // Reset form
    document.getElementById('add-health-form').reset();
    // Set default date to today
    document.querySelector('#add-health-form [name="date"]').value = new Date().toISOString().split('T')[0];
    // Open modal
    openModal('add-health-record-modal');
});

// Show/hide treatment/vaccination fields based on record type
document.getElementById('record-type-select')?.addEventListener('change', function() {
    const vaccinationDetails = document.getElementById('vaccination-details');
    const treatmentDetails = document.getElementById('treatment-details');
    
    vaccinationDetails.style.display = 'none';
    treatmentDetails.style.display = 'none';
    
    if (this.value === 'vaccination') {
        vaccinationDetails.style.display = 'block';
    } else if (this.value === 'treatment' || this.value === 'illness') {
        treatmentDetails.style.display = 'block';
    }
});

// Helper function for API calls that includes credentials
async function apiFetch(url, options = {}) {
    // Always include credentials
    const fetchOptions = {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(url, fetchOptions);
        
        // Handle unauthorized errors by redirecting to login
        if (response.status === 401) {
            console.error('Authentication error. Redirecting to login...');
            window.location.href = 'login.html';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
}

// Load animals from API
async function loadAnimals() {
    try {
        const response = await apiFetch('http://localhost:5000/api/animals/');
        
        if (!response) return []; // Unauthorized or error
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const animals = await response.json();
        
        // Update counter
        document.getElementById('total-animals').textContent = animals.length;
        
        // Update animals table
        const animalsList = document.getElementById('animals-list');
        
        if (animals.length === 0) {
            animalsList.innerHTML = '<tr><td colspan="7" class="text-center">No animals found</td></tr>';
        } else {
            animalsList.innerHTML = animals.map(animal => `
                <tr>
                    <td>${animal.tag_id}</td>
                    <td>${animal.name}</td>
                    <td>${animal.breed || 'Unknown'}</td>
                    <td>${animal.gender}</td>
                    <td>${animal.birth_date || 'Unknown'}</td>
                    <td><span class="badge badge-${animal.status === 'active' ? 'success' : (animal.status === 'sold' ? 'warning' : 'danger')}">${animal.status}</span></td>
                    <td>
                        <button class="btn btn-outline view-animal" data-id="${animal.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline edit-animal" data-id="${animal.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Update animal selects
        const animalSelects = document.querySelectorAll('#animal-select, #health-filter');
        animalSelects.forEach(select => {
            // Clear all options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add animals to select
            animals.forEach(animal => {
                const option = document.createElement('option');
                option.value = animal.id;
                option.textContent = `${animal.tag_id} - ${animal.name}`;
                select.appendChild(option);
            });
        });
        
        return animals;
    } catch (error) {
        console.error('Error loading animals:', error);
        document.getElementById('animals-list').innerHTML = `
            <tr><td colspan="7" class="text-center">Error loading animals: ${error.message}</td></tr>
        `;
        return [];
    }
}

// Load health records from API
async function loadHealthRecords(animalId = null) {
    try {
        let url = 'http://localhost:5000/api/health/records';
        if (animalId) {
            url += `?animal_id=${animalId}`;
        }
        
        const response = await apiFetch(url);
        
        if (!response) return []; // Unauthorized or error
        
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        
        const records = await response.json();
        
        // Update counter
        document.getElementById('health-events').textContent = records.length;
        
        // Update health records table
        const recordsList = document.getElementById('health-records-list');
        
        if (records.length === 0) {
            recordsList.innerHTML = '<tr><td colspan="6" class="text-center">No health records found</td></tr>';
        } else {
            recordsList.innerHTML = records.map(record => `
                <tr>
                    <td>${record.animal_tag}</td>
                    <td>${record.record_type}</td>
                    <td>${record.date}</td>
                    <td>${record.notes || '-'}</td>
                    <td>${record.created_by}</td>
                    <td>
                        <button class="btn btn-outline view-record" data-id="${record.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline delete-record" data-id="${record.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        // Update recent events on dashboard
        const recentEvents = document.getElementById('recent-events');
        
        if (records.length === 0) {
            recentEvents.innerHTML = '<tr><td colspan="5" class="text-center">No events found</td></tr>';
        } else {
            // Sort by date and take latest 5
            const latestRecords = [...records]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
                
            recentEvents.innerHTML = latestRecords.map(record => `
                <tr>
                    <td>${record.animal_tag}</td>
                    <td>${record.record_type}</td>
                    <td>${record.date}</td>
                    <td>
                        <span class="badge badge-${
                            record.record_type === 'checkup' ? 'success' : 
                            (record.record_type === 'vaccination' ? 'info' : 'warning')
                        }">
                            ${record.record_type}
                        </span>
                    </td>
                    <td>
                        <button class="btn btn-outline view-record" data-id="${record.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        }
        
        return records;
    } catch (error) {
        console.error('Error loading health records:', error);
        document.getElementById('health-records-list').innerHTML = `
            <tr><td colspan="6" class="text-center">Error loading health records: ${error.message}</td></tr>
        `;
        return [];
    }
}

// Initialize Charts
function initCharts(animals, healthRecords) {
    // Breed chart
    if (animals && animals.length > 0) {
        const breedCounts = {};
        animals.forEach(animal => {
            const breed = animal.breed || 'Unknown';
            breedCounts[breed] = (breedCounts[breed] || 0) + 1;
        });
        
        new Chart(document.getElementById('breed-chart'), {
            type: 'pie',
            data: {
                labels: Object.keys(breedCounts),
                datasets: [{
                    data: Object.values(breedCounts),
                    backgroundColor: [
                        '#2c6b38', '#4a8c57', '#8c7142', '#343a40', 
                        '#6c757d', '#a83232', '#3275a8', '#a83275'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Health events chart
    const healthData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            label: 'Health Events',
            data: [4, 7, 3, 5, 2, 8, 6, 0, 0, 0, 0, 0],
            backgroundColor: '#4a8c57',
            borderColor: '#2c6b38',
            borderWidth: 1
        }]
    };
    
    new Chart(document.getElementById('health-chart'), {
        type: 'bar',
        data: healthData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// Initialize app
async function initApp() {
    // Check if user is authenticated
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;
    
    // Load user information
    loadUserInfo();
    
    // Setup logout button
    setupLogout();
    
    // Setup navigation
    setupNavigation();
    
    // Load current date
    document.getElementById('current-date').textContent = new Date().toLocaleString();
    
    // Load initial data
    const animals = await loadAnimals();
    const healthRecords = await loadHealthRecords();
    
    // Initialize charts
    initCharts(animals, healthRecords);
    
    // Set up event listeners
    document.getElementById('refresh-animals')?.addEventListener('click', loadAnimals);
    document.getElementById('refresh-health')?.addEventListener('click', () => {
        const animalId = document.getElementById('health-filter').value;
        loadHealthRecords(animalId);
    });
    document.getElementById('refresh-events')?.addEventListener('click', loadHealthRecords);
    
    // Health filter change
    document.getElementById('health-filter')?.addEventListener('change', function() {
        loadHealthRecords(this.value);
    });
    
    // Save animal
    document.getElementById('save-animal-btn').addEventListener('click', async () => {
        const form = document.getElementById('add-animal-form');
        const formData = new FormData(form);
        const animalData = {};
        
        formData.forEach((value, key) => {
            animalData[key] = value;
        });
        
        try {
            const response = await fetch('http://localhost:5000/api/animals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(animalData),
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            // Close modal and reload animals
            closeModal('add-animal-modal');
            loadAnimals();
            
            // Show success message
            alert('Animal added successfully!');
        } catch (error) {
            console.error('Error adding animal:', error);
            alert(`Error adding animal: ${error.message}`);
        }
    });
    
    // Save health record
    document.getElementById('save-health-btn').addEventListener('click', async () => {
        const form = document.getElementById('add-health-form');
        const formData = new FormData(form);
        const recordData = {};
        
        formData.forEach((value, key) => {
            if (value) recordData[key] = value;
        });
        
        // Add vaccinations if applicable
        if (recordData.record_type === 'vaccination' && recordData.vaccine_name) {
            recordData.vaccinations = [{
                vaccine_name: recordData.vaccine_name,
                dose: recordData.dose,
                date_administered: recordData.date,
                next_due_date: recordData.next_due_date
            }];
            
            // Remove these from the main object
            delete recordData.vaccine_name;
            delete recordData.dose;
            delete recordData.next_due_date;
        }
        
        // Add treatments if applicable
        if ((recordData.record_type === 'treatment' || recordData.record_type === 'illness') && recordData.treatment_type) {
            recordData.treatments = [{
                treatment_type: recordData.treatment_type,
                medication: recordData.medication,
                dosage: recordData.dosage,
                start_date: recordData.date,
                end_date: recordData.end_date
            }];
            
            // Remove these from the main object
            delete recordData.treatment_type;
            delete recordData.medication;
            delete recordData.dosage;
            delete recordData.end_date;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/health/records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(recordData),
                credentials: 'include'
            });
            
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            // Close modal and reload records
            closeModal('add-health-record-modal');
            loadHealthRecords();
            
            // Show success message
            alert('Health record added successfully!');
        } catch (error) {
            console.error('Error adding health record:', error);
            alert(`Error adding health record: ${error.message}`);
        }
    });
    
    // Report generation
    document.getElementById('generate-report').addEventListener('click', () => {
        const reportType = document.getElementById('report-type').value;
        const dateRange = document.getElementById('date-range').value;
        
        const reportPreview = document.getElementById('report-preview');
        reportPreview.innerHTML = `<p>Generating ${reportType} report for ${dateRange} range...</p>`;
        
        // Simulate report generation
        setTimeout(() => {
            if (reportType === 'animals') {
                reportPreview.innerHTML = `
                    <h3>Animals Report</h3>
                    <p>Date Range: ${dateRange}</p>
                    <p>Total Animals: ${animals.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Tag ID</th>
                                <th>Name</th>
                                <th>Breed</th>
                                <th>Gender</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${animals.map(animal => `
                                <tr>
                                    <td>${animal.tag_id}</td>
                                    <td>${animal.name}</td>
                                    <td>${animal.breed || 'Unknown'}</td>
                                    <td>${animal.gender}</td>
                                    <td>${animal.status}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else if (reportType === 'health') {
                reportPreview.innerHTML = `
                    <h3>Health Records Report</h3>
                    <p>Date Range: ${dateRange}</p>
                    <p>Total Records: ${healthRecords.length}</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Animal</th>
                                <th>Record Type</th>
                                <th>Date</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${healthRecords.map(record => `
                                <tr>
                                    <td>${record.animal_tag}</td>
                                    <td>${record.record_type}</td>
                                    <td>${record.date}</td>
                                    <td>${record.notes || '-'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
            } else {
                reportPreview.innerHTML = `<p>Report type '${reportType}' not implemented yet.</p>`;
            }
        }, 1000);
    });
}

// Start the application
document.addEventListener('DOMContentLoaded', initApp);