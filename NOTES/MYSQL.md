https://www.geeksforgeeks.org/sql/sql-cheat-sheet/

https://www.dbvis.com/wp-content/uploads/2024/04/SQL-Cheat-Sheet.pdf

https://www.geeksforgeeks.org/sql/sql-interview-questions/

https://skphd.medium.com/advanced-sql-interview-questions-and-answers-307a5333d02e
https://datavidhya.com/blog/sql-data-engineering-interview-questions/

# 11 june 2026

## indexing

Indexes are used to retrieve data from the database very fast.

CREATE INDEX idx_lastname
ON Persons (LastName);

CREATE INDEX idx_pname
ON Persons (LastName, FirstName);

ALTER TABLE table_name
DROP INDEX index_name;



# 5 july 2026
SHOW DATABASES;

SQL data types can be broadly divided into the following categories:

1. Numeric data types such as INT, TINYINT, BIGINT, FLOAT, REAL, etc.
2. Date and Time data types such as DATE, TIME, DATETIME, etc.
3. Character and String data types such as CHAR, VARCHAR, TEXT, etc.
4. Unicode character string data types such as NCHAR, NVARCHAR, NTEXT, etc.
5. Binary data types such as BINARY, VARBINARY, etc.
6. Miscellaneous data types such as CLOB, BLOB, XML, CURSOR, TABLE, etc.

# 6 july 2026

choosing between relational and non relational database:

| Situation             | SQL                  | NoSQL              |
| --------------------- | -------------------- | ------------------ |
| Fixed schema          | ✅                    | ❌                  |
| Flexible schema       | ❌                    | ✅                  |
| Complex relationships | ✅                    | ❌                  |
| JOINs                 | ✅                    | ❌                  |
| Transactions          | ✅                    | Limited/varies     |
| Analytics             | ✅                    | Limited            |
| Horizontal scaling    | Moderate             | Excellent          |
| Nested documents      | Possible but awkward | ✅                  |
| Rapid schema changes  | Difficult            | Easy               |
| Data consistency      | Strong               | Often configurable |

Choose SQL if:

Your data has many relationships.
You need transactions and strong consistency.
You expect to write reports or perform complex queries.
Your schema is relatively stable.

Choose NoSQL if:

Your data is document-like or semi-structured.
The schema changes frequently.
You need to scale horizontally for very large volumes of mostly independent data.
You rarely need joins across different records.


Atomicity, Consistency, Isolation, and Durability (ACID) compliance: ACID compliance refers to a set of properties that guarantee the reliability, consistency, and data integrity of database transactions



# SQL Joins
select * from patients left/right/inner/full join doctors where patients.doctor_id = doctors.id
cross join, self join. union
?? group by , having , any-all
select into, insert into select
comments -- /* */
<> not equal
backup database bsbprime to disk = 'D:\backups\bsbprime.bak'

drop table table_name;
drop database database_name;
truncate table table_name;
alter table table_name drop column column_name;

sql constraints
subquery
indexing

# 7 july 2026
Alter is Data defination language(DDL) for changing the table schema
and Update is Data manipulation language(DML) for changing the table data

alter add, modify column, drop column, rename column, add primary key, add foreign key, add constraint, drop constraint


- where is used before grouping or aggregation and having is used after grouping
## sub query

## normalization
Normalization organizes relational data to minimize redundancy and prevent update/insert/delete anomalies by splitting tables based on dependencies while preserving meaning.

https://www.datacamp.com/tutorial/normalization-in-sql
1NF: Each column contains atomic values, and there are no repeating groups.(no comma seperated values in column - instead use seperate table)
2NF: Meets 1NF and removes partial dependencies on a composite primary key. (


    
)
3NF: Meets 2NF and removes transitive dependencies.
BCNF: Every determinant must be a candidate key.
4NF: Removes multi-valued dependencies.
5NF (PJNF): Removes join dependencies to avoid data redundancy.


# 9 july 2026
DDL (Data Definition Language): CREATE, ALTER, DROP, TRUNCATE.
DML (Data Manipulation Language): SELECT, INSERT, UPDATE, DELETE.
DCL (Data Control Language): GRANT, REVOKE.
TCL (Transaction Control Language): COMMIT, ROLLBACK, SAVEPOINT.


Arithmetic Operators: +, -, *, /, %
Comparison Operators: =, !=, <>, >, <, >=, <=
Logical Operators: AND, OR, NOT
Set Operators: UNION, INTERSECT, EXCEPT
Special Operators: BETWEEN, IN, LIKE, IS NULL
Concatenation Operators:|| (Oracle, PostgreSQL) or + (SQL Server) to combine strings.


# 10 july 2026
mysql prepared statement.

# 14 july 2026
mysql ACID and functions

# 16 july 2026
common table expressions(CTE)

A Common Table Expression (CTE) is a temporary, named result set in SQL that you can reference within a single , , , or  statement. Think of it as a temporary virtual table or a named subquery that exists only for the duration of that specific query execution. [1, 2, 3, 4]  

| Feature | CTE | Subquery | Temporary Table  |
| --- | --- | --- | --- |
| Scope | Single query execution | Single inline execution | Full database session  |
| Reusability | Multiple times in the same query | Only where inline-defined | Across multiple separate queries  |
| Readability | High (Top-down execution flow) | Low (Nested, inside-out flow) | Medium (Requires explicit creation/cleanup)  |
| Indexing | No index support | No index support | Supports indexes and constraints  |
| Best For | Code clean-up and recursion | Simple  /  filters | Massive datasets requiring optimization  |


window function

offset == array index

