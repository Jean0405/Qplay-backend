CREATE TABLE IF NOT EXISTS "User" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ExamCategory" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS "Subject" (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "Question" (
  id SERIAL PRIMARY KEY,
  questionText TEXT NOT NULL,
  optionA VARCHAR(255) NOT NULL,
  optionB VARCHAR(255) NOT NULL,
  optionC VARCHAR(255) NOT NULL,
  optionD VARCHAR(255) NOT NULL,
  correctOption VARCHAR(1) NOT NULL,
  status VARCHAR(10) DEFAULT 'pending',
  idUser INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  idExamCategory INT NOT NULL REFERENCES "ExamCategory"(id) ON DELETE CASCADE,
  idSubject INT NOT NULL REFERENCES "Subject"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "Exam" (
  id SERIAL PRIMARY KEY,
  idUser INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  idExamCategory INT NOT NULL REFERENCES "ExamCategory"(id) ON DELETE CASCADE,
  score INT DEFAULT 0,
  takenAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "ExamQuestion" (
  id SERIAL PRIMARY KEY,
  idExam INT NOT NULL REFERENCES "Exam"(id) ON DELETE CASCADE,
  idQuestion INT NOT NULL REFERENCES "Question"(id) ON DELETE CASCADE,
  selectedOption VARCHAR(1),
  isCorrect BOOLEAN
);


-- INSERT INTO "User" (username, email, password, role) VALUES
-- ('admin', 'admin@test.com', '$2b$10$22xsNkMIhTDWQ1G38Df84et8tgqNUwf5cbeTuCrkxqqjXDWV5k.4O', 'admin'),
-- ('juan', 'juan@test.com', '$2b$10$m73NyFSIhXcMxv3RbkRRC.JELwf2LDZv/kAsrlsv7k84eOiXrUnAG', 'user');


INSERT INTO "ExamCategory" (name, description) VALUES
('ICFES', 'Examen de Estado de Colombia'),
('Saber PRO', 'Evaluación profesional de competencias'),
('TyT', 'Técnicos y Tecnólogos');


INSERT INTO "Subject" (name) VALUES ('Matemáticas'), ('Lectura Crítica'), ('Inglés'), ('Ciencias Naturales'), ('Competencias Ciudadanas');


INSERT INTO "Question" (questionText, optionA, optionB, optionC, optionD, correctOption, status, idUser, idExamCategory, idSubject) VALUES
('¿Cuánto es 2 + 2?', '3', '4', '5', '6', 'B', 'approved', 1, 1, 1),
('La capital de Colombia es:', 'Medellín', 'Cali', 'Bogotá', 'Barranquilla', 'C', 'approved', 1, 1, 5),
('¿Cuál es el sinónimo de “rápido”?', 'Lento', 'Veloz', 'Pesado', 'Pequeño', 'B', 'approved', 1, 2, 2),
('What is the past of “go”?', 'Goed', 'Went', 'Go', 'Goes', 'B', 'approved', 1, 2, 3),
('¿Qué planeta es conocido como el planeta rojo?', 'Venus', 'Marte', 'Júpiter', 'Saturno', 'B', 'approved', 1, 1, 4),
('¿Cuál es la raíz cuadrada de 49?', '5', '6', '7', '8', 'C', 'approved', 1, 1, 1),
('Who is “she”?', 'Ella', 'Él', 'Ellos', 'Nosotros', 'A', 'approved', 1, 3, 3),
('¿Cuántos continentes existen?', '4', '5', '6', '7', 'D', 'approved', 1, 3, 5),
('¿Cuántos segundos tiene un minuto?', '30', '45', '60', '90', 'C', 'approved', 1, 1, 1),
('Cuál es el resultado de 15 x 3?', '35', '30', '45', '50', 'C', 'approved', 1, 1, 1);


INSERT INTO "Question" (questionText, optionA, optionB, optionC, optionD, correctOption, status, idUser, idExamCategory, idSubject) VALUES
('¿Qué gas es esencial para la respiración humana?', 'CO2', 'O2', 'N2', 'He', 'B', 'pending', 2, 1, 4),
('Sinónimo de “alegría”', 'Tristeza', 'Felicidad', 'Miedo', 'Rabia', 'B', 'pending', 2, 2, 2);


INSERT INTO "Exam" (idUser, idExamCategory, score)
VALUES (2, 1, 60);

INSERT INTO "ExamQuestion" (idExam, idQuestion, selectedOption, isCorrect)
VALUES
(1, 1, 'B', true),
(1, 6, 'C', true),
(1, 10, 'C', true),
(1, 2, 'A', false),
(1, 9, 'A', false);
