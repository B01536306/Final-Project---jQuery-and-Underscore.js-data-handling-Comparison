document.addEventListener('DOMContentLoaded', function () {
    var contacts = [];

    fetchContacts();

    document.getElementById('addContactBtn').addEventListener('click', function () {
        var newContact = {
            "name": document.getElementById('name').value,
            "email": document.getElementById('email').value
        };

        addContactLocally(newContact);
    });

    document.getElementById('contacts').addEventListener('click', function (event) {
        if (event.target.classList.contains('updateBtn')) {
            var contactId = event.target.dataset.id;
            var updatedName = prompt('Enter updated name:');
            var updatedEmail = prompt('Enter updated email:');
            updateContactLocally(contactId, updatedName, updatedEmail);
        } else if (event.target.classList.contains('deleteBtn')) {
            var contactId = event.target.dataset.id;
            deleteContactLocally(contactId);
        }
    });

    function fetchContacts() {
        console.log('Fetching contacts...');
        var startTime = performance.now();

        fetch('http://localhost:3000/api/contacts')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching data');
                }
                return response.json();
            })
            .then(data => {
                contacts = _.sortBy(data, 'id').reverse(); // Sort by id and then reverse to get the latest first
                displayContacts(contacts);
                var endTime = performance.now();
                console.log('Fetch contacts response time:', endTime - startTime, 'milliseconds');
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    function displayContacts(contacts) {
        var contactsContainer = document.getElementById('contacts');
        contactsContainer.innerHTML = '';

        _.each(contacts, function (contact) {
            var contactHtml = '<div class="contact">' +
                '<p><strong>Name:</strong> ' + contact.name + '</p>' +
                '<p><strong>Email:</strong> ' + contact.email + '</p>' +
                '<button class="updateBtn" data-id="' + contact.id + '">Update</button>' +
                '<button class="deleteBtn" data-id="' + contact.id + '">Delete</button>' +
                '</div>';
            contactsContainer.insertAdjacentHTML('beforeend', contactHtml);
        });

        // Clear input fields after displaying contacts
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
    }

    function addContactLocally(newContact) {
        console.log('Adding new contact...');
        var startTime = performance.now();

        fetch('http://localhost:3000/api/contacts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newContact)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error adding contact');
            }
            return response.json();
        })
        .then(data => {
            console.log("Data posted successfully:", data);
            fetchContacts();
            var endTime = performance.now();
            console.log('Add contact response time:', endTime - startTime, 'milliseconds');
        })
        .catch(error => console.error("Error posting data:", error));
    }

    function updateContactLocally(contactId, updatedName, updatedEmail) {
        console.log('Updating contact...');
        var startTime = performance.now();

        var contactToUpdate = _.find(contacts, { id: parseInt(contactId) }); // Ensure contactId is parsed as integer

        if (contactToUpdate) {
            console.log('Contact to update:', contactToUpdate);
            contactToUpdate.name = updatedName;
            contactToUpdate.email = updatedEmail;

            fetch('http://localhost:3000/api/contacts/' + contactId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: updatedName,
                    email: updatedEmail
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error updating contact');
                }
                return response.json();
            })
            .then(data => {
                console.log("Data updated successfully:", data);
                fetchContacts();
                var endTime = performance.now();
                console.log('Update contact response time:', endTime - startTime, 'milliseconds');
            })
            .catch(error => console.error("Error updating data:", error));
        }
    }

    function deleteContactLocally(contactId) {
        console.log('Deleting contact...');
        var startTime = performance.now();

        fetch('http://localhost:3000/api/contacts/' + contactId, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error deleting contact');
            }
            console.log("Data deleted successfully.");
            fetchContacts();
            var endTime = performance.now();
            console.log('Delete contact response time:', endTime - startTime, 'milliseconds');
        })
        .catch(error => console.error("Error deleting data:", error));
    }
});