((100*5 + 15*20)/115).toFixed(2)
round((100*5 + 15*20)/115 , 2)


# 21 july 2026
https://medium.com/learning-sql/sql-window-function-visualized-fff1927f00f2
https://dataschool.com/how-to-teach-people-sql/how-window-functions-work/ 
Window functions: (OVER, PARTISAN BY, ORDER BY)
sql window functions allow calc across set of rows that are related to current row.
window functions 2 types: aggregate and ranking.

common aggregate window functions:
SUM(): Sums values within a window.
AVG(): Calculates the average value within a window.
COUNT(): Counts the rows within a window.
MAX(): Returns the maximum value in the window.
MIN(): Returns the minimum value in the window.

common ranking window functions:
RANK(): Assigns ranks to rows, skipping ranks for duplicates.
DENSE_RANK(): Assigns ranks to rows without skipping rank numbers for duplicates.
ROW_NUMBER(): Assigns a unique number to each row in the result set.
PERCENT_RANK(): Shows the relative rank of a row as a percentage between 0 and 1.

Grouping: This defines the group that each row belongs to (PARTITION BY )
Order: This sort values within each group and make the window expands incrementally within each group ( ORDER BY)
Range: This is use to further define the window size, within each group ( ROWS or RANGE )

git for data - dolt

# 22 july 2026


WITH SequencedRows AS (
    SELECT *, 
           ROW_NUMBER() OVER (ORDER BY id) AS rn,
           COUNT(*) OVER () AS total_rows         -- Gets the total number of rows
    FROM Seat
)
SELECT 
       CASE 
           WHEN rn = total_rows AND rn % 2 <> 0 THEN rn  -- If it's the last row AND odd, do nothing
           WHEN rn % 2 <> 0 THEN rn + 1                  -- If odd (and not last), add 1
           ELSE rn - 1                                   -- If even, subtract 1
       END AS id, student
FROM SequencedRows
ORDER BY id;

# 23 july 2026
have to complete sql 50 leetcode anyhow

# 27 july 2026
sql pocket guide
dense_rank
read committed vs repeatable read

# 28 july 2026
Database Transaction: 
A transaction is a sequence of one or more SQL statements that are executed as a single unit of work. It ensures data integrity and consistency by making sure that either all operations are completed successfully or none are applied.
mysql:
START TRANSACTION;
--
COMMIT;
postgres:
BEGIN;
--
COMMIT;

# 30 july 2026

# Database for mere mortals
- Most problems that surface in a database fall into two categories: application utilization problems and data problems.
- Focus on the concept or technique being presented and its intended results, not on the example used to illustrate it.
- a database is an organized collection of data used for the purpose of modeling some type of orga-
nization or organizational process.
- The two types of databases in database management are operational
databases and analytical databases.
- operational database: dynamic data, online transaction processing oltp. real time data and constant changes
- operational database: static data, online analytical processing olap. historical data for analysis
- A relational database management system (RDBMS) is a software appli-
cation program you use to create, maintain, modify, and manipulate a relational database. (inclulde IBM DB2, IBM Informix, Microsoft Access, Microsoft SQL Server, MySQL, Oracle RDBMS, PostgreSQL, SAP SQL Anywhere, SAP Sybase ASE, and SQLite.)
- Normalization is the process of decomposing large tables into smaller
ones in order to eliminate redundant data and duplicate data and
avoid problems with inserting, updating, or deleting data.
- A normal form is a specific set of rules that can be used to
test a table structure to ensure that it is sound and free of problems.
There are a number of normal forms, and each one is used to test for
a particular set of problems. The normal forms currently in use are
First Normal Form, Second Normal Form, Third Normal Form, Fourth
Normal Form, Fifth Normal Form, Sixth Normal Form, Boyce-Codd
Normal Form, and Domain/Key Normal Form.
- Data is what you store; information is what you retrieve.
- an index has absolutely nothing to do with the logical database structure!
- keys are logical structures you use to identify records within a table, and indexes are physical structures you use to optimize data processing.
- relationships: one to one, one to many, many to many

| Join              | Returns                        |
| ----------------- | ------------------------------ |
| `INNER JOIN`      | Only matching rows             |
| `LEFT JOIN`       | All left rows + matching right |
| `RIGHT JOIN`      | All right rows + matching left |
| `FULL OUTER JOIN` | All rows from both tables      |
| `CROSS JOIN`      | Every possible combination     |
| `SELF JOIN`       | A table joined with itself     |

- Data integrity refers to the validity, consistency, and accuracy of the data in a database. I cannot overstate the fact that the level of accuracy of the information you retrieve from the database is in direct proportion to the level of data integrity you impose upon the database.

- table types: data table, linking table, subset table, validation table
- Your goal as the database architect is to make certain that it has only an absolute minimum amount of redundant data.
- 

adding foreign key
ALTER TABLE `employees` ADD CONSTRAINT `foreign_res_id_responsibilities` FOREIGN KEY (`res_id`) REFERENCES `responsibilities`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

CREATE TABLE `sql_practice`.`employees` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(190) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `res_id` INT UNSIGNED NOT NULL,

    PRIMARY KEY (`id`),
    UNIQUE KEY `email_unique` (`email`),

    CONSTRAINT `fk_employee_resource`
        FOREIGN KEY (`res_id`)
        REFERENCES `resources`(`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

- keys: candidate, primary, foreign and non-keys
- Seniority is not a rank. It is the accumulated memory of every way you have personally made a mess.
- The scary moment is not when a senior person cannot find the bug. It is the first time they look straight at it and feel nothing
