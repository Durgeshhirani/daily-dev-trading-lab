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
Window functions
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