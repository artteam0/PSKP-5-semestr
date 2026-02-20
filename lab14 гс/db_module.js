const sql = require('mssql/msnodesqlv8');

const config = {
    connectionString:
        "Driver={ODBC Driver 17 for SQL Server};" +
        "Server=LENOVO-PC63;" +
        "Database=UNIVERCITY;" +
        "Trusted_Connection=yes;"
};

class DB {

    constructor() {
        this.poolPromise = new sql.ConnectionPool(coinfg)
            .connect()
            .then(pool => {
                console.log("Connected to database");
                return pool;
            })
            .catch(err => {
                console.error("Database connection failed:", err);
                throw err;
            });
    }

    execQuery = async (query, params = []) => {
        const pool = await this.poolPromise;
        const request = pool.request();

        params.forEach(p => {
            request.input(p.name, p.type, p.value);
        });

        return request.query(query);
    };

    //---------------- SELECT ----------------

    getFaculties = () =>
        this.execQuery("SELECT * FROM FACULTY");

    getPulpits = () =>
        this.execQuery("SELECT * FROM PULPIT");

    getSubjects = () =>
        this.execQuery("SELECT * FROM SUBJECT");

    getAuditoriumstypes = () =>
        this.execQuery("SELECT * FROM AUDITORIUM_TYPE");

    getAuditoriums = () =>
        this.execQuery("SELECT * FROM AUDITORIUM");


    //---------------- INSERT ----------------

    insertFaculty = (faculty, facultyName) =>
        this.execQuery(
            "INSERT INTO FACULTY VALUES (@faculty, @facultyName)",
            [
                { name: "faculty", type: sql.NVarChar, value: faculty },
                { name: "facultyName", type: sql.NVarChar, value: facultyName }
            ]
        );

    insertPulpit = (pulpit, pulpitName, faculty) =>
        this.execQuery(
            "INSERT INTO PULPIT VALUES (@pulpit, @pulpitName, @faculty)",
            [
                { name: "pulpit", type: sql.NVarChar, value: pulpit },
                { name: "pulpitName", type: sql.NVarChar, value: pulpitName },
                { name: "faculty", type: sql.NVarChar, value: faculty }
            ]
        );

    insertSubject = (subject, subjectName, pulpit) =>
        this.execQuery(
            "INSERT INTO SUBJECT VALUES (@subject, @subjectName, @pulpit)",
            [
                { name: "subject", type: sql.NVarChar, value: subject },
                { name: "subjectName", type: sql.NVarChar, value: subjectName },
                { name: "pulpit", type: sql.NVarChar, value: pulpit }
            ]
        );

    insertAuditoriumtype = (type, name) =>
        this.execQuery(
            "INSERT INTO AUDITORIUM_TYPE VALUES (@type, @name)",
            [
                { name: "type", type: sql.NVarChar, value: type },
                { name: "name", type: sql.NVarChar, value: name }
            ]
        );

    insertAuditorium = (auditorium, name, capacity, type) =>
        this.execQuery(
            "INSERT INTO AUDITORIUM VALUES (@auditorium, @type, @capacity, @name)",
            [
                { name: "auditorium", type: sql.NVarChar, value: auditorium },
                { name: "type", type: sql.NVarChar, value: type },
                { name: "capacity", type: sql.Int, value: capacity },
                { name: "name", type: sql.NVarChar, value: name }
            ]
        );


    //---------------- UPDATE ----------------

    updateFaculty = (faculty, facultyName) =>
        this.execQuery(
            "UPDATE FACULTY SET FACULTY_NAME = @facultyName WHERE FACULTY = @faculty",
            [
                { name: "faculty", type: sql.NVarChar, value: faculty },
                { name: "facultyName", type: sql.NVarChar, value: facultyName }
            ]
        );

    updatePulpit = (pulpit, name, faculty) =>
        this.execQuery(
            "UPDATE PULPIT SET PULPIT_NAME = @name, FACULTY = @faculty WHERE PULPIT = @pulpit",
            [
                { name: "pulpit", type: sql.NVarChar, value: pulpit },
                { name: "name", type: sql.NVarChar, value: name },
                { name: "faculty", type: sql.NVarChar, value: faculty }
            ]
        );

    updateSubject = (subject, name, pulpit) =>
        this.execQuery(
            "UPDATE SUBJECT SET SUBJECT_NAME = @name, PULPIT = @pulpit WHERE SUBJECT = @subject",
            [
                { name: "subject", type: sql.NVarChar, value: subject },
                { name: "name", type: sql.NVarChar, value: name },
                { name: "pulpit", type: sql.NVarChar, value: pulpit }
            ]
        );

    updateAuditoriumtype = (type, name) =>
        this.execQuery(
            "UPDATE AUDITORIUM_TYPE SET AUDITORIUM_TYPENAME = @name WHERE AUDITORIUM_TYPE = @type",
            [
                { name: "type", type: sql.NVarChar, value: type },
                { name: "name", type: sql.NVarChar, value: name }
            ]
        );

    updateAuditorium = (auditorium, name, capacity, type) =>
        this.execQuery(
            `UPDATE AUDITORIUM 
             SET AUDITORIUM_NAME = @name,
                 AUDITORIUM_CAPACITY = @capacity,
                 AUDITORIUM_TYPE = @type
             WHERE AUDITORIUM = @auditorium`,
            [
                { name: "auditorium", type: sql.NVarChar, value: auditorium },
                { name: "name", type: sql.NVarChar, value: name },
                { name: "capacity", type: sql.Int, value: capacity },
                { name: "type", type: sql.NVarChar, value: type }
            ]
        );


    //---------------- DELETE ----------------

    deleteFaculty = (faculty) =>
        this.execQuery(
            "DELETE FROM FACULTY WHERE FACULTY = @faculty",
            [{ name: "faculty", type: sql.NVarChar, value: faculty }]
        );

    deletePulpit = (pulpit) =>
        this.execQuery(
            "DELETE FROM PULPIT WHERE PULPIT = @pulpit",
            [{ name: "pulpit", type: sql.NVarChar, value: pulpit }]
        );

    deleteSubject = (subject) =>
        this.execQuery(
            "DELETE FROM SUBJECT WHERE SUBJECT = @subject",
            [{ name: "subject", type: sql.NVarChar, value: subject }]
        );

    deleteAuditoriumtype = (type) =>
        this.execQuery(
            "DELETE FROM AUDITORIUM_TYPE WHERE AUDITORIUM_TYPE = @type",
            [{ name: "type", type: sql.NVarChar, value: type }]
        );

    deleteAuditorium = (auditorium) =>
        this.execQuery(
            "DELETE FROM AUDITORIUM WHERE AUDITORIUM = @auditorium",
            [{ name: "auditorium", type: sql.NVarChar, value: auditorium }]
        );

}

module.exports = DB;