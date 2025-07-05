// Animal detail component
export default {
    template: `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h1>Animal Details</h1>
                <div>
                    <button class="btn btn-warning me-2" @click="showEditModal = true">Edit</button>
                    <button class="btn btn-primary" @click="$router.push('/animals')">Back to List</button>
                </div>
            </div>
            
            <div class="row" v-if="animal">
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">Basic Information</div>
                        <div class="card-body">
                            <table class="table">
                                <tr>
                                    <th>Tag ID:</th>
                                    <td>{{ animal.tag_id }}</td>
                                </tr>
                                <tr>
                                    <th>Name:</th>
                                    <td>{{ animal.name || 'N/A' }}</td>
                                </tr>
                                <tr>
                                    <th>Birth Date:</th>
                                    <td>{{ animal.birth_date || 'Unknown' }}</td>
                                </tr>
                                <tr>
                                    <th>Breed:</th>
                                    <td>{{ animal.breed || 'Unknown' }}</td>
                                </tr>
                                <tr>
                                    <th>Gender:</th>
                                    <td>{{ animal.gender }}</td>
                                </tr>
                                <tr>
                                    <th>Weight (kg):</th>
                                    <td>{{ animal.weight || 'Not recorded' }}</td>
                                </tr>
                                <tr>
                                    <th>Status:</th>
                                    <td>
                                        <span :class="getStatusBadgeClass(animal.status)">
                                            {{ animal.status }}
                                        </span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">Parentage</div>
                        <div class="card-body">
                            <table class="table">
                                <tr>
                                    <th>Mother:</th>
                                    <td>
                                        <router-link v-if="animal.mother" :to="'/animals/' + animal.mother_id">
                                            {{ animal.mother }}
                                        </router-link>
                                        <span v-else>Unknown</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Father:</th>
                                    <td>
                                        <router-link v-if="animal.father" :to="'/animals/' + animal.father_id">
                                            {{ animal.father }}
                                        </router-link>
                                        <span v-else>Unknown</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    
                    <div class="card mb-4">
                        <div class="card-header">Offspring</div>
                        <div class="card-body">
                            <div v-if="animal.offspring && animal.offspring.length > 0">
                                <ul class="list-group">
                                    <li v-for="offspringId in animal.offspring" :key="offspringId" class="list-group-item">
                                        <router-link :to="'/animals/' + offspringId">
                                            {{ getOffspringName(offspringId) }}
                                        </router-link>
                                    </li>
                                </ul>
                            </div>
                            <div v-else>
                                <p>No offspring recorded</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>Health Records</span>
                    <button class="btn btn-sm btn-primary" @click="showAddHealthModal = true">Add Health Record</button>
                </div>
                <div class="card-body">
                    <div v-if="healthRecords && healthRecords.length > 0">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Record Type</th>
                                    <th>Notes</th>
                                    <th>Created By</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="record in healthRecords" :key="record.id">
                                    <td>{{ record.date }}</td>
                                    <td>{{ record.record_type }}</td>
                                    <td>{{ record.notes }}</td>
                                    <td>{{ record.created_by }}</td>
                                    <td>
                                        <router-link :to="'/health-records/' + record.id" class="btn btn-sm btn-info">View</router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else>
                        <p>No health records found for this animal</p>
                    </div>
                </div>
            </div>
            
            <!-- Edit Animal Modal -->
            <div class="modal" tabindex="-1" :class="{ 'd-block': showEditModal }">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Animal</h5>
                            <button type="button" class="btn-close" @click="showEditModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveAnimal">
                                <div class="mb-3">
                                    <label for="tag_id" class="form-label">Tag ID *</label>
                                    <input type="text" class="form-control" id="tag_id" v-model="editAnimal.tag_id" required>
                                </div>
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="name" v-model="editAnimal.name">
                                </div>
                                <div class="mb-3">
                                    <label for="birth_date" class="form-label">Birth Date</label>
                                    <input type="date" class="form-control" id="birth_date" v-model="editAnimal.birth_date">
                                </div>
                                <div class="mb-3">
                                    <label for="breed" class="form-label">Breed</label>
                                    <select class="form-select" id="breed" v-model="editAnimal.breed_id">
                                        <option value="">Select Breed</option>
                                        <option v-for="breed in breeds" :key="breed.id" :value="breed.id">{{ breed.name }}</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="gender" class="form-label">Gender *</label>
                                    <select class="form-select" id="gender" v-model="editAnimal.gender" required>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="weight" class="form-label">Weight (kg)</label>
                                    <input type="number" step="0.1" class="form-control" id="weight" v-model="editAnimal.weight">
                                </div>
                                <div class="mb-3">
                                    <label for="status" class="form-label">Status</label>
                                    <select class="form-select" id="status" v-model="editAnimal.status">
                                        <option value="active">Active</option>
                                        <option value="sold">Sold</option>
                                        <option value="deceased">Deceased</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="mother_id" class="form-label">Mother</label>
                                    <select class="form-select" id="mother_id" v-model="editAnimal.mother_id">
                                        <option value="">None</option>
                                        <option v-for="animal in femaleAnimals" :key="animal.id" :value="animal.id">
                                            {{ animal.tag_id }} - {{ animal.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="father_id" class="form-label">Father</label>
                                    <select class="form-select" id="father_id" v-model="editAnimal.father_id">
                                        <option value="">None</option>
                                        <option v-for="animal in maleAnimals" :key="animal.id" :value="animal.id">
                                            {{ animal.tag_id }} - {{ animal.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="showEditModal = false">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Add Health Record Modal -->
            <div class="modal" tabindex="-1" :class="{ 'd-block': showAddHealthModal }">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Add Health Record</h5>
                            <button type="button" class="btn-close" @click="showAddHealthModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveHealthRecord">
                                <div class="mb-3">
                                    <label for="record_date" class="form-label">Date *</label>
                                    <input type="date" class="form-control" id="record_date" v-model="newHealthRecord.date" required>
                                </div>
                                <div class="mb-3">
                                    <label for="record_type" class="form-label">Record Type *</label>
                                    <select class="form-select" id="record_type" v-model="newHealthRecord.record_type" required>
                                        <option value="vaccination">Vaccination</option>
                                        <option value="treatment">Treatment</option>
                                        <option value="check-up">Check-up</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="notes" class="form-label">Notes</label>
                                    <textarea class="form-control" id="notes" v-model="newHealthRecord.notes" rows="3"></textarea>
                                </div>
                                
                                <!-- Vaccination details (show if record_type is vaccination) -->
                                <div v-if="newHealthRecord.record_type === 'vaccination'">
                                    <h5 class="mt-4">Vaccination Details</h5>
                                    <div class="mb-3">
                                        <label for="vaccine_name" class="form-label">Vaccine Name *</label>
                                        <input type="text" class="form-control" id="vaccine_name" v-model="newHealthRecord.vaccination.vaccine_name" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="dose" class="form-label">Dose</label>
                                        <input type="text" class="form-control" id="dose" v-model="newHealthRecord.vaccination.dose">
                                    </div>
                                    <div class="mb-3">
                                        <label for="next_due_date" class="form-label">Next Due Date</label>
                                        <input type="date" class="form-control" id="next_due_date" v-model="newHealthRecord.vaccination.next_due_date">
                                    </div>
                                </div>
                                
                                <!-- Treatment details (show if record_type is treatment) -->
                                <div v-if="newHealthRecord.record_type === 'treatment'">
                                    <h5 class="mt-4">Treatment Details</h5>
                                    <div class="mb-3">
                                        <label for="treatment_type" class="form-label">Treatment Type *</label>
                                        <input type="text" class="form-control" id="treatment_type" v-model="newHealthRecord.treatment.treatment_type" required>
                                    </div>
                                    <div class="mb-3">
                                        <label for="medication" class="form-label">Medication</label>
                                        <input type="text" class="form-control" id="medication" v-model="newHealthRecord.treatment.medication">
                                    </div>
                                    <div class="mb-3">
                                        <label for="dosage" class="form-label">Dosage</label>
                                        <input type="text" class="form-control" id="dosage" v-model="newHealthRecord.treatment.dosage">
                                    </div>
                                    <div class="mb-3">
                                        <label for="start_date" class="form-label">Start Date</label>
                                        <input type="date" class="form-control" id="start_date" v-model="newHealthRecord.treatment.start_date">
                                    </div>
                                    <div class="mb-3">
                                        <label for="end_date" class="form-label">End Date</label>
                                        <input type="date" class="form-control" id="end_date" v-model="newHealthRecord.treatment.end_date">
                                    </div>
                                </div>
                                
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="showAddHealthModal = false">Cancel</button>
                                    <button type="submit" class="btn btn-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Backdrop -->
            <div class="modal-backdrop fade show" v-if="showEditModal || showAddHealthModal"></div>
        </div>
    `,
    data() {
        return {
            animal: null,
            healthRecords: [],
            breeds: [],
            allAnimals: [],
            showEditModal: false,
            showAddHealthModal: false,
            editAnimal: {
                tag_id: '',
                name: '',
                birth_date: '',
                breed_id: '',
                gender: '',
                weight: '',
                status: 'active',
                mother_id: '',
                father_id: ''
            },
            newHealthRecord: {
                date: new Date().toISOString().substr(0, 10),
                record_type: 'check-up',
                notes: '',
                animal_id: '',
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
        femaleAnimals() {
            return this.allAnimals.filter(animal => 
                animal.gender === 'female' && animal.id !== this.$route.params.id
            );
        },
        maleAnimals() {
            return this.allAnimals.filter(animal => 
                animal.gender === 'male' && animal.id !== this.$route.params.id
            );
        }
    },
    created() {
        this.fetchAnimal();
        this.fetchHealthRecords();
        this.fetchBreeds();
        this.fetchAllAnimals();
    },
    methods: {
        async fetchAnimal() {
            try {
                const response = await axios.get(`/animals/${this.$route.params.id}`);
                this.animal = response.data;
                this.newHealthRecord.animal_id = this.animal.id;
            } catch (error) {
                console.error('Error fetching animal:', error);
            }
        },
        async fetchHealthRecords() {
            try {
                const response = await axios.get(`/health/records?animal_id=${this.$route.params.id}`);
                this.healthRecords = response.data;
            } catch (error) {
                console.error('Error fetching health records:', error);
            }
        },
        async fetchBreeds() {
            try {
                const response = await axios.get('/animals/breeds');
                this.breeds = response.data;
            } catch (error) {
                console.error('Error fetching breeds:', error);
            }
        },
        async fetchAllAnimals() {
            try {
                const response = await axios.get('/animals');
                this.allAnimals = response.data;
            } catch (error) {
                console.error('Error fetching animals:', error);
            }
        },
        getStatusBadgeClass(status) {
            switch (status) {
                case 'active': return 'badge bg-success';
                case 'sold': return 'badge bg-primary';
                case 'deceased': return 'badge bg-danger';
                default: return 'badge bg-secondary';
            }
        },
        getOffspringName(id) {
            const offspring = this.allAnimals.find(animal => animal.id === id);
            return offspring ? `${offspring.tag_id} ${offspring.name ? '- ' + offspring.name : ''}` : id;
        },
        prepareForEdit() {
            this.editAnimal = { ...this.animal };
            this.showEditModal = true;
        },
        async saveAnimal() {
            try {
                await axios.put(`/animals/${this.animal.id}`, this.editAnimal);
                this.showEditModal = false;
                this.fetchAnimal();
            } catch (error) {
                console.error('Error updating animal:', error);
                alert('Error updating animal: ' + (error.response?.data?.error || error.message));
            }
        },
        async saveHealthRecord() {
            try {
                const recordData = {
                    animal_id: this.animal.id,
                    date: this.newHealthRecord.date,
                    record_type: this.newHealthRecord.record_type,
                    notes: this.newHealthRecord.notes
                };
                
                // Add vaccination or treatment data based on record type
                if (this.newHealthRecord.record_type === 'vaccination') {
                    recordData.vaccinations = [this.newHealthRecord.vaccination];
                } else if (this.newHealthRecord.record_type === 'treatment') {
                    recordData.treatments = [this.newHealthRecord.treatment];
                }
                
                await axios.post('/health/records', recordData);
                this.showAddHealthModal = false;
                this.fetchHealthRecords();
                
                // Reset form
                this.newHealthRecord = {
                    date: new Date().toISOString().substr(0, 10),
                    record_type: 'check-up',
                    notes: '',
                    animal_id: this.animal.id,
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