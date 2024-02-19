/**
 * @name AddressBook
 * @description JavaScript codes for handing all of the functionalities for webpage
 * @author Mahabub (@mahabubx7)
 */

// InMemory Storage (Not persisted) <Single Runtime only>
class Store {
    /**
     * @class Store
     * @param {object[]} data
     * @property {string} name
     * @property {string} surname
     * @property {string} phoneNumber
     * @property {string} address
     */
    constructor (data = [] /* default: empty data <object[]> */) {
        this.data = data; // (temporary) virtual storage 😁 <object[]>
    };

    makeId(len = 8) { /* returns string (ID) */
        // expecting 'len' is undefined or number (x >= 4 && x <= 16)
        return (Math.random() * 100).toString(32).slice(3, len + 2);
    };

    // get all available data
    get() { /* returns data as object[] */
        return this.data;
    };

    // search contacts
    search(target /* target value */, type = 'name' /* target field, default: name */ ) {
        // returns: object[] or null
        if (!['name', 'surname', 'phoneNumber', 'address'].includes(type)) {
            throw new Error('Error: Invalid field type!')
        }
        const regex = new RegExp('\\b' + target + '\\b', 'i');
        const contact = this.data.filter(item => regex.test(item[type]));
        if (!contact.length > 0) return null;
        return contact;
    };

    // add an item
    add(item) { /* returns void */
        this.data.push({
            id: this.makeId(), // making a unique id
            ...item, // spreading the itemObject into the insertion:object
        });
    };

    remove(id) {/* returns void */
        this.data = this.data.filter(item => item.id !== id);
    };
};

// making list dynamically & updating the DOM
function generateContacts(data /* expecting object[] from storage['data'] */) {
    let htmlString = '';
    for (const item of data) {
        htmlString += `
            <li class="contact">
                <h6>${item.name} ${item.surname}</h6>
                <p class="text-black-2 semi-bold">${item.phoneNumber}</p>
                <p class="text-black-2 semi-bold">${item.address}</p>
                <button class="btn btn-delete semi-bold" data-id="${item.id}">Delete</button>
            </li>
        `;
    };
    return htmlString; // HTML codes as string
};

// Immediately invoked function to load all necessary javascript codes
(function(){
    'use strict';
    // alert('JS working!')
    const storage = new Store(); // to handle the books (data) with store
    
    // add a contact
    $('#form').on('submit', function(event) {
        event.preventDefault();
        const name = $('#contactName').val();
        const surname = $('#contactSurname').val();
        const phoneNumber = $('#contactPhone').val();
        const address = $('#contactAddress').val();
        storage.add({ name, surname, phoneNumber, address }); // inserting
        // reset fields
        $('#contactName').val('');
        $('#contactSurname').val('');
        $('#contactPhone').val('');
        $('#contactAddress').val('');
        // generate updated contact list
        $('#contacts').html(generateContacts(storage.get()));
    });

    // delete a contact
    $('#contacts').on('click', '.btn-delete', function() {
        const id = $(this).data('id');
        storage.remove(id);
        $('#contacts').html(generateContacts(storage.get()));
    });

    // search a contact
    $('#search').on('click', '.btn-search', function() {
        const target = $('.input-search').val();
        const contact = storage.search(target);
        if (!contact) {
            alert('Contact not found!');
            return;
        }
        $('#contacts').html(generateContacts([...contact]));
        // reset search box
        $('.input-search').val('');
    });
})(jQuery);
