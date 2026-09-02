CREATE DATABASE IF NOT EXISTS sarathi;
USE sarathi;

-- No separate admins table — an admin is a row in the same `users` table
-- riders/passengers live in, with role = 'Admin'. Only Admin rows need
-- password_hash populated (the mobile app's rider/passenger auth is a
-- separate concern from this admin panel).
CREATE TABLE users (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  role ENUM('Rider', 'Passenger', 'Admin') NOT NULL,
  password_hash VARCHAR(255),    -- only set for the Admin row(s)
  rating DECIMAL(2,1) DEFAULT 0,
  status ENUM('Active', 'Pending', 'Suspended') DEFAULT 'Active',
  vehicle VARCHAR(255),          -- riders only
  license_no VARCHAR(50),        -- riders only
  docs_verified BOOLEAN DEFAULT FALSE, -- riders only
  joined_date DATE DEFAULT (CURRENT_DATE)
);

CREATE TABLE rides (
  id VARCHAR(20) PRIMARY KEY,
  rider_id VARCHAR(20) REFERENCES users(id),
  rider_name VARCHAR(255),
  route VARCHAR(255),
  date_time DATETIME,
  seats INT,
  fare INT,
  status ENUM('Active', 'Ongoing', 'Completed', 'Cancelled') DEFAULT 'Active'
);

CREATE TABLE bookings (
  id VARCHAR(20) PRIMARY KEY,
  ride_id VARCHAR(20) REFERENCES rides(id),
  passenger_id VARCHAR(20) REFERENCES users(id),
  passenger_name VARCHAR(255),
  route VARCHAR(255),
  date_time DATETIME,
  payment ENUM('Paid', 'Pending', 'Refunded') DEFAULT 'Pending',
  status ENUM('Confirmed', 'Pending', 'Completed', 'Cancelled') DEFAULT 'Pending'
);

CREATE TABLE payments (
  id VARCHAR(20) PRIMARY KEY,
  booking_id VARCHAR(20) REFERENCES bookings(id),
  amount INT,
  method ENUM('eSewa', 'Khalti', 'Cash', 'Card'),
  transaction_id VARCHAR(100),
  date_time DATETIME,
  status ENUM('Completed', 'Pending', 'Failed') DEFAULT 'Pending'
);

CREATE TABLE reviews (
  id VARCHAR(20) PRIMARY KEY,
  booking_id VARCHAR(20) REFERENCES bookings(id),
  reviewer VARCHAR(255),
  reviewee VARCHAR(255),
  rating INT,
  comment TEXT,
  date DATE,
  status ENUM('Active', 'Flagged') DEFAULT 'Active'
);

CREATE TABLE kyc_submissions (
  id VARCHAR(20) PRIMARY KEY,
  rider_id VARCHAR(20) REFERENCES users(id),
  rider_name VARCHAR(255),
  vehicle VARCHAR(255),
  submitted_date DATE,
  status ENUM('Pending', 'Verified', 'Rejected') DEFAULT 'Pending',
  reviewed_by VARCHAR(20) REFERENCES users(id) -- the admin who reviewed it
);

CREATE TABLE kyc_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  submission_id VARCHAR(20) REFERENCES kyc_submissions(id) ON DELETE CASCADE,
  label VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL -- ideally a signed/private URL, not public
);
