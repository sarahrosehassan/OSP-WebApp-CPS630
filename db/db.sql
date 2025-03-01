-- Drop existing tables if they exist (to prevent conflicts)
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Delivery;
DROP TABLE IF EXISTS Inventory;
DROP TABLE IF EXISTS Credit_Card_Info;
DROP TABLE IF EXISTS Payment_Table;
DROP TABLE IF EXISTS Shopping_Table;
DROP TABLE IF EXISTS Truck_Table;
DROP TABLE IF EXISTS Trip_Table;
DROP TABLE IF EXISTS Order_Table;
DROP TABLE IF EXISTS User_Table;
DROP TABLE IF EXISTS Item_Table;
DROP TABLE IF EXISTS Admins;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE User_Table (
    User_Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Tel_No VARCHAR(20) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Address TEXT NOT NULL,
    City_Code VARCHAR(50),
    Login_Id VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Balance DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE Item_Table (
    Item_Id INT AUTO_INCREMENT PRIMARY KEY,
    Item_Name VARCHAR(255) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Made_In VARCHAR(100),
    Department_Code VARCHAR(50)
);

CREATE TABLE Shopping_Table (
    Receipt_Id INT AUTO_INCREMENT PRIMARY KEY,
    Store_Code VARCHAR(50),
    Total_Price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Truck_Table (
    Truck_Id INT AUTO_INCREMENT PRIMARY KEY,
    Truck_Code VARCHAR(50) UNIQUE NOT NULL,
    Availability_Code VARCHAR(50) NOT NULL
);

CREATE TABLE Trip_Table (
    Trip_Id INT AUTO_INCREMENT PRIMARY KEY,
    Source_Code VARCHAR(50),
    Destination_Code VARCHAR(50),
    Distance_KM DECIMAL(10,2),
    Truck_Id INT NOT NULL,
    Price DECIMAL(10,2),
    FOREIGN KEY (Truck_Id) REFERENCES Truck_Table(Truck_Id) ON DELETE CASCADE
);

CREATE TABLE Order_Table (
    Order_Id INT AUTO_INCREMENT PRIMARY KEY,
    Date_Issued DATETIME NOT NULL,
    Date_Received DATETIME,
    Total_Price DECIMAL(10,2) NOT NULL,
    Payment_Code VARCHAR(50),
    User_Id INT NOT NULL,
    Trip_Id INT NOT NULL,
    Receipt_Id INT NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id) ON DELETE CASCADE,
    FOREIGN KEY (Trip_Id) REFERENCES Trip_Table(Trip_Id) ON DELETE CASCADE,
    FOREIGN KEY (Receipt_Id) REFERENCES Shopping_Table(Receipt_Id) ON DELETE CASCADE
);

CREATE TABLE Payment_Table (
    Payment_Code VARCHAR(50) PRIMARY KEY,
    Payment_Type VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Transaction_Id VARCHAR(50) UNIQUE,
    Amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE Credit_Card_Info (
    Card_Id INT AUTO_INCREMENT PRIMARY KEY,
    User_Id INT NOT NULL,
    Card_Holder_Name VARCHAR(255) NOT NULL,
    Card_Number VARCHAR(16) NOT NULL,
    Expiry_Date DATE NOT NULL,
    CVV VARCHAR(4) NOT NULL,
    Billing_Address TEXT NOT NULL,
    Card_Type ENUM('Visa', 'MasterCard', 'Amex', 'Discover', 'Other') NOT NULL,
    Is_Default BOOLEAN DEFAULT FALSE,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id) ON DELETE CASCADE
);

CREATE TABLE Order_Items (
    Order_Item_Id INT AUTO_INCREMENT PRIMARY KEY,
    Order_Id INT NOT NULL,
    Item_Id INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Order_Id) REFERENCES Order_Table(Order_Id) ON DELETE CASCADE,
    FOREIGN KEY (Item_Id) REFERENCES Item_Table(Item_Id) ON DELETE CASCADE
);

CREATE TABLE Inventory (
    Inventory_Id INT AUTO_INCREMENT PRIMARY KEY,
    Item_Id INT NOT NULL,
    Warehouse_Id INT NOT NULL,
    Stock_Quantity INT NOT NULL CHECK (Stock_Quantity >= 0),
    FOREIGN KEY (Item_Id) REFERENCES Item_Table(Item_Id) ON DELETE CASCADE
);

CREATE TABLE Delivery (
    Delivery_Id INT AUTO_INCREMENT PRIMARY KEY,
    Order_Id INT NOT NULL,
    Truck_Id INT NOT NULL,
    Estimated_Delivery DATETIME NOT NULL,
    Delivery_Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (Order_Id) REFERENCES Order_Table(Order_Id) ON DELETE CASCADE,
    FOREIGN KEY (Truck_Id) REFERENCES Truck_Table(Truck_Id) ON DELETE CASCADE
);

CREATE TABLE Admins (
    Admin_Id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

-- Insert Sample Data into Tables
INSERT INTO User_Table (Name, Tel_No, Email, Address, City_Code, Login_Id, Password, Balance) VALUES
('John Doe', '123-456-7890', 'johndoe@email.com', '123 Main St, NY', 'NYC001', 'johndoe', 'password123', 500.00),
('Jane Smith', '987-654-3210', 'janesmith@email.com', '456 Elm St, LA', 'LA002', 'janesmith', 'securepass456', 750.00);

INSERT INTO Truck_Table (Truck_Code, Availability_Code) VALUES
('TRK1001', 'Available'),
('TRK1002', 'Unavailable');

INSERT INTO Trip_Table (Source_Code, Destination_Code, Distance_KM, Truck_Id, Price) VALUES
('NYC', 'LA', 4500.00, 1, 200.00),
('LA', 'SF', 600.00, 2, 50.00);

INSERT INTO Shopping_Table (Store_Code, Total_Price) VALUES
('ST001', 1200.00),
('ST002', 950.00);

INSERT INTO Payment_Table (Payment_Code, Payment_Type, Status, Transaction_Id, Amount) VALUES
('PAY001', 'Credit Card', 'Completed', 'TXN1001', 1200.00),
('PAY002', 'PayPal', 'Completed', 'TXN1002', 950.00);

INSERT INTO Order_Table (Date_Issued, Date_Received, Total_Price, Payment_Code, User_Id, Trip_Id, Receipt_Id) VALUES
('2025-02-15 10:00:00', '2025-02-17 14:00:00', 1500.00, 'PAY001', 1, 1, 1),
('2025-02-16 11:30:00', '2025-02-18 16:00:00', 1800.00, 'PAY002', 2, 2, 2);

INSERT INTO Item_Table (Item_Id, Item_Name, Price, Made_In, Department_Code)
VALUES
(1, 'High Heels', 120.00, 'Italy', 'D001'),
(2, 'Sneakers', 80.00, 'USA', 'D002'),
(3, 'Leather Handbag', 250.00, 'France', 'D003'),
(4, 'Tote Bag', 180.00, 'Spain', 'D004'),
(5, 'Running Shoes', 95.00, 'Germany', 'D005');

INSERT INTO Order_Items (Order_Id, Item_Id, Quantity, Subtotal) VALUES
(1, 1, 1, 1500.00),
(2, 2, 1, 1800.00);

INSERT INTO Admins (Name, Email, Password) VALUES
('Admin One', 'admin1@store.com', 'adminpass1'),
('Admin Two', 'admin2@store.com', 'adminpass2');


