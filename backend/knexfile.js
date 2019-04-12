module.exports = {
    client: 'mysql',
    connection: {
        database: 'tasks',
        user: 'root',
        password: '',
    },
    migrations: {
        tableName: 'knex_migrations'
    }
}