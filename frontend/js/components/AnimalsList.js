// Animals list component
const AnimalsList = {
    template: `
        <div>
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h1>Animals</h1>
                <button class="btn btn-primary" @click="showAddModal = true">Add New Animal</button>
            </div>
            
            <div class="card mb-4">
                <div class="card-header">
                    <div class="row">
                        <div class="col-md-6">
                            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search by ID or name...">
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="filterBreed">
                                <option value="">All Breeds</option>
                                <option v-for="breed in breeds" :key="breed.id" :value="breed.id">{{ breed.name }}</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <select class="form-select" v-model="filterStatus">
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="sold">Sold</option>
                                <option value="deceased">Deceased</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th @click="sortBy('tag_id')">Tag ID</th>
                                    <th @click="sortBy('name')">Name</th>
                                    <th @click="sortBy('birth_date')">Birth Date</th>
                                    <th @click="sortBy('breed')">Breed</th>
                                    <th @click="sortBy('gender')">Gender</th>
                                    <th @click="sortBy('weight')">Weight (kg)</th>
                                    <th @click="sortBy('status')">Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="animal in filteredAnimals" :key="animal.id">
                                    <td>{{ animal.tag_id }}</td>
                                    <td>{{ animal.name }}</td>
                                    <td>{{ animal.birth_date }}</td>
                                    <td>{{ animal.breed }}</td>
                                    <td>{{ animal.gender }}</td>
                                    <td>{{ animal.weight }}</td>
                                    <td>
                                        <span :class="getStatusBadgeClass(animal.status)">
                                            {{ animal.status }}
                                        </span>
                                    </td>
                                    <td>
                                        <div class="btn-group">
                                            <router-link :to="'/animals/' + animal.id" class="btn btn-sm btn-info">View</router-link>
                                            <button class="btn btn-sm btn-warning" @click="editAnimal(animal)">Edit</button>
                                            <button class="btn btn-sm btn-danger" @click="confirmDelete(animal)">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Add/Edit Animal Modal -->
            <div class="modal" tabindex="-1" :class="{ 'd-block': showAddModal || showEditModal }">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">{{ showEditModal ? 'Edit Animal' : 'Add New Animal' }}</h5>
                            <button type="button" class="btn-close" @click="closeModal"></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveAnimal">
                                <div class="mb-3">
                                    <label for="tag_id" class="form-label">Tag ID *</label>
                                    <input type="text" class="form-control" id="tag_id" v-model="currentAnimal.tag_id" required>
                                </div>
                                <div class="mb-3">
                                    <label for="name" class="form-label">Name</label>
                                    <input type="text" class="form-control" id="name" v-model="currentAnimal.name">
                                </div>
                                <div class="mb-3">
                                    <label for="birth_date" class="form-label">Birth Date</label>
                                    <input type="date" class="form-control" id="birth_date" v-model="currentAnimal.birth_date">
                                </div>
                                <div class="mb-3">
                                    <label for="breed" class="form-label">Breed</label>
                                    <select class="form-select" id="breed" v-model="currentAnimal.breed_id">
                                        <option value="">Select Breed</option>
                                        <option v-for="breed in breeds" :key="breed.id" :value="breed.id">{{ breed.name }}</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="gender" class="form-label">Gender *</label>
                                    <select class="form-select" id="gender" v-model="currentAnimal.gender" required>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="weight" class="form-label">Weight (kg)</label>
                                    <input type="number" step="0.1" class="form-control" id="weight" v-model="currentAnimal.weight">
                                </div>
                                <div class="mb-3">
                                    <label for="status" class="form-label">Status</label>
                                    <select class="form-select" id="status" v-model="currentAnimal.status">
                                        <option value="active">Active</option>
                                        <option value="sold">Sold</option>
                                        <option value="deceased">Deceased</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="mother_id" class="form-label">Mother</label>
                                    <select class="form-select" id="mother_id" v-model="currentAnimal.mother_id">
                                        <option value="">None</option>
                                        <option v-for="animal in femaleAnimals" :key="animal.id" :value="animal.id">
                                            {{ animal.tag_id }} - {{ animal.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label for="father_id" class="form-label">Father</label>
                                    <select class="form-select" id="father_id" v-model="currentAnimal.father_id">
                                        <option value="">None</option>
                                        <option v-for="animal in maleAnimals" :key="animal.id" :value="animal.id">
                                            {{ animal.tag_id }} - {{ animal.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
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
                            <p>Are you sure you want to delete animal {{ animalToDelete.tag_id }}?</p>
                            <p class="text-danger">This action cannot be undone.</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
                            <button type="button" class="btn btn-danger" @click="deleteAnimal">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Modal Backdrop -->
            <div class="modal-backdrop fade show" v-if="showAddModal || showEditModal || showDeleteModal"></div>
        </div>
    `,
    data() {
        return {
            animals: [],
            breeds: [],
            searchQuery: '',
            filterBreed: '',
            filterStatus: '',
            sortKey: 'tag_id',
            sortDirection: 1,
            showAddModal: false,
            showEditModal: false,
            showDeleteModal: false,
            currentAnimal: {
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
            animalToDelete: {}
        };
    },
    computed: {
        filteredAnimals() {
            let result = this.animals;
            
            // Apply search filter
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(animal => 
                    animal.tag_id.toLowerCase().includes(query) || 
                    (animal.name && animal.name.toLowerCase().includes(query))
                );
            }
            
            // Apply breed filter
            if (this.filterBreed) {
                result = result.filter(animal => animal.breed_id == this.filterBreed);
            }
            
            // Apply status filter
            if (this.filterStatus) {
                result = result.filter(animal => animal.status === this.filterStatus);
            }
            
            // Apply sorting
            result = result.sort((a, b) => {
                let valueA = a[this.sortKey];
                let valueB = b[this.sortKey];
                
                if (typeof valueA === 'string') valueA = valueA.toLowerCase();
                if (typeof valueB === 'string') valueB = valueB.toLowerCase();
                
                if (valueA < valueB) return -1 * this.sortDirection;
                if (valueA > valueB) return 1 * this.sortDirection;
                return 0;
            });
            
            return result;
        },
        femaleAnimals() {
            return this.animals.filter(animal => animal.gender === 'female');
        },
        maleAnimals() {
            return this.animals.filter(animal => animal.gender === 'male');
        }
    },
    created() {
        this.fetchAnimals();
        this.fetchBreeds();
    },
    methods: {
        async fetchAnimals() {
            try {
                const response = await axios.get('/animals');
                this.animals = response.data;
            } catch (error) {
                console.error('Error fetching animals:', error);
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
        sortBy(key) {
            if (this.sortKey === key) {
                this.sortDirection *= -1;
            } else {
                this.sortKey = key;
                this.sortDirection = 1;
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
        editAnimal(animal) {
            this.currentAnimal = { ...animal };
            this.showEditModal = true;
        },
        confirmDelete(animal) {
            this.animalToDelete = animal;
            this.showDeleteModal = true;
        },
        closeModal() {
            this.showAddModal = false;
            this.showEditModal = false;
            this.currentAnimal = {
                tag_id: '',
                name: '',
                birth_date: '',
                breed_id: '',
                gender: '',
                weight: '',
                status: 'active',
                mother_id: '',
                father_id: ''
            };
        },
        async saveAnimal() {
            try {
                if (this.showEditModal) {
                    // Update existing animal
                    await axios.put(`/animals/${this.currentAnimal.id}`, this.currentAnimal);
                } else {
                    // Create new animal
                    await axios.post('/animals', this.currentAnimal);
                }
                
                this.closeModal();
                this.fetchAnimals();
            } catch (error) {
                console.error('Error saving animal:', error);
                alert('Error saving animal: ' + (error.response?.data?.error || error.message));
            }
        },
        async deleteAnimal() {
            try {
                await axios.delete(`/animals/${this.animalToDelete.id}`);
                this.showDeleteModal = false;
                this.fetchAnimals();
            } catch (error) {
                console.error('Error deleting animal:', error);
                alert('Error deleting animal: ' + (error.response?.data?.error || error.message));
            }
        }
    }
};

export default AnimalsList;