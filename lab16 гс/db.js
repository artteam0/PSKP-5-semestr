const { getPool } = require('./config.js');

class DB {
    constructor() {
    }

    async _execute(query) {
        let pool;
        try {
            pool = getPool();
            if (!pool) throw new Error('Database pool not initialized.');
            
            const result = await pool.request().query(query);
            return result.recordset;
        } catch (err) {
            console.error('MSSQL Error:', err.message);

            throw new Error(`Database Error: ${err.message}`); 
        }
    }

    async getFaculties({ faculty }) {
        let query = 'SELECT RTRIM(FACULTY) AS faculty, RTRIM(FACULTY_NAME) AS faculty_name FROM dbo.FACULTY';
        if (faculty) {
            query += ` WHERE RTRIM(FACULTY) = '${faculty}'`;
        }
        return this._execute(query);
    }

    async getPulpits({ pulpit }) {
        let query = `SELECT 
                        RTRIM(PULPIT) AS pulpit, 
                        RTRIM(PULPIT_NAME) AS pulpit_name, 
                        RTRIM(FACULTY) AS faculty 
                     FROM dbo.PULPIT`;
        if (pulpit) {
            query += ` WHERE RTRIM(PULPIT) = '${pulpit}'`;
        }
        return this._execute(query);
    }
    
    async getSubjects({ subject }) {
        let query = `SELECT 
                        RTRIM(SUBJECT) AS subject, 
                        RTRIM(SUBJECT_NAME) AS subject_name, 
                        RTRIM(PULPIT) AS pulpit 
                     FROM dbo.SUBJECT`;
        if (subject) {
            query += ` WHERE RTRIM(SUBJECT) = '${subject}'`;
        }
        return this._execute(query);
    }

    async getTeachers({ teacher }) {
        let query = `SELECT 
                        RTRIM(TEACHER) AS teacher, 
                        RTRIM(TEACHER_NAME) AS teacher_name, 
                        RTRIM(PULPIT) AS pulpit 
                     FROM dbo.TEACHER`;
        if (teacher) {
            query += ` WHERE RTRIM(TEACHER) = '${teacher}'`;
        }
        return this._execute(query);
    }
    
    async getTeachersByFaculty(facultyCode) {
        const query = `
            SELECT 
                RTRIM(t.TEACHER) AS teacher, 
                RTRIM(t.TEACHER_NAME) AS teacher_name, 
                RTRIM(t.PULPIT) AS pulpit 
            FROM dbo.TEACHER t
            JOIN dbo.PULPIT p ON t.PULPIT = p.PULPIT
            WHERE RTRIM(p.FACULTY) = '${facultyCode}'
        `;
        return this._execute(query);
    }

    async getSubjectsByFaculties(facultyCode) {
       
        const query = `SELECT 
                        RTRIM(PULPIT) AS pulpit, 
                        RTRIM(PULPIT_NAME) AS pulpit_name, 
                        RTRIM(FACULTY) AS faculty 
                      FROM dbo.PULPIT 
                      WHERE RTRIM(FACULTY) = '${facultyCode}'`;
        return this._execute(query);
    }


    async setFaculty(facultyInput) {
        const { faculty, faculty_name } = facultyInput;
        const existing = await this._execute(`SELECT FACULTY FROM dbo.FACULTY WHERE RTRIM(FACULTY) = '${faculty}'`); 
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.FACULTY SET FACULTY_NAME = N'${faculty_name}' WHERE RTRIM(FACULTY) = '${faculty}'`;
        } else {
            query = `INSERT INTO dbo.FACULTY (FACULTY, FACULTY_NAME) VALUES ('${faculty}', N'${faculty_name}')`;
        }
        
        await this._execute(query);
        return (await this.getFaculties({ faculty: faculty }))[0];
    }

    async setPulpit(pulpitInput) {
        const { pulpit, pulpit_name, faculty } = pulpitInput;
        const existing = await this._execute(`SELECT PULPIT FROM dbo.PULPIT WHERE RTRIM(PULPIT) = '${pulpit}'`);
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.PULPIT SET PULPIT_NAME = N'${pulpit_name}', FACULTY = '${faculty}' WHERE RTRIM(PULPIT) = '${pulpit}'`;
        } else {
            query = `INSERT INTO dbo.PULPIT (PULPIT, PULPIT_NAME, FACULTY) VALUES ('${pulpit}', N'${pulpit_name}', '${faculty}')`;
        }
        
