/**
 * User class
 * @class User
 */

class User {
	
	/**
	 * User first name
	 * @type {string}
	 */
	
	first_name = '';
	
	/**
	 * User last name
	 * @type {string}
	 */
	last_name = '';
	
	/**
	 * Books array
	 * @type {[]}
	 */
	
	books = [];
	
	/**
	 * Pets array
	 * @type {[]}
	 */
	
	pets = [];
	
	/**
	 * Class constructor
	 * @param {String} first_name
	 * @param {String} last_name
	 * @param {[]}     books
	 * @param {[]}     pets
	 */
	
	constructor(first_name, last_name, books, pets) {
		this.first_name = first_name;
		this.last_name  = last_name;
		this.books      = books;
		this.pets       = pets;
	}
	
	/**
	 * Gets the user full name
	 * @return {string}
	 */
	
	getFullName() {
		return `${this.first_name} ${this.last_name}`;
	}
	
	/**
	 * Adds a pet to the pets array
	 * @param {String} pet
	 */
	
	addPet(pet) {
		this.pets.push(pet);
	}
	
	/**
	 * Gets the pets count
	 * @return {number}
	 */
	
	countPets() {
		return this.pets.length;
	}
	
	/**
	 * Adds a book to the books array
	 * @param {Object} book
	 */
	
	addBook(book) {
		this.books.push(book);
	}
	
	/**
	 * Gets all the books names
	 * @return {*[]}
	 */
	
	getBooksNames() {
		return this.books.map(book => book.name);
	}

}

const user = new User(
	'John',
	'Doe',
	[{ name : '1984', author : 'George Orwell' }],
	['Perro']
);

user.addPet('Gato');
user.addBook({ name : 'La Doctrina del Shock', author : 'Naomi Klein' });

['getFullName', 'countPets', 'getBooksNames'].forEach(method => console.log(`${method} returned`, user[method]()));