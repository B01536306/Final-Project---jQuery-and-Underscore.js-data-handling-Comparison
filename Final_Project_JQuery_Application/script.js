document.addEventListener('DOMContentLoaded', function () {
    var contacts = [];

    fetchContacts();

    document.getElementById('addContactBtn').addEventListener('click', function () {
        var newContact = {
            "name": document.getElementById('name').value,
            "email": document.getElementById('email').value
        };
        var startTime = performance.now();
        addContactLocally(newContact);
        fetchContacts();
        var endTime = performance.now();
        console.log('Add contact response time:', endTime - startTime, 'milliseconds');
    });

    // Read Contacts (fetch from server)
    function fetchContacts() {
        var startTime = performance.now();
        $.ajax({
            type: "GET",
            url: "http://localhost:3001/api/contacts",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                contacts = data;
                contacts.reverse();
                displayContacts(contacts);
                var endTime = performance.now();
                console.log('Fetch contacts response time:', endTime - startTime, 'milliseconds');
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    }

    document.getElementById('contacts').addEventListener('click', function (event) {
        if (event.target.classList.contains('updateBtn')) {
            var contactId = event.target.dataset.id;
            var updatedName = prompt('Enter updated name:');
            var updatedEmail = prompt('Enter updated email:');

            var startTime = performance.now();
            updateContactLocally(contactId, updatedName, updatedEmail);
            fetchContacts();
            var endTime = performance.now();
            console.log('Update contact response time:', endTime - startTime, 'milliseconds');
        } else if (event.target.classList.contains('deleteBtn')) {
            var contactId = event.target.dataset.id;
            var startTime = performance.now();
            deleteContactLocally(contactId);
            fetchContacts();
            var endTime = performance.now();
            console.log('Delete contact response time:', endTime - startTime, 'milliseconds');
        }
    });

    // Display Contacts
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
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
    }

    // Add Contact Function
    function addContactLocally(newContact) {
        newContact.id = contacts.length + 1;
        contacts.push(newContact);
        var startTime = performance.now();
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

        var endTime = performance.now();
        console.log('Add contact locally response time:', endTime - startTime, 'milliseconds');
    }

    // Update Function
    function updateContactLocally(contactId, updatedName, updatedEmail) {
        var startTime = performance.now();
        var contactToUpdate = contacts.find(contact => contact.id == contactId);

        if (contactToUpdate) {
            contactToUpdate.name = updatedName;
            contactToUpdate.email = updatedEmail;

            $.ajax({
                type: "PUT", 
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

        var endTime = performance.now();
        console.log('Update contact locally response time:', endTime - startTime, 'milliseconds');
    }

    // Delete Function
    function deleteContactLocally(contactId) {
        var startTime = performance.now();
        var index = contacts.findIndex(contact => contact.id == contactId);

        if (index !== -1) {
            var deletedContact = contacts.splice(index, 1)[0];
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

        var endTime = performance.now();
        console.log('Delete contact locally response time:', endTime - startTime, 'milliseconds');
    }
});
