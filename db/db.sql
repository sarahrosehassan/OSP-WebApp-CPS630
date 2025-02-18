SET LINESIZE 120;
SET PAGESIZE 50;
SET COLSEP '|';

COLUMN Order_Id FORMAT 999;
COLUMN Item_Id FORMAT 999;
COLUMN User_Id FORMAT 999;
COLUMN Trip_Id FORMAT 999;
COLUMN Truck_Id FORMAT 999;
COLUMN Receipt_Id FORMAT 999;
COLUMN Payment_Code FORMAT A15;
COLUMN Name FORMAT A25;
COLUMN Email FORMAT A30;
COLUMN Balance FORMAT 99999.99;

BEGIN
  EXECUTE IMMEDIATE 'DROP TABLE Order_Items CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Delivery CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Inventory CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Credit_Card_Info CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Payment_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Shopping_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Truck_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Trip_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE User_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Item_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Order_Table CASCADE CONSTRAINTS';
  EXECUTE IMMEDIATE 'DROP TABLE Admins CASCADE CONSTRAINTS';
EXCEPTION
  WHEN OTHERS THEN NULL;  
END;
/ 

CREATE TABLE Order_Table (
    Order_Id INT PRIMARY KEY AUTO_INCREMENT,
    Date_Issued DATETIME NOT NULL,
    Date_Received DATETIME,
    Total_Price DECIMAL(10,2) NOT NULL,
    Payment_Code VARCHAR(50),
    User_Id INT NOT NULL,
    Trip_Id INT NOT NULL,
    Receipt_Id INT NOT NULL,
    FOREIGN KEY (User_Id) REFERENCES User_Table(User_Id),
    FOREIGN KEY (Trip_Id) REFERENCES Trip_Table(Trip_Id),
    FOREIGN KEY (Receipt_Id) REFERENCES Shopping_Table(Receipt_Id)
);

CREATE TABLE Item_Table (
    Item_Id INT PRIMARY KEY AUTO_INCREMENT,
    Item_Name VARCHAR(255) NOT NULL,
    Price DECIMAL(10,2) NOT NULL,
    Made_In VARCHAR(100),
    Department_Code VARCHAR(50)
);

