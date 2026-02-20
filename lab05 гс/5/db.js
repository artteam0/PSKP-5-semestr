var util = require('util');
var ee = require('events');

var db_data = [
    {id: 1, name: 'Иванов И.И.', bday:'2001-01-01'},
    {id: 2, name: 'Петров П.П.', bday:'2001-01-02'},
    {id: 3, name: 'Сидоров С.С.', bday:'2001-01-03'}
];

function DB(){
    this.get = () => {return db_data;};
    this.post = (r) => {db_data.push(r);};
    this.put = (r) => {
        const index = db_data.findIndex(item => item.id == r.id);
        if (index !== -1){
            db_data[index] = r;
            return r;
        }
        return null;
    };
    this.delete = (id) => {
        const index = db_data.findIndex(item => item.id == id);
        if (index !== -1) {
            const deletedItem = db_data.splice(index, 1);
            return deletedItem[0];
        }
        return null;
    }
    this.commit = () => {
    console.log('DB.COMMIT');
    this.emit('COMMIT');
    };
}

util.inherits(DB, ee.EventEmitter);

exports.DB = DB;