        await this._execute(query);
        return (await this.getPulpits({ pulpit: pulpit }))[0];
    }

    async setSubject(subjectInput) {
        const { subject, subject_name, pulpit } = subjectInput;
        const existing = await this._execute(`SELECT SUBJECT FROM dbo.SUBJECT WHERE RTRIM(SUBJECT) = '${subject}'`);
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.SUBJECT SET SUBJECT_NAME = N'${subject_name}', PULPIT = '${pulpit}' WHERE RTRIM(SUBJECT) = '${subject}'`;
        } else {
            query = `INSERT INTO dbo.SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT) VALUES ('${subject}', N'${subject_name}', '${pulpit}')`;
        }
        
        await this._execute(query);
        return (await this.getSubjects({ subject: subject }))[0];
    }
    
    async setTeacher(teacherInput) {
        const { teacher, teacher_name, pulpit } = teacherInput;
        const existing = await this._execute(`SELECT TEACHER FROM dbo.TEACHER WHERE RTRIM(TEACHER) = '${teacher}'`);
        
        let query;
        if (existing.length > 0) {
            query = `UPDATE dbo.TEACHER SET TEACHER_NAME = N'${teacher_name}', PULPIT = '${pulpit}' WHERE RTRIM(TEACHER) = '${teacher}'`;
        } else {
            query = `INSERT INTO dbo.TEACHER (TEACHER, TEACHER_NAME, PULPIT) VALUES ('${teacher}', N'${teacher_name}', '${pulpit}')`;
        }
        
        await this._execute(query);
        return (await this.getTeachers({ teacher: teacher }))[0];
    }


    async delFaculty(facultyCode) {
        await this._execute(`DELETE FROM dbo.FACULTY WHERE RTRIM(FACULTY) = '${facultyCode}'`);
        return true;
    }

    async delPulpit(pulpitCode) {
        await this._execute(`DELETE FROM dbo.PULPIT WHERE RTRIM(PULPIT) = '${pulpitCode}'`);
        return true;
    }

    async delSubject(subjectCode) {
        await this._execute(`DELETE FROM dbo.SUBJECT WHERE RTRIM(SUBJECT) = '${subjectCode}'`);
        return true;
    }
    
    async delTeacher(teacherCode) {
        await this._execute(`DELETE FROM dbo.TEACHER WHERE RTRIM(TEACHER) = '${teacherCode}'`);
        return true;
    }
}

const database = new DB();

const resolver = {
    Query: {
        getFaculties: (parent, args) => database.getFaculties(args),
        getTeachers: (parent, args) => database.getTeachers(args),
        getPulpits: (parent, args) => database.getPulpits(args),
        getSubjects: (parent, args) => database.getSubjects(args),
        getTeachersByFaculty: (parent, { faculty }) => database.getTeachersByFaculty(faculty),
        getSubjectsByFaculties: (parent, { faculty }) => database.getSubjectsByFaculties(faculty),
    },

    Mutation: {
        setFaculty: (parent, { faculty }) => database.setFaculty(faculty),
        setPulpit: (parent, { pulpit }) => database.setPulpit(pulpit),
        setSubject: (parent, { subject }) => database.setSubject(subject),
        setTeacher: (parent, { teacher }) => database.setTeacher(teacher),
        delFaculty: (parent, { faculty }) => database.delFaculty(faculty),
        delPulpit: (parent, { pulpit }) => database.delPulpit(pulpit),
        delSubject: (parent, { subject }) => database.delSubject(subject),
        delTeacher: (parent, { teacher }) => database.delTeacher(teacher),
    },

    Faculty: {
        pulpits: (parent) => {
            const trimmedFaculty = parent.faculty.trim(); 
            return database._execute(`SELECT 
                                        RTRIM(PULPIT) AS pulpit, 
                                        RTRIM(PULPIT_NAME) AS pulpit_name, 
                                        RTRIM(FACULTY) AS faculty 
                                      FROM dbo.PULPIT 
                                      WHERE RTRIM(FACULTY) = '${trimmedFaculty}'`);
        }
    },
  
    Pulpit: {
        subjects: (parent) => {
            const trimmedPulpit = parent.pulpit.trim();
            return database._execute(`SELECT 
                                        RTRIM(SUBJECT) AS subject, 
                                        RTRIM(SUBJECT_NAME) AS subject_name, 
                                        RTRIM(PULPIT) AS pulpit 
                                      FROM dbo.SUBJECT 
                                      WHERE RTRIM(PULPIT) = '${trimmedPulpit}'`);
        }
    }
};

exports.database = database;
exports.resolver = resolver;