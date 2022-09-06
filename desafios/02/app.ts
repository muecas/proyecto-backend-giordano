import Container from "./services/Container/Container";

// Initializes the container
const container: Container = new Container('./data.json');

// CLI arguments
const args: Array<any> = process.argv.slice(2);

// Switch first argument passed
switch(args[0]) {
	
	// Creation mode
	case 'create':
		
		// No id supplied
		if(!args[1] || !args[2] || !args[3]) {
			console.log('No title, price or thumbnail supplied. Try adding the title, price and thumbnail url: node app.js crate <String> <Number> <String>');
			process.exit(0);
		}
		
		// Saves some new records and logs the saved ids
		container.save({ title : args[1], price : Number(args[2]), thumbnail : args[3] }).then(console.log);
		
		break;
		
	// Get record by id
	case 'id':
		
		// No id supplied
		if(!args[1]) {
			console.log('No id supplied. Try adding the id as the last parameter: node app.js id <Number>');
			process.exit(0);
		}
		
		// Gets a record by id
		container.getById(Number(args[1])).then(console.log);
		
		break;
		
	// Delete record by id
	case 'delete':
		
		// No id supplied
		if(!args[1]) {
			console.log('No id supplied. Try adding the id as the last parameter: node app.js id <Number>');
			process.exit(0);
		}
		
		// Delete a record by id
		container.deleteById(Number(args[1])).then(console.log);
		
		break;
		
	// Delete all records
	case 'clear':
		
		// Delete all records
		container.deleteAll().then(console.log);
		
		break;
		
	// Get all records
	case 'list':
	default:
		
		// Gets all records
		container.getAll().then(console.log);
		
		break;
	
}