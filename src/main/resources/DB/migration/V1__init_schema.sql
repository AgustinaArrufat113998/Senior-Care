CREATE DATABASE SenoirCare1

CREATE TABLE Genders (
    gender_id INT IDENTITY,
    description VARCHAR(50) NOT NULL,
    CONSTRAINT pk_Genders PRIMARY KEY (gender_id)
);

CREATE TABLE Provinces (
    province_id INT IDENTITY,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_Provinces PRIMARY KEY (province_id)
);

CREATE TABLE Cities (
    city_id INT IDENTITY,
    province_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_Cities PRIMARY KEY (city_id),
    FOREIGN KEY (province_id) REFERENCES Provinces(province_id)
);

CREATE TABLE Neighborhood (
    neighborhood_id INT IDENTITY,
    city_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    CONSTRAINT pk_Neighborhood PRIMARY KEY (neighborhood_id),
    FOREIGN KEY (city_id) REFERENCES Cities(city_id)
);

CREATE TABLE Specialties (
    specialty_id INT IDENTITY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT pk_Specialties PRIMARY KEY (specialty_id)
);
  -- EJ: AT., Enfermeria, Psicologia, Trabajo Social, Estudiante


CREATE TABLE Tips (
    tips_id INT IDENTITY,
    name VARCHAR(100) NOT NULL,
    CONSTRAINT pk_Tips PRIMARY KEY (tips_id)
);
-- EJ:--  EJ: Nutrición, Movilidad, Preferencias


--TABLAS PRINCIPALES

CREATE TABLE Addresses (
    address_id INT IDENTITY,
    street VARCHAR(50) NOT NULL,
    number VARCHAR(8),
    neighborhood_id INT,
    CONSTRAINT pk_Addresses PRIMARY KEY (address_id),
    FOREIGN KEY (neighborhood_id) REFERENCES Neighborhood(neighborhood_id)
);

CREATE TABLE ServiceStatus (
    status_id INT IDENTITY,
    description VARCHAR(20),
    CONSTRAINT pk_ServiceStatus PRIMARY KEY (status_id)
);

CREATE TABLE Users (
    user_id INT IDENTITY,
    name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nationality VARCHAR(50),
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    address_id INT,
	status_id INT
    CONSTRAINT pk_Users PRIMARY KEY (user_id),
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id), 
	FOREIGN KEY (status_id) REFERENCES ServiceStatus(status_id)
);


CREATE TABLE Families (
    family_id INT IDENTITY,
    user_id INT NOT NULL,
    relationship VARCHAR(50), -- hijo/a, hermano/a, sobrino/a, etc.
    emergency_contact VARCHAR(30),
    CONSTRAINT pk_Families PRIMARY KEY (family_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Caregivers (
    caregiver_id INT IDENTITY,
    user_id INT NOT NULL,
    work_area VARCHAR(100), 
    studies VARCHAR(200),
    experience VARCHAR(200),
    availability VARCHAR(200),
    rate DECIMAL(10,3),
    secondary_contact VARCHAR(100),
    specialty_id INT,
    CONSTRAINT pk_Caregivers PRIMARY KEY (caregiver_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (specialty_id) REFERENCES Specialties(specialty_id)
);


-- En el caso que alguien estudie/sea ya profesional ej: AT y Psicologia
CREATE TABLE CaregiverSpecialty (
    caregiver_id INT,
    specialty_id INT,
    CONSTRAINT pk_CaregiverSpecialty PRIMARY KEY (caregiver_id, specialty_id),
    FOREIGN KEY (caregiver_id) REFERENCES Caregivers(caregiver_id),
    FOREIGN KEY (specialty_id) REFERENCES Specialties(specialty_id)
);



CREATE TABLE Seniors (
    senior_id INT IDENTITY,
    family_id INT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    nationality VARCHAR(100),
    birth_date DATE,
    gender_id INT,
    CONSTRAINT pk_Seniors PRIMARY KEY (senior_id),
    FOREIGN KEY (family_id) REFERENCES Families(family_id),
    FOREIGN KEY (gender_id) REFERENCES Genders(gender_id)
);

CREATE TABLE MedicalRecords (
    record_id INT IDENTITY,
    senior_id INT NOT NULL,
    diseases VARCHAR(500),
    medications VARCHAR(600),
    allergies VARCHAR(300),
    uses_diapers BIT,
    reduced_mobility BIT,
    requires_special_diet BIT,
    notes VARCHAR(600),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_MedicalRecords PRIMARY KEY (record_id),
    FOREIGN KEY (senior_id) REFERENCES Seniors(senior_id)
);

CREATE TABLE VitalSigns (
    vital_id INT IDENTITY,
    senior_id INT NOT NULL,
    caregiver_id INT NOT NULL,
    date DATE,
    blood_pressure VARCHAR(20),
    temperature DECIMAL(4,1),
    heart_rate INT,
    glucose DECIMAL(5,2),
    notes VARCHAR(300),
    CONSTRAINT pk_VitalSigns PRIMARY KEY (vital_id),
    FOREIGN KEY (senior_id) REFERENCES Seniors(senior_id),
    FOREIGN KEY (caregiver_id) REFERENCES Caregivers(caregiver_id)
);

CREATE TABLE CareSuggestions (
    suggestion_id INT IDENTITY,
    type_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description VARCHAR(500),
    resource_url VARCHAR(300),
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_CareSuggestions PRIMARY KEY (suggestion_id),
    FOREIGN KEY (type_id) REFERENCES Tips(tips_id)
);

CREATE TABLE CareServices (
    service_id INT IDENTITY,
    senior_id INT NOT NULL,
    caregiver_id INT NOT NULL,
    family_id INT,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending',
    CONSTRAINT pk_CareServices PRIMARY KEY (service_id),
    FOREIGN KEY (senior_id) REFERENCES Seniors(senior_id),
    FOREIGN KEY (caregiver_id) REFERENCES Caregivers(caregiver_id),
    FOREIGN KEY (family_id) REFERENCES Families(family_id)
);

CREATE TABLE Reviews (
    review_id INT IDENTITY,
    service_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment VARCHAR(300),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_Reviews PRIMARY KEY (review_id),
    FOREIGN KEY (service_id) REFERENCES CareServices(service_id)
);


