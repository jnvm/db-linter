const {extractDbSchema,run} = require('./db-linter.js')
extractDbSchema({
    //sql flavor
    lang: 'postgres',//or 'mysql' (if using mariadb, say 'mysql')
    host: '127.0.0.1',
    //port: 5432,//optional
    user: 'postgres',//note this user will need access to information_schema
    password: '',
    database:'test',
})
.then(db=>{
    //or write your own convention checks once you have db
    return run(db,{
        path:'./readme.md',//where it should look for a markdown file
            //with 2 <!--DB-LINTER--> tags between which
            //to place generated markdown
        rules:'all',//or array of rule name strings from readme
        //rule options
        boolPrefixes:['is','allow'],
        isObviousColumn:(columnName,tableName,db)=>{
            //custom reasons a column does not need describing in your setup
            //maybe columns that are everywhere, like created_at?
            return false
        }
    })
})
.then( passedConventionCheck =>
    process.exit(passedConventionCheck ? 0 : 1)//or however you want to handle success / failure
)