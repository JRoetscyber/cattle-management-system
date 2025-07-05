// Health record detail component
export default {
    template: `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h1>Health Record Details</h1>
                <div>
                    <button class="btn btn-warning me-2" @click="showEditModal = true">Edit</button>
                    <button class="btn btn-danger me-2" @click="confirmDelete">Delete</button>
                    <button class="btn btn-primary" @click="$router.push('/health-records')">Back to List</button>
                </div>
            </div>
            
            <div class="row" v-if="record">
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">Record Information</div>
                        <div class="card-body">
                            <table class="table">
                                <tr>
                                    <th>Animal:</th>
                                    <td>
                                        <router-link :to="'/animals/' + record.animal_id">
                                            {{ record.animal_tag }}
                                        </router-link>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Date:</th>
                                    <td>{{ record.date }}</td>
                                </tr>
                                <tr>
                                    <th>Record Type:</th>
                                    <td>
                                        <span :class="getRecordTypeBadge(record.record_type)">
                                            {{ record.record_type }}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th>Created By:</th>
                                    <td>{{ record.created_by }}</td>
                                </tr>
                                <tr>
                                    <th>Notes:</th>
                                    <td>{{ record.notes || 'No notes provided' }}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <!-- Vaccination details -->
                    <div class="card mb-4" v-if="record.vaccinations && record.vaccinations.length > 0">
                        <div class="card-header">Vaccination Details</div>
                        <div class="card-body">
                            <div v-for="(vaccination, index) in record.vaccinations" :key="index">
                                <table class="table">
                                    <tr>
                                        <th>Vaccine Name:</th>
                                        <td>{{ vaccination.vaccine_name }}</td>
                                    </tr>
                                    <tr>
                                        <th>Dose:</th>
                                        <td>{{ vaccination.dose || 'Not specified' }}</td>
                                    </tr>
                                    <tr>
                                        <th>Date Administered:</th>
                                        <td>{{ vaccination.date_administered }}</td>
                                    </tr>
                                    <tr>
                                        <th>Next Due Date:</th>
                                        <td>{{ vaccination.next_due_date || 'Not scheduled' }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Treatment details -->
                    <div class="card mb-4" v-if="record.treatments && record.treatments.length > 0">
                        <div class="card-header">Treatment Details</div>
                        <div class="card-body">
                            <div v-for="(treatment, index) in record.treatments" :key="index">
                                <table class="table">
                                    <tr>
                                        <th>Treatment Type:</th>
                                        <td>{{ treatment.treatment_type }}</td>
                                    </tr>
                                    <tr>
                                        <th>Medication:</th>
                                        <td>{{ treatment.medication || 'Not specified' }}</td>
                                    </tr>
                                    <tr>
                                        <th>Dosage:</th>
                                        <td>{{ treatment.dosage || 'Not specified' }}</td>
                                    </tr>
                                    <tr>
                                        <th>Start Date:</th>
                                        <td>{{ treatment.start_date }}</td>
                                    </tr>
                                    <tr>
                                        <th>End Date:</th>
                                        <td>{{ treatment.end_date || 'Ongoing' }}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Edit Record Modal -->
            <div class="modal" tabindex="-1" :class="{ 'd-block': showEditModal }">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Health Record</h5>
                            <button type="button" class="btn-close" @click="showEditModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveRecord">
                                <div class="mb-3">
                                    <label for="edit_date" class="form-label">Date *</label>
                                    <input type="date" class="form-control" id="edit_date" v-model="editRecord.date" required>
                                </div>
                                <div class="mb-3">
                                    <label for="edit_record_type" class="form-label">Record Type *</label>
                                    <select class="form-select" id="edit_record_type" v-model="editRecord.record_type" required disabled>
                                        <option value="vaccination">Vaccination</option>
                                        <option value="treatment">Treatment</option>
                                        <option value="check-up">Check-up</option>
                                    </select>
                                    <small class="text-muted">Record type cannot be changed</small>
                                </div>
                                <div class="mb-3">
                                    <label for="edit_notes" class="form-label">Notes</label>
                                    <textarea class="form-control" id="edit_notes" v-model="editRecord.notes" rows="3"></textarea>
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
            
            <!-- Delete Confirmation Modal -->
            <div class="modal" tabindex="-1" :class="{ 'd-block': showDeleteModal }">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Confirm Delete</h5>
                            <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
                        </div>
                        <div class="modal-body">
                            <p>Are you sure you want to delete this health record?</p>
                            <p class="text-danger">This action cannot be undone and will delete all associated vaccination and treatment data.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
                            <button type="button" class="btn btn-danger" @click="deleteRecord">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Backdrop -->
            <div class="modal-backdrop fade show" v-if="showEditModal || showDeleteModal"></div>
        </div>
    `,
    data() {
        return {
            record: null,
            showEditModal: false,
            showDeleteModal: false,
            editRecord: {
                date: '',
                record_type: '',
                notes: ''
            }
        };
    },
    created() {
        this.fetchRecord();
    },
    methods: {
        async fetchRecord() {
            try {
                const response = await axios.get(`/health/records/${this.$route.params.id}`);
                this.record = response.data;
                this.editRecord = {
                    date: this.record.date,
                    record_type: this.record.record_type,
                    notes: this.record.notes
                };
            } catch (error) {
                console.error('Error fetching health record:', error);
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
        confirmDelete() {
            this.showDeleteModal = true;
        },
        async saveRecord() {
            try {
                await axios.put(`/health/records/${this.record.id}`, this.editRecord);
                this.showEditModal = false;
                this.fetchRecord();
            } catch (error) {
                console.error('Error updating health record:', error);
                alert('Error updating health record: ' + (error.response?.data?.error || error.message));
            }
        },
        async deleteRecord() {
            try {
                await axios.delete(`/health/records/${this.record.id}`);
                this.showDeleteModal = false;
                this.$router.push('/health-records');
            } catch (error) {
                console.error('Error deleting health record:', error);
                alert('Error deleting health record: ' + (error.response?.data?.error || error.message));
            }
        }
    }
};