CREATE TABLE User_Table (
    User_Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Tel_No VARCHAR(20) UNIQUE NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Address TEXT,
    City_Code VARCHAR(50),
    Login_Id VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Balance DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE Trip_Table (
    Trip_Id INT PRIMARY KEY AUTO_INCREMENT,
    Source_Code VARCHAR(50),
    Destination_Code VARCHAR(50),
    Distance_KM DECIMAL(10,2),
    Truck_Id INT NOT NULL,
    Price DECIMAL(10,2),
    FOREIGN KEY (Truck_Id) REFERENCES Truck_Table(Truck_Id)
);

CREATE TABLE Truck_Table (
    Truck_Id INT PRIMARY KEY AUTO_INCREMENT,
    Truck_Code VARCHAR(50) UNIQUE NOT NULL,
    Availability_Code VARCHAR(50) NOT NULL
);

CREATE TABLE Shopping_Table (
    Receipt_Id INT PRIMARY KEY AUTO_INCREMENT,
    Store_Code VARCHAR(50),
    Total_Price DECIMAL(10,2) NOT NULL
);

CREATE TABLE Payment_Table (
    Payment_Code VARCHAR(50) PRIMARY KEY,
    Payment_Type VARCHAR(50) NOT NULL,
    Status VARCHAR(50) NOT NULL,
    Transaction_Id VARCHAR(50) UNIQUE,
    Amount DECIMAL(10,2) NOT NULL
);

CREATE TABLE Credit_Card_Info (
    Card_Id INT PRIMARY KEY AUTO_INCREMENT,  
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
    Order_Item_Id INT PRIMARY KEY AUTO_INCREMENT,
    Order_Id INT NOT NULL,
    Item_Id INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Subtotal DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (Order_Id) REFERENCES Order_Table(Order_Id),
    FOREIGN KEY (Item_Id) REFERENCES Item_Table(Item_Id)
);

CREATE TABLE Inventory (
    Inventory_Id INT PRIMARY KEY AUTO_INCREMENT,
    Item_Id INT NOT NULL,
    Warehouse_Id INT NOT NULL,
    Stock_Quantity INT NOT NULL CHECK (Stock_Quantity >= 0),
    FOREIGN KEY (Item_Id) REFERENCES Item_Table(Item_Id),
    FOREIGN KEY (Warehouse_Id) REFERENCES Warehouse(Warehouse_Id)
);

CREATE TABLE Admins (
    Admin_Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL
);

CREATE TABLE Delivery (
    Delivery_Id INT PRIMARY KEY AUTO_INCREMENT,
    Order_Id INT NOT NULL,
    Truck_Id INT NOT NULL,
    Estimated_Delivery DATETIME NOT NULL,
    Delivery_Status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (Order_Id) REFERENCES Order_Table(Order_Id),
    FOREIGN KEY (Truck_Id) REFERENCES Truck_Table(Truck_Id)
);

INSERT INTO User_Table (Name, Tel_No, Email, Address, City_Code, Login_Id, Password, Balance) VALUES
('John Doe', '123-456-7890', 'johndoe@email.com', '123 Main St, NY', 'NYC001', 'johndoe', 'password123', 500.00),
('Jane Smith', '987-654-3210', 'janesmith@email.com', '456 Elm St, LA', 'LA002', 'janesmith', 'securepass456', 750.00),
('Alice Johnson', '555-333-2222', 'alicej@email.com', '789 Oak St, SF', 'SF003', 'alicej', 'pass789', 1000.00),
('Bob Williams', '222-666-8888', 'bobw@email.com', '159 Pine St, CHI', 'CHI004', 'bobw', 'mypassword', 200.00),
('Emma Brown', '777-555-9999', 'emmab@email.com', '753 Maple St, MIA', 'MIA005', 'emmab', 'strongpass', 1200.00);

INSERT INTO Truck_Table (Truck_Code, Availability_Code) VALUES
('TRK1001', 'Available'),
('TRK1002', 'Unavailable'),
('TRK1003', 'Available'),
('TRK1004', 'Available'),
('TRK1005', 'Unavailable');

INSERT INTO Trip_Table (Source_Code, Destination_Code, Distance_KM, Truck_Id, Price) VALUES
('NYC', 'LA', 4500.00, 1, 200.00),
('LA', 'SF', 600.00, 2, 50.00),
('CHI', 'NYC', 1200.00, 3, 100.00),
('SF', 'MIA', 5000.00, 4, 300.00),
('MIA', 'LA', 3200.00, 5, 150.00);

INSERT INTO Shopping_Table (Store_Code, Total_Price) VALUES
('ST001', 1200.00),
('ST002', 950.00),
('ST003', 750.00),
('ST004', 1800.00),
('ST005', 500.00);

INSERT INTO Payment_Table (Payment_Code, Payment_Type, Status, Transaction_Id, Amount) VALUES
('PAY001', 'Credit Card', 'Completed', 'TXN1001', 1200.00),
('PAY002', 'PayPal', 'Completed', 'TXN1002', 950.00),
('PAY003', 'Debit Card', 'Pending', 'TXN1003', 750.00),
('PAY004', 'Crypto', 'Completed', 'TXN1004', 1800.00),
('PAY005', 'Bank Transfer', 'Failed', 'TXN1005', 500.00);

INSERT INTO Credit_Card_Info (User_Id, Card_Holder_Name, Card_Number, Expiry_Date, CVV, Billing_Address, Card_Type, Is_Default) VALUES
(1, 'John Doe', '4111111111111111', '2026-05-31', '123', '123 Main St, NY', 'Visa', TRUE),
(2, 'Jane Smith', '5500000000000004', '2027-08-31', '456', '456 Elm St, LA', 'MasterCard', FALSE),
(3, 'Alice Johnson', '340000000000009', '2028-12-31', '789', '789 Oak St, SF', 'Amex', TRUE),
(4, 'Bob Williams', '6011000000000004', '2029-03-31', '234', '159 Pine St, CHI', 'Discover', FALSE),
(5, 'Emma Brown', '30000000000004', '2025-07-31', '345', '753 Maple St, MIA', 'Other', TRUE);

INSERT INTO Item_Table (Item_Name, Price, Made_In, Department_Code) VALUES
('Gucci Leather Bag', 1500.00, 'Italy', 'BAGS'),
('Louis Vuitton Tote', 1800.00, 'France', 'BAGS'),
('Prada High Heels', 1200.00, 'Italy', 'SHOES'),
('Nike Air Jordan', 220.00, 'USA', 'SHOES'),
('Balenciaga Sneakers', 1000.00, 'Spain', 'SHOES');

INSERT INTO Order_Table (Date_Issued, Date_Received, Total_Price, Payment_Code, User_Id, Trip_Id, Receipt_Id) VALUES
('2025-02-15 10:00:00', '2025-02-17 14:00:00', 1500.00, 'PAY001', 1, 1, 1),
('2025-02-16 11:30:00', '2025-02-18 16:00:00', 1800.00, 'PAY002', 2, 2, 2),
('2025-02-17 09:00:00', '2025-02-19 12:00:00', 750.00, 'PAY003', 3, 3, 3),
('2025-02-18 15:30:00', '2025-02-20 10:30:00', 1800.00, 'PAY004', 4, 4, 4),
('2025-02-19 13:45:00', '2025-02-21 17:00:00', 500.00, 'PAY005', 5, 5, 5);

INSERT INTO Order_Items (Order_Id, Item_Id, Quantity, Subtotal) VALUES
(1, 1, 1, 1500.00),
(2, 2, 1, 1800.00),
(3, 3, 1, 750.00),
(4, 4, 2, 440.00),
(5, 5, 1, 1000.00);

INSERT INTO Admins (Name, Email, Password) VALUES
('Admin One', 'admin1@store.com', 'adminpass1'),
('Admin Two', 'admin2@store.com', 'adminpass2'),
('Admin Three', 'admin3@store.com', 'adminpass3'),
('Admin Four', 'admin4@store.com', 'adminpass4'),
('Admin Five', 'admin5@store.com', 'adminpass5');

