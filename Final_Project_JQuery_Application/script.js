document.addEventListener('DOMContentLoaded', function () {
    // Array to store contacts locally on the client side
    var contacts = [];

    // Fetch data from server on page load
    fetchContacts();

    // Create (Add) Contact
    document.getElementById('addContactBtn').addEventListener('click', function () {
        var newContact = {
            "name": document.getElementById('name').value,
            "email": document.getElementById('email').value
        };

        // Measure response time for adding a contact
        var startTime = performance.now();

        // Add the new contact locally (Client-Side)
        addContactLocally(newContact);

        // Refresh the contacts after a successful add
        fetchContacts();

        // Calculate and log the response time for adding a contact
        var endTime = performance.now();
        console.log('Add contact response time:', endTime - startTime, 'milliseconds');
    });

    // Read Contacts (fetch from server)
    function fetchContacts() {
        // Measure response time for fetching contacts
        var startTime = performance.now();

        // Load data from contacts.json during page load
        $.ajax({
            type: "GET",
            url: "http://localhost:3001/api/contacts",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                // Store the data in the local array
                contacts = data;
                // Reverse the order of contacts
                contacts.reverse();

                // Display the contacts
                displayContacts(contacts);

                // Calculate and log the response time for fetching contacts
                var endTime = performance.now();
                console.log('Fetch contacts response time:', endTime - startTime, 'milliseconds');
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    // Event Delegation for Update and Delete (Client-Side)
    document.getElementById('contacts').addEventListener('click', function (event) {
        if (event.target.classList.contains('updateBtn')) {
            var contactId = event.target.dataset.id;
            var updatedName = prompt('Enter updated name:');
            var updatedEmail = prompt('Enter updated email:');

            // Measure response time for updating a contact
            var startTime = performance.now();

            // Update the contact locally (Client-Side)
            updateContactLocally(contactId, updatedName, updatedEmail);

            // Refresh the contacts after a successful update
            fetchContacts();

            // Calculate and log the response time for updating a contact
            var endTime = performance.now();
            console.log('Update contact response time:', endTime - startTime, 'milliseconds');
        } else if (event.target.classList.contains('deleteBtn')) {
            var contactId = event.target.dataset.id;

            // Measure response time for deleting a contact
            var startTime = performance.now();

            // Delete the contact locally (Client-Side)
            deleteContactLocally(contactId);

            // Refresh the contacts after a successful delete
            fetchContacts();

            // Calculate and log the response time for deleting a contact
            var endTime = performance.now();
            console.log('Delete contact response time:', endTime - startTime, 'milliseconds');
        }
    });

    function displayContacts(contacts) {
        var contactsContainer = document.getElementById('contacts');
        contactsContainer.innerHTML = '';

        $.each(contacts, function (index, contact) {
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

    // Client-Side Add Function
    function addContactLocally(newContact) {
        // Generate a unique ID (for simplicity, you can use other methods to ensure uniqueness)
        newContact.id = contacts.length + 1;

        // Add the new contact to the local array
        contacts.push(newContact);

        // Measure response time for adding a contact locally
        var startTime = performance.now();

        // Send the new contact data to the server
        $.ajax({
            type: "POST",
            url: "http://localhost:3001/api/contacts",
            data: JSON.stringify(newContact),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log("Data posted successfully:", data);
            },
            error: function (error) {
                console.error("Error posting data:", error);
            }
        });

        // Calculate and log the response time for adding a contact locally
        var endTime = performance.now();
        console.log('Add contact locally response time:', endTime - startTime, 'milliseconds');
    }

    // Client-Side Update Function
    function updateContactLocally(contactId, updatedName, updatedEmail) {
        // Measure response time for updating a contact locally
        var startTime = performance.now();

        // Find the contact in the local array and update its properties
        var contactToUpdate = contacts.find(contact => contact.id == contactId);

        if (contactToUpdate) {
            contactToUpdate.name = updatedName;
            contactToUpdate.email = updatedEmail;

            // Send the updated contact data to the server
            $.ajax({
                type: "PUT", // Use PUT for update
                url: "http://localhost:3001/api/contacts/" + contactId,
                data: JSON.stringify(contactToUpdate),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log("Data updated successfully:", data);
                },
                error: function (error) {
                    console.error("Error updating data:", error);
                }
            });
        }

        // Calculate and log the response time for updating a contact locally
        var endTime = performance.now();
        console.log('Update contact locally response time:', endTime - startTime, 'milliseconds');
    }

    // Client-Side Delete Function
    function deleteContactLocally(contactId) {
        // Measure response time for deleting a contact locally
        var startTime = performance.now();

        // Find the index of the contact in the local array and remove it
        var index = contacts.findIndex(contact => contact.id == contactId);

        if (index !== -1) {
            var deletedContact = contacts.splice(index, 1)[0];

            // Send the deleted contact data to the server
            $.ajax({
                type: "DELETE",
                url: "http://localhost:3001/api/contacts/" + contactId,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) {
                    console.log("Data deleted successfully:", data);
                },
                error: function (error) {
                    console.error("Error deleting data:", error);
                }
            });
        }

        // Calculate and log the response time for deleting a contact locally
        var endTime = performance.now();
        console.log('Delete contact locally response time:', endTime - startTime, 'milliseconds');
    }
});
