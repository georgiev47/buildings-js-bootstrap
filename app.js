class Building {
    constructor(id, name, area, location, image) {
        this.id = id;
        this.name = name;
        this.area = area;
        this.location = location;
        this.image = image;
    }
}

// UI class to contain all functions
class UI {
    static displayBuildings() {
        const buildings = Store.getBuildings();

        buildings.forEach((building) => UI.addBuildingToList(building));
    }

    static addBuildingToList(building) {
        const list = document.getElementById('building-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${building.id}</td>
            <td>${building.name}</td>
            <td>${building.area}</td>
            <td>${building.location}</td>
            <td><img src="/img/${building.image}.jpg" alt="${building.image}" height="120px"></td>
            <td>
                <a href="#" class="btn btn-danger btn-sm delete"><i class="fas fa-trash-alt"></i></a>
                <a href="#" class="btn btn-info btn-sm update">Update</a>
            </td>
        `;

        list.appendChild(row);
    }

    static deleteBuilding(build) {
        if(build.classList.contains('delete')) {
            build.parentElement.parentElement.remove();
        }
        if(build.parentElement.classList.contains('delete')) {
            build.parentElement.parentElement.parentElement.remove();
        }
    }

    static setBuildingForUpdate(build) {
        document.querySelector('#id').value = build.parentElement.parentElement.querySelector('td:nth-child(1)').textContent;
        document.querySelector('#name').value = build.parentElement.parentElement.querySelector('td:nth-child(2)').textContent;
        document.querySelector('#area').value = build.parentElement.parentElement.querySelector('td:nth-child(3)').textContent;
        document.querySelector('#location').value = build.parentElement.parentElement.querySelector('td:nth-child(4)').textContent;
        document.querySelector('#image').value = build.parentElement.parentElement.querySelector('td:nth-child(5)').getElementsByTagName('img')[0].getAttribute('alt');
    
        document.querySelector('#id').disabled = true;
        document.querySelector('#add-btn').classList.add('d-none');
        document.querySelector('#update-btn').classList.remove('d-none');
    }

    static updateBuilding(build) {
        build.name = document.querySelector('#name').value;
        build.area = document.querySelector('#area').value;
        build.location = document.querySelector('#location').value;
        build.image = document.querySelector('#image').value;

        const list = document.getElementById('building-list');
        const rows = list.children;
        const rowToUpdate = [...rows].filter(item => item.firstElementChild.textContent === build.id);
        
        rowToUpdate[0].children[1].textContent = build.name;
        rowToUpdate[0].children[2].textContent = build.area;
        rowToUpdate[0].children[3].textContent = build.location;
        rowToUpdate[0].children[4].innerHTML = `<img src="/img/${build.image}.jpg" alt="${build.image}" height="120px">`;

        document.querySelector('#id').disabled = false;
        document.querySelector('#add-btn').classList.remove('d-none');
        document.querySelector('#update-btn').classList.add('d-none');
    }

    static showAlert(text, type) {
        const div = document.createElement('div');
        div.className = `alert alert-${type}`;
        div.appendChild(document.createTextNode(text));

        const container = document.querySelector('.container');
        const form = document.querySelector('#building-form');
        container.insertBefore(div, form);

        // Remove alert after 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    static clearFields() {
        document.querySelector('#id').value = '';
        document.querySelector('#name').value = '';
        document.querySelector('#area').value = '';
        document.querySelector('#location').value = '';
        document.querySelector('#image').value = '';
    }
}

// Store class for Storage
class Store {
    static getBuildings() {
        let buildings;
        if(localStorage.getItem('buildings') === null) {
            buildings = [];
        } else {
            buildings = JSON.parse(localStorage.getItem('buildings'));
        }

        return buildings;
    }

    static addBuilding(build) {
        const buildings = Store.getBuildings();

        buildings.push(build);

        localStorage.setItem('buildings', JSON.stringify(buildings));
    }

    static removeBuilding(id) {
        const buildings = Store.getBuildings();

        buildings.forEach((build, index) => {
            if(build.id === id) {
                buildings.splice(index, 1);
            }
        });

        localStorage.setItem('buildings', JSON.stringify(buildings));
    }

    static updateBuilding(build) {
        const buildings = Store.getBuildings();
        
        buildings.forEach((building) => {
            if(building.id === build.id) {
                building.name = build.name;
                building.area = build.area;
                building.location = build.location;
                building.image = build.image;
            }
        });

        localStorage.setItem('buildings', JSON.stringify(buildings));
    }
}

// Display Buildings Event
document.addEventListener('DOMContentLoaded', UI.displayBuildings);

// Add Building Event
document.querySelector('#building-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.querySelector('#id').value;
    const name = document.querySelector('#name').value;
    const area = document.querySelector('#area').value;
    const location = document.querySelector('#location').value;
    const image = document.querySelector('#image').value;

    // Validations
    if(id === '' || name === '' || area === '') {
        UI.showAlert('Please enter values in all fields','danger');
    } else {
        const building = new Building(id, name, area, location, image);
        
        const addBtn = document.querySelector('#add-btn');

        if(!addBtn.classList.contains('d-none')) {
            // Add building to UI
            UI.addBuildingToList(building);

            // Add building to Store
            Store.addBuilding(building);

            // Show success message
            UI.showAlert('Building Added', 'success');

            // Clear fields
            UI.clearFields();
        } else {
            
            // Update building to UI
            UI.updateBuilding(building);

            // Update building to Store
            Store.updateBuilding(building);

            // Show success message
            UI.showAlert('Building Updated', 'success');

            // Clear fields
            UI.clearFields();
        }
    }
});

// Remove Building Event
document.querySelector('#building-list').addEventListener('click', (e) => {
    let target = e.target;
    if(target.classList.contains('fa-trash-alt')) {
        target = e.target.parentElement;
    }
    
    if(target.classList.contains('delete')) {
        UI.deleteBuilding(target);

        Store.removeBuilding(target.parentElement.parentElement.firstElementChild.textContent);

        UI.showAlert('Building Removed', 'success');
    }
});

// Update Building Event
document.querySelector('#building-list').addEventListener('click', (e) => {
    if(e.target.classList.contains('update')) {
        UI.setBuildingForUpdate(e.target);

        UI.showAlert('Building ready to be updated', 'success');
    }
});