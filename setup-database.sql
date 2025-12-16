-- ================================================
-- Setup Database untuk Express.js + MSSQL
-- SQL Server 2025 Developer Edition
-- ================================================

-- 1. Buat Database
CREATE DATABASE EmployeeDB;
GO

-- 2. Gunakan Database
USE EmployeeDB;
GO

-- 3. Buat Tabel Departments
CREATE TABLE Departments (
    DepartmentID INT PRIMARY KEY IDENTITY(1,1),
    DepartmentName NVARCHAR(100) NOT NULL
);
GO

-- 4. Buat Tabel Employees
CREATE TABLE Employees (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    position NVARCHAR(100),
    salary INT,
    DepartmentID INT,
    FOREIGN KEY (DepartmentID) REFERENCES Departments(DepartmentID)
);
GO

-- 5. Insert Sample Data - Departments
INSERT INTO Departments (DepartmentName) VALUES 
    ('Information Technology'),
    ('Human Resources'),
    ('Finance'),
    ('Marketing'),
    ('Operations');
GO

-- 6. Insert Sample Data - Employees
INSERT INTO Employees (name, position, salary, DepartmentID) VALUES 
    ('John Doe', 'Senior Developer', 75000, 1),
    ('Jane Smith', 'HR Manager', 65000, 2),
    ('Bob Johnson', 'Financial Analyst', 60000, 3),
    ('Alice Williams', 'Marketing Specialist', 55000, 4),
    ('Charlie Brown', 'Operations Manager', 70000, 5),
    ('Diana Prince', 'Junior Developer', 45000, 1),
    ('Bruce Wayne', 'Recruiter', 50000, 2),
    ('Clark Kent', 'Accountant', 58000, 3);
GO

-- 7. Verifikasi Data
SELECT 'Departments' AS TableName, COUNT(*) AS RecordCount FROM Departments
UNION ALL
SELECT 'Employees', COUNT(*) FROM Employees;
GO

-- 8. Test Query
SELECT 
    e.id,
    e.name,
    e.position,
    e.salary,
    d.DepartmentName
FROM Employees e
JOIN Departments d ON e.DepartmentID = d.DepartmentID
ORDER BY e.id;
GO

PRINT '✅ Database setup completed successfully!';
PRINT 'Database Name: EmployeeDB';
PRINT 'Update your .env file with: DB_NAME=EmployeeDB';
