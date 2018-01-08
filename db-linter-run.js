require('db-linter').run({
	//sql flavor
	lang: 'postgres',//or mysql
	//db creds
	host: '127.0.0.1',
	port: 5432,
	user: '',//note this user will need access to information_schema
	password: '',
	database:'test',
	//module settings
	path:'./readme.md',//where to look for a file with 2 <!--DB-LINTER--> tags between which to place generated markdown
	rules:'all',//or array of rule name strings from readme
	boolPrefixes:['is','allow'],
	isObviousColumn:(columnName,tableName,db)=>{
		//custom reasons a column does not need describing in your setup
		//maybe columns that are everywhere, like created_at?
		return false
	}
})