// Health records list component
export default {
    template: `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h1>Health Records</h1>
                <button class="btn btn-primary" @click="showAddModal = true">Add New Record</button>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-4">
                            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search...">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="filterAnimal">
                                <option value="">All Animals</option>
                                <option v-for="animal in animals" :key="animal.id" :value="animal.id">
                                    {{ animal.tag_id }} {{ animal.name ? '- ' + animal.name : '' }}
                                </option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="filterType">
                                <option value="">All Types</option>
                                <option value="vaccination">Vaccination</option>
                                <option value="treatment">Treatment</option>
                                <option value="check-up">Check-up</option>
                            </select>
                        </div>
                        <div class="col-md-2">
                            <select class="form-select" v-model="sortOrder">
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Animal</th>
                                    <th>Record Type</th>
                                    <th>Notes</th>
                                    <th>Created By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="record in filteredRecords" :key="record.id">
                                    <td>{{ record.date }}</td>
                                    <td>
                                        <router-link :to="'/animals/' + record.animal_id">
                                            {{ record.animal_tag }}
                                        </router-link>
                                    </td>
                                    <td>
                                        <span :class="getRecordTypeBadge(record.record_type)">
                                            {{ record.record_type }}
                                        </span>
                                    </td>
                                    <td>{{ record.notes.substring(0, 50) }}{{ record.notes.length > 50 ? '...' : '' }}</td>
                                    <td>{{ record.created_by }}</td>
                                    <td>
                                        <router-link :to="'/health-records/' + record.id" class="btn btn-sm btn-info">View</router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Add Health Record Modal -->
            <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal }">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Health Record</h5>
                            <button type="button" class="btn-close" @click="showAddModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveHealthRecord">
                                <div class="mb-3">
                                    <label for="animal_id" class="form-label">Animal *</label>
                                    <select class="form-select" id="animal_id" v-model="newRecord.animal_id" required>
                                        <option value="">Select Animal</option>
                                        <option v-for="animal in animals" :key="animal.id" :value="animal.id">
                                            {{ animal.tag_id }} {{ animal.name ? '- ' + animal.name : '' }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="record_date" class="form-label">Date *</label>
                                    <input type="date" class="form-control" id="record_date" v-model="newRecord.date" required>
                                </div>
                                <div class="mb-3">
                                    <label for="record_type" class="form-label">Record Type *</label>
                                    <select class="form-select" id="record_type" v-model="newRecord.record_type" required>
                                        <option value="vaccination">Vaccination</option>
                                        <option value="treatment">Treatment</option>
                                        <option value="check-up">Check-up</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="notes" class="form-label">Notes</label>
                                    <textarea class="form-control" id="notes" v-model="newRecord.notes" rows="3"></textarea>
                                </div>
                                
                                <!-- Vaccination details -->
                                <div v-if="newRecord.record_type === 'vaccination'">
                                    <h5 class="mt-4">Vaccination Details</h5>
                                    <div class="mb-3">
                                        <label for="vaccine_name" class="form-label">Vaccine Name *</label>
                                        <input type="text" class="form-control" id="vaccine_name" v-model="newRecord.vaccination.vaccine_name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="dose" class="form-label">Dose</label>
                                        <input type="text" class="form-control" id="dose" v-model="newRecord.vaccination.dose">
                                    </div>
                                    <div class="mb-3">
                                        <label for="next_due_date" class="form-label">Next Due Date</label>
                                        <input type="date" class="form-control" id="next_due_date" v-model="newRecord.vaccination.next_due_date">
                                    </div>
                                </div>
                                
                                <!-- Treatment details -->
                                <div v-if="newRecord.record_type === 'treatment'">
                                    <h5 class="mt-4">Treatment Details</h5>
                                    <div class="mb-3">
                                        <label for="treatment_type" class="form-label">Treatment Type *</label>
                                        <input type="text" class="form-control" id="treatment_type" v-model="newRecord.treatment.treatment_type" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="medication" class="form-label">Medication</label>
                                        <input type="text" class="form-control" id="medication" v-model="newRecord.treatment.medication">
                                    </div>
                                    <div class="mb-3">
                                        <label for="dosage" class="form-label">Dosage</label>
                                        <input type="text" class="form-control" id="dosage" v-model="newRecord.treatment.dosage">
                                    </div>
                                    <div class="mb-3">
                                        <label for="start_date" class="form-label">Start Date</label>
                                        <input type="date" class="form-control" id="start_date" v-model="newRecord.treatment.start_date">
                                    </div>
                                    <div class="mb-3">
                                        <label for="end_date" class="form-label">End Date</label>
                                        <input type="date" class="form-control" id="end_date" v-model="newRecord.treatment.end_date">
                                    </div>
                                </div>
                                
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="showAddModal = false">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Backdrop -->
            <div class="modal-backdrop fade show" v-if="showAddModal"></div>
        </div>
    `,
    data() {
        return {
            records: [],
            animals: [],
            searchQuery: '',
            filterAnimal: '',
            filterType: '',
            sortOrder: 'newest',
            showAddModal: false,
            newRecord: {
                animal_id: '',
                date: new Date().toISOString().substr(0, 10),
                record_type: 'check-up',
                notes: '',
                vaccination: {
                    vaccine_name: '',
                    dose: '',
                    next_due_date: ''
                },
                treatment: {
                    treatment_type: '',
                    medication: '',
                    dosage: '',
                    start_date: new Date().toISOString().substr(0, 10),
                    end_date: ''
                }
            }
        };
    },
    computed: {
        filteredRecords() {
            let result = this.records;
            
            // Apply animal filter
            if (this.filterAnimal) {
                result = result.filter(record => record.animal_id == this.filterAnimal);
            }
            
            // Apply type filter
            if (this.filterType) {
                result = result.filter(record => record.record_type === this.filterType);
            }
            
            // Apply search
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(record => 
                    record.notes.toLowerCase().includes(query) ||
                    record.animal_tag.toLowerCase().includes(query) ||
                    record.created_by.toLowerCase().includes(query)
                );
            }
            
            // Apply sorting
            result = [...result].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return this.sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
            });
            
            return result;
        }
    },
    created() {
        this.fetchRecords();
        this.fetchAnimals();
    },
    methods: {
        async fetchRecords() {
            try {
                const response = await axios.get('/health/records');
                this.records = response.data;
            } catch (error) {
                console.error('Error fetching health records:', error);
            }
        },
        async fetchAnimals() {
            try {
                const response = await axios.get('/animals');
                this.animals = response.data;
            } catch (error) {
                console.error('Error fetching animals:', error);
            }
        },
        getRecordTypeBadge(type) {
            switch (type) {
                case 'vaccination': return 'badge bg-primary';
                case 'treatment': return 'badge bg-warning text-dark';
                case 'check-up': return 'badge bg-info text-dark';
                default: return 'badge bg-secondary';
            }
        },
        async saveHealthRecord() {
            try {
                const recordData = {
                    animal_id: this.newRecord.animal_id,
                    date: this.newRecord.date,
                    record_type: this.newRecord.record_type,
                    notes: this.newRecord.notes
                };
                
                // Add vaccination or treatment data based on record type
                if (this.newRecord.record_type === 'vaccination') {
                    recordData.vaccinations = [this.newRecord.vaccination];
                } else if (this.newRecord.record_type === 'treatment') {
                    recordData.treatments = [this.newRecord.treatment];
                }
                
                await axios.post('/health/records', recordData);
                this.showAddModal = false;
                this.fetchRecords();
                
                // Reset form
                this.newRecord = {
                    animal_id: '',
                    date: new Date().toISOString().substr(0, 10),
                    record_type: 'check-up',
                    notes: '',
                    vaccination: {
                        vaccine_name: '',
                        dose: '',
                        next_due_date: ''
                    },
                    treatment: {
                        treatment_type: '',
                        medication: '',
                        dosage: '',
                        start_date: new Date().toISOString().substr(0, 10),
                        end_date: ''
                    }
                };
            } catch (error) {
                console.error('Error adding health record:', error);
                alert('Error adding health record: ' + (error.response?.data?.error || error.message));
            }
        }
    }